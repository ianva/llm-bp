# LLM Batch Processor (llm-bp)

A CLI tool for batch processing files using LLM prompts. Built with TypeScript and OpenAI's API.

## Setup

1. Configure environment:
   ```
   OPENAI_API_KEY=your-api-key-here
   OPENAI_BASE_URL=https://api.openai.com/v1
   OPENAI_MODEL=gpt-3.5-turbo
   MAX_CONCURRENT_REQUESTS=3
   MAX_RETRIES=3
   ```

2. Install:
   ```bash
   bun install
   bun run build
   ```

## Usage

### Basic Commands
```bash
# Single file
lmb -i input.txt -o output-dir -p "Your prompt"

# Multiple files
lmb -i "input/*.txt" -o output-dir -p "Your prompt"

# Using prompt file
lmb -i "input/*.txt" -o output-dir -f prompt.txt
```

### How to Use

1. **Prepare Your Files**
   - Put your input files in a directory
   - Files can be text, markdown, or code files

2. **Create Your Prompt**
   - Option 1: Direct prompt using `-p`
     ```bash
     lmb -i "*.md" -o output -p "Translate this to Chinese"
     ```
   - Option 2: Prompt file using `-f`
     ```bash
     # prompt.txt
     Please analyze this code and:
     1. List potential bugs
     2. Suggest improvements
     ```

3. **Process Files**
   - Process single file:
     ```bash
     lmb -i src/main.ts -o reviews -p "Review this code"
     ```
   - Process multiple files:
     ```bash
     lmb -i "src/**/*.ts" -o reviews -f code-review.txt
     ```

4. **Check Results**
   - Results will be saved in the output directory
   - Each input file will have a corresponding output file

Options:
```
-i, --input <path>       Input file/directory path
-o, --output <path>      Output directory path
-p, --prompt <text>      Prompt text
-f, --prompt-file <path> Path to prompt file
-c, --concurrency <num>  Max concurrent requests (default: 3)
-r, --retries <num>      Max retry attempts (default: 3)
```

## License

MIT
