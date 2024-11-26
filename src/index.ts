#!/usr/bin/env node

// Suppress the punycode deprecation warning
process.removeAllListeners('warning');
process.on('warning', (warning) => {
  if (warning.name === 'DeprecationWarning' && 
      warning.message.includes('punycode')) {
    return;
  }
  console.warn(warning);
});

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
  input: string,
  outputPath: string | null,
  prompt: string,
  isContent: boolean = false
): Promise<void> {
  const content = isContent ? input.trim() : await readFile(input, 'utf-8');
  
  const messages: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: prompt,
    },
    {
      role: 'user',
      content: content,
    },
  ];

  if (!isContent) {
    console.log('\n🔄 Processing:', input);
    console.log('📄 Content preview:', content.slice(0, 50).replace(/\n/g, ' '), '...');
  }
  
  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4',
    messages,
    temperature: 0.2, // Lower temperature for more consistent translations
  });

  const processedContent = completion.choices[0]?.message?.content;
  if (!processedContent) {
    throw new Error('No response from OpenAI');
  }

  // If no output directory specified, print to stdout
  if (!outputPath) {
    console.log('\n' + processedContent);
    return;
  }

  // Otherwise save to file
  console.log('✨ Result preview:', processedContent.slice(0, 50).replace(/\n/g, ' '), '...');
  const outputFile = isContent ? outputPath : join(outputPath, basename(input));
  await mkdir(dirname(outputFile), { recursive: true });
  await writeFile(outputFile, processedContent);
  console.log('💾 Saved to:', outputFile);
}

program
  .name('lmb')
  .description('Process text using LLM')
  .argument('[input]', 'Input file (optional for pipeline input)')
  .argument('[output]', 'Output directory (optional, prints to stdout if not specified)')
  .option('-p, --prompt <string>', 'Prompt string')
  .option('-f, --prompt-file <file>', 'Prompt file')
  .parse(process.argv);

const options = program.opts();
const [input, outputDir] = program.args;

async function main() {
  try {
    // Get prompt from either string or file
    let prompt = options.prompt;
    if (options.promptFile) {
      prompt = await readFile(options.promptFile, 'utf-8');
    }
    if (!prompt) {
      throw new Error('Please provide either --prompt or --prompt-file');
    }

    // Handle pipeline input
    if (!input && !process.stdin.isTTY) {
      let content = '';
      process.stdin.setEncoding('utf-8');
      for await (const chunk of process.stdin) {
        content += chunk;
      }
      const outputPath = outputDir ? join(outputDir, 'output.txt') : null;
      await processFile(content, outputPath, prompt, true);
    } 
    // Handle file input
    else if (input) {
      await processFile(input, outputDir, prompt, false);
    }
    else {
      throw new Error('Please provide an input file or pipe input');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
