# MCP Configuration

This directory contains configuration files for Model Context Protocol (MCP) tools used in this project's agentic workflow.

## Available MCP Tools

### 1. Gemini MCP Tool
**Purpose**: Documentation, summarization, fast analysis
**Config**: `gemini-config.json`
**Use cases**:
- Reading and summarizing documentation
- Analyzing spec files
- Quick pattern extraction
- Format conversions

### 2. Codex MCP Tool (via CLI)
**Purpose**: Code generation, syntax fixes, UI/UX work
**Config**: `codex-config.json`
**Use cases**:
- Boilerplate generation
- Syntax error fixes
- UI component implementation
- Function/method implementation

### 3. Playwright MCP
**Purpose**: End-to-end testing
**Config**: `playwright-config.json`
**Use cases**:
- Generating E2E tests
- Running test suites
- Debug mode testing
- Visual regression testing

### 4. Shadcn MCP
**Purpose**: UI component library
**Config**: `shadcn-config.json`
**Use cases**:
- Adding standard UI components
- Component variants
- Theme customization

### 5. Firecrawl MCP
**Purpose**: Web scraping and documentation fetching
**Config**: `firecrawl-config.json`
**Use cases**:
- Fetching external documentation
- Scraping API references
- Gathering research material

## Setup Instructions

### 1. Install MCP Tools

```bash
# Gemini MCP (example - adjust based on actual tool)
npm install -g @google/gemini-mcp

# Codex CLI as MCP
npm install -g openai-codex-cli

# Playwright MCP
npm install -g @playwright/mcp

# Shadcn
npx shadcn-ui@latest init

# Firecrawl MCP
npm install -g @firecrawl/mcp
```

### 2. Configure Tools

Copy the example configs and update with your API keys:

```bash
cp .mcp/gemini-config.example.json .mcp/gemini-config.json
cp .mcp/codex-config.example.json .mcp/codex-config.json
# etc.
```

### 3. Set Environment Variables

Add to your `.env` file (DO NOT commit):

```bash
GEMINI_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
PLAYWRIGHT_API_KEY=your_key_here  # if needed
FIRECRAWL_API_KEY=your_key_here
```

### 4. Verify Setup

```bash
# Test each tool
gemini --version
codex --version
playwright --version
# etc.
```

## Configuration Files

### gemini-config.json

```json
{
  "default_model": "gemini-2.5-flash",
  "models": {
    "fast": "gemini-2.5-flash-lite",
    "standard": "gemini-2.5-flash",
    "pro": "gemini-2.5-pro"
  },
  "timeout": 30000,
  "max_tokens": 8000,
  "temperature": 0.7
}
```

### codex-config.json

```json
{
  "model": "gpt-5-codex",
  "reasoning_effort": "low",
  "modes": {
    "read-only": true,
    "execute": false
  },
  "timeout": 60000,
  "max_tokens": 4000
}
```

### playwright-config.json

```json
{
  "browsers": ["chromium", "firefox", "webkit"],
  "headless": true,
  "screenshot": "only-on-failure",
  "video": "retain-on-failure",
  "timeout": 30000
}
```

### shadcn-config.json

```json
{
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### firecrawl-config.json

```json
{
  "timeout": 30000,
  "max_depth": 2,
  "extract": {
    "markdown": true,
    "links": true,
    "metadata": true
  }
}
```

## Security Notes

- **Never commit API keys** to version control
- Use `.env` files and `.gitignore` them
- Rotate keys regularly
- Use minimal required permissions
- Monitor API usage

## Troubleshooting

### Tool not found
```bash
# Check if tool is installed
which gemini
which codex

# Reinstall if needed
npm install -g [tool-name]
```

### Authentication errors
```bash
# Verify API keys are set
echo $GEMINI_API_KEY
echo $OPENAI_API_KEY

# Re-export if needed
export GEMINI_API_KEY=your_key_here
```

### Timeout errors
```bash
# Increase timeout in config files
# Adjust network settings
# Check API rate limits
```

## Usage in Workflows

These MCP tools are automatically used by the scout-plan-build-report workflow:

- **Scout phase**: Gemini MCP (fast models for discovery)
- **Plan phase**: Gemini MCP (documentation analysis)
- **Build phase**: All tools based on task type
- **Report phase**: Gemini MCP (summarization)

See `ai-docs/workflows/*.md` for detailed usage in each phase.
