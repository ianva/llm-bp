#!/usr/bin/env bun
import { program } from 'commander';
import { config } from 'dotenv';
import OpenAI from 'openai';
import PQueue from 'p-queue';
import { glob } from 'glob';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname, basename } from 'node:path';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

// Load environment variables
config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

async function processFile(
  filePath: string,
  outputDir: string,
  prompt: string,
): Promise<void> {
  const content = await readFile(filePath, 'utf-8');
  
  const messages: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: prompt,
    },
    {
      role: 'user',
      content: `Input:\n\n ${content}`,
    },
  ];

  console.log('\n🔄 Processing:', filePath);
  console.log('📄 Content preview:', content.slice(0, 50).replace(/\n/g, ' '), '...');
  
  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4-mini',
    messages,
  });

  const processedContent = completion.choices[0]?.message?.content;
  if (!processedContent) {
    throw new Error('No response from OpenAI');
  }

  console.log('✨ Result preview:', processedContent.slice(0, 50).replace(/\n/g, ' '), '...');

  const outputPath = join(outputDir, basename(filePath));
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, processedContent);
  
  console.log(`✅ Saved to: ${outputPath}\n`);
}

async function main() {
  program
    .name('llm-file-processor')
    .description('Process files using OpenAI API with configurable concurrency')
    .requiredOption('-i, --input <path>', 'Input file or directory path')
    .requiredOption('-o, --output <path>', 'Output directory path')
    .option('-p, --prompt <text>', 'Prompt text to use for processing files')
    .option('-f, --prompt-file <path>', 'Path to file containing the prompt')
    .option(
      '-c, --concurrency <number>',
      'Maximum number of concurrent requests',
      process.env.MAX_CONCURRENT_REQUESTS || '5'
    )
    .option(
      '-r, --retries <number>',
      'Maximum number of retries per file',
      process.env.MAX_RETRIES || '3'
    )
    .parse();

  const options = program.opts();

  // Initialize queue with concurrency limit
  const queue = new PQueue({
    concurrency: parseInt(options.concurrency),
    autoStart: true,
  });

  // Get prompt from either text or file
  let prompt: string;
  if (options.promptFile) {
    try {
      prompt = await readFile(options.promptFile, 'utf-8');
    } catch (error) {
      console.error('Error reading prompt file:', error);
      process.exit(1);
    }
  } else if (options.prompt) {
    prompt = options.prompt;
  } else {
    console.error('Either --prompt or --prompt-file must be provided');
    process.exit(1);
  }

  // Create a task wrapper with retry logic
  const createRetryableTask = (task: () => Promise<void>, filePath: string) => {
    let attempts = 0;
    const maxRetries = parseInt(options.retries);

    const retryableTask = async (): Promise<void> => {
      try {
        return await task();
      } catch (error) {
        attempts++;
        if (attempts <= maxRetries) {
          const delay = Math.min(1000 * 2 ** (attempts - 1), 10000);
          console.log(
            `⚠️ Attempt ${attempts} failed for ${filePath}. Retrying in ${delay}ms... (${maxRetries - attempts + 1} retries left)`
          );
          await new Promise(resolve => setTimeout(resolve, delay));
          return retryableTask();
        }
        console.error(`❌ Failed to process ${filePath} after ${maxRetries} attempts`);
        throw error;
      }
    };

    return retryableTask;
  };

  try {
    // Create output directory if it doesn't exist
    await mkdir(options.output, { recursive: true });

    // Get all input files
    const files = await glob(options.input, { nodir: true });
    
    if (files.length === 0) {
      console.error('No input files found');
      process.exit(1);
    }

    console.log(`🚀 Processing ${files.length} files with concurrency ${options.concurrency}`);

    // Add all files to the queue with retry logic
    const tasks = files.map(file => ({
      file,
      task: createRetryableTask(
        async () => processFile(file, options.output, prompt),
        file
      )
    }));

    // Process all files and collect results
    const results = await Promise.allSettled(
      tasks.map(({ task }) => queue.add(task))
    );

    // Generate final report
    const successCount = results.filter(result => result.status === 'fulfilled').length;
    const failedCount = results.filter(result => result.status === 'rejected').length;

    console.log('\n📊 Final Results:');
    console.log(`✅ Successfully processed: ${successCount}/${files.length} files`);
    if (failedCount > 0) {
      console.error(`❌ Failed to process: ${failedCount} files`);
    }

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

await main();
