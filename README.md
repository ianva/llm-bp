# LLM File Processor

A CLI tool that processes files using OpenAI's API with configurable concurrency. Perfect for batch processing multiple files with LLM, such as translation, summarization, or code review.

## Features

- Process single or multiple files using glob patterns
- Configurable concurrency for parallel processing
- Support for both inline prompts and prompt files
- Progress tracking with content previews
- Automatic retry on failures
- Environment-based configuration

## Installation

### Option 1: Build from Source

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your OpenAI API key and other settings:
   ```
   OPENAI_API_KEY=your-api-key-here
   OPENAI_BASE_URL=https://api.openai.com/v1
   OPENAI_MODEL=gpt-3.5-turbo
   MAX_CONCURRENT_REQUESTS=3
   MAX_RETRIES=3
   ```
3. Install dependencies:
   ```bash
   bun install
   ```
4. Build the CLI:
   ```bash
   bun run build
   ```
   This will create a standalone executable `lmb` in the `dist` directory.

5. Make the CLI globally available:
   ```bash
   # Add to your PATH (add this to your .bashrc or .zshrc)
   export PATH="$PATH:/path/to/llm-batching/dist"
   
   # Or create a symlink
   ln -s /path/to/llm-batching/dist/lmb /usr/local/bin/lmb
   ```

### Option 2: Direct Download

Download the pre-built binary from the releases page and add it to your PATH.

## Usage

The `lmb` command provides a simple interface for processing files with LLM:

### Basic Commands

Process a single file:
```bash
lmb -i input.txt -o output-dir -p "Your prompt here"
```

Process multiple files:
```bash
lmb -i "input/*.txt" -o output-dir -p "Your prompt here"
```

Use a prompt file:
```bash
lmb -i "input/*.txt" -o output-dir -f prompts/translate.txt
```

### Example Use Cases

1. Translate files to Chinese:
```bash
lmb -i "docs/*.md" -o translated -f prompts/translate.txt
```

2. Review code files:
```bash
lmb -i "src/*.js" -o reviews -f prompts/code_review.txt
```

3. Summarize articles:
```bash
lmb -i "articles/*.txt" -o summaries -f prompts/summarize.txt
```

### Command Options

```
Usage: lmb [options]

Options:
  -i, --input <path>       Input file or directory path (required)
  -o, --output <path>      Output directory path (required)
  -p, --prompt <text>      Prompt text to use for processing files
  -f, --prompt-file <path> Path to file containing the prompt
  -c, --concurrency <num>  Maximum concurrent requests (default: 3)
  -r, --retries <num>      Maximum retry attempts (default: 3)
  -h, --help              Display help information
```

Note: Either `--prompt` or `--prompt-file` must be provided.

### Environment Configuration

The CLI can be configured using environment variables:

```bash
# Create a .env file in your working directory
OPENAI_API_KEY=your-api-key-here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-3.5-turbo
MAX_CONCURRENT_REQUESTS=3
MAX_RETRIES=3
```

### Output Format

The tool provides concise progress information:
```
🚀 Processing 3 files with concurrency 5

🔄 Processing: input/article1.txt
📄 Content preview: The Impact of Artificial Intelligence on Modern So ...
✨ Result preview: 人工智能对现代社会的影响 ...
✅ Saved to: output/article1.txt

📊 Final Results:
✅ Successfully processed: 3/3 files
```

### Error Handling

- Automatically retries failed requests
- Configurable retry count via environment variable or command line
- Detailed error reporting for failed files

## License

MIT
