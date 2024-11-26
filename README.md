# LLM Batch Processor (llm-bp)

A CLI tool for batch processing files using LLM prompts. Built with TypeScript and OpenAI's API.

## Features

- 🚀 Process text using OpenAI's GPT models
- 📝 Support both file input and pipeline input
- 🔄 Flexible output options (file or stdout)
- 📋 Use prompt strings or prompt files
- 🌐 Configurable OpenAI API settings

## Installation

1. Clone and install dependencies:
   ```bash
   git clone https://github.com/ianva/llm-bp.git
   cd llm-bp
   bun install
   ```

2. Build the project:
   ```bash
   bun run build
   ```

3. Make `lmb` available:
   ```bash
   # Create user bin directory if it doesn't exist
   mkdir -p ~/bin
   
   # Create symlink
   ln -s "$(pwd)/dist/index.js" ~/bin/lmb
   
   # Add to PATH (add to your ~/.zshrc or ~/.bashrc)
   export PATH="$HOME/bin:$PATH"
   ```

## Configuration

1. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your settings:
   ```bash
   # OpenAI API Configuration
   OPENAI_API_KEY=your-api-key-here
   OPENAI_BASE_URL=https://api.openai.com/v1
   OPENAI_MODEL=gpt-4  # or another available model
   ```

## Usage

### Basic Usage

1. Process file and print to stdout:
   ```bash
   # Using prompt string
   lmb input.txt -p "Summarize this text"
   
   # Using prompt file
   lmb input.txt -f prompts/summarize.txt
   ```

2. Process file and save to directory:
   ```bash
   # Using prompt string
   lmb input.txt ./output -p "Summarize this text"
   
   # Using prompt file
   lmb input.txt ./output -f prompts/summarize.txt
   ```

### Pipeline Usage

1. Process pipeline input and print to stdout:
   ```bash
   # Using prompt string
   echo "Hello, world" | lmb -p "Translate to Chinese"
   
   # Using prompt file
   echo "Hello, world" | lmb -f prompts/translate_to_chinese.txt
   ```

2. Process pipeline input and save to file:
   ```bash
   # Using prompt string
   echo "Hello, world" | lmb "" ./output -p "Translate to Chinese"
   
   # Using prompt file
   echo "Hello, world" | lmb "" ./output -f prompts/translate_to_chinese.txt
   ```

### Command Options

```bash
Usage: lmb [input] [output] [options]

Arguments:
  input   Input file (optional for pipeline input)
  output  Output directory (optional, prints to stdout if not specified)

Options:
  -p, --prompt <string>  Prompt string
  -f, --prompt-file <file>  Prompt file
  -h, --help  Display help
```

## Example Prompt Files

Create prompt files in the `prompts` directory:

1. Translation prompt (`prompts/translate_to_chinese.txt`):
   ```
   You are a professional, authentic machine translation engine.
   Translate the following text to Chinese
   ```

2. Code review prompt (`prompts/code_review.txt`):
   ```
   Review the following code and provide:
   1. Potential bugs or issues
   2. Suggestions for improvement
   3. Best practices that could be applied
   ```

## Tips

- For consistent results, use a lower temperature setting in your prompts
- Create reusable prompt files for common tasks
- Use stdout for quick tasks and file output for batch processing
- Pipe output to other commands for further processing:
  ```bash
  echo "Hello" | lmb -p "Translate to Chinese" | pbcopy  # Copy to clipboard
  ```

## License

MIT
