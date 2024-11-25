# LLM Batch Processor (llm-bp)

A CLI tool for batch processing files using LLM prompts. Built with TypeScript and OpenAI's API.

## Setup

1. Configure environment:
   ```bash
   # Copy example config
   cp .env.example .env
   
   # Edit .env with your settings
   vim .env
   ```

   Environment variables:
   ```bash
   # OpenAI API Configuration
   OPENAI_API_KEY=your-api-key-here
   OPENAI_BASE_URL=https://api.openai.com/v1
   OPENAI_MODEL=gpt-3.5-turbo

   # Processing Configuration
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

### Example Use Cases

1. **Code Review**
   ```bash
   # Create prompt file
   echo "Please review this code:
   1. Identify potential bugs
   2. Suggest performance improvements
   3. Check for security issues" > prompts/code-review.txt

   # Process TypeScript files
   lmb -i "src/**/*.ts" -o code-reviews -f prompts/code-review.txt
   ```

2. **Translation**
   ```bash
   # Translate markdown docs to Chinese
   lmb -i "docs/*.md" -o translated-zh -p "Translate this markdown document to Chinese. Keep the markdown formatting intact."
   ```

3. **Text Processing**
   ```bash
   # Summarize articles
   lmb -i "articles/*.txt" -o summaries -p "Provide a concise summary of this article in 3 paragraphs."

   # Extract key points
   lmb -i "meeting-notes/*.txt" -o key-points -p "Extract the key action items and decisions from these meeting notes."
   ```

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
