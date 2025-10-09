# Troubleshooting Guide

**Quick solutions for common issues with the Agentic Development Workflow Template**

---

## 🔧 Slash Commands Not Appearing

### Problem: Custom slash commands don't show up in Claude Code CLI

**Most Common Causes:**

#### 0. Missing YAML Frontmatter Delimiters ⚠️ (CRITICAL)

**This was the root cause for the template's slash commands not loading!**

Slash commands MUST have YAML frontmatter delimiters (`---`) before and after the metadata.

**Check your command files:**
```bash
head -5 .claude/commands/scout.md
```

If you see this (INCORRECT):
```markdown
description: Use vector search...
argument-hint: [user_prompt]
```

Instead of this (CORRECT):
```markdown
---
description: Use vector search...
argument-hint: [user_prompt]
---
```

**Then your commands won't load!** See section "④ Invalid Command File Format" below for the fix.

#### 1. Claude Code CLI Session Not Restarted ⚡ (90% of cases)

Slash commands are loaded when Claude Code starts. After running the init script, you **must** restart your session.

**Solution:**
```bash
# 1. Exit current Claude Code session
exit

# 2. Navigate to your project directory
cd /path/to/your/project

# 3. Start Claude Code
claude-code

# 4. Verify commands are loaded
/help
# Look for commands marked with (project)
```

#### 2. Wrong Working Directory 📁

Claude Code CLI must be started from the directory containing `.claude/`.

**Solution:**
```bash
# Verify .claude directory exists
ls -la .claude/

# If it doesn't exist, you're in the wrong directory
# Navigate to your project root
cd /path/to/project-root

# Restart Claude Code
claude-code
```

#### 3. File Permission Issues 🔒

The `.claude` directory or command files might have incorrect permissions.

**Solution:**
```bash
# Fix directory permissions
chmod -R 755 .claude/

# Fix command file permissions
chmod 644 .claude/commands/*.md

# Restart Claude Code
claude-code
```

#### 4. Invalid Command File Format 📝

Slash command files must be valid Markdown with proper frontmatter.

**Verify command file structure:**
```bash
# Check a command file
head -10 .claude/commands/scout.md
```

**Expected format (CORRECT):**
```markdown
---
description: Brief description of the command
argument-hint: [arg1] [arg2]
allowed-tools: ["tool_name"]
model: claude-sonnet-4-5
---

# Command Name

## Purpose
Description of what the command does...
```

**Common mistake (INCORRECT - missing YAML delimiters):**
```markdown
description: Brief description of the command
argument-hint: [arg1] [arg2]
model: claude-sonnet-4-5

# Command Name
```

**Solution if invalid:**
- **⚠️ CRITICAL: Add YAML delimiters (`---`) before and after frontmatter**
- Ensure there's a blank line between closing `---` and content
- Compare with template files in this repository
- Ensure frontmatter has no syntax errors

**Quick fix script:**
```bash
# This fixes all command files missing YAML delimiters
for file in .claude/commands/*.md; do
  if head -1 "$file" | grep -q "^description:"; then
    sed -i '' '1s/^/---\n/' "$file"
    line_num=$(awk '/^$/ {print NR; exit}' "$file")
    sed -i '' "$((line_num + 1))i\\
---
" "$file"
  fi
done
```

After running the fix script, restart Claude Code for changes to take effect.

#### 5. Command Name Conflicts ⚠️

Project-level and user-level commands with the same name can conflict.

**Check for conflicts:**
```bash
# List project commands
ls .claude/commands/

# List user commands
ls ~/.claude/commands/ 2>/dev/null || echo "No user commands"
```

**Solution:**
- Rename conflicting commands
- Or remove one version (keep project or user level, not both)

---

## 🔍 Vector Search Issues

### Problem: `npm run search` returns no results or errors

#### 1. Vector Store Not Initialized

**Solution:**
```bash
# Generate vector embeddings
npm run vectorize

# This creates vector-store.json
# Try search again
npm run search -- "your query"
```

#### 2. Missing Dependencies

**Solution:**
```bash
# Install required packages
npm install

# Specifically check for transformers
npm list @xenova/transformers
```

#### 3. Empty Documentation Directories

The vector store needs content to index.

**Solution:**
```bash
# Check for documentation
ls -la ai-docs/
ls -la app-docs/

# If empty, add some docs or use direct file access instead
```

---

## 📦 Dependency Installation Issues

### Problem: `npm install` fails during init script

#### 1. No package.json in Project

**Solution:**
```bash
# The init script should create one, but verify
ls -la package.json

# If missing, create manually
npm init -y

# Run init script again
bash scripts/init-agentic-workflow.sh
```

#### 2. Node Version Incompatibility

**Solution:**
```bash
# Check Node version
node --version

# Ensure Node.js >= 16.x
# Update if needed via nvm or your package manager
```

#### 3. Network Issues

**Solution:**
```bash
# Try manual install
npm install --verbose

# Or use different registry
npm install --registry=https://registry.npmjs.org/
```

---

## 🤖 Workflow Execution Issues

### Problem: `/scout_plan_build` or other workflows fail

#### 1. Missing External Tools

Some slash commands rely on external CLI tools (gemini, codex, etc.).

**Check what's required:**
```bash
# Review command file
cat .claude/commands/scout.md

# Look for allowed-tools section
```

**Solution:**
- Install required MCP servers (see GETTING-STARTED.md)
- Or modify commands to use available tools

#### 2. Insufficient Permissions

**Solution:**
```bash
# Check .claude/settings.local.json
cat .claude/settings.local.json

# Ensure permissions allow file access
# Example:
# {
#   "permissions": {
#     "allow": ["Read(/path/to/project/**)"]
#   }
# }
```

#### 3. Token Budget Exceeded

**Solution:**
```bash
# Use budget mode
/scout_plan_build "your task" "" "budget"

# Or break into smaller tasks
/scout "find auth files" "2"
# Then use results manually
```

---

## 📋 Common Error Messages

### `Error: Command not found: /scout_plan_build`

**Cause:** Slash commands not loaded
**Solution:** See "Slash Commands Not Appearing" section above

### `Error: Cannot find module '@xenova/transformers'`

**Cause:** Dependencies not installed
**Solution:**
```bash
npm install @xenova/transformers
```

### `Error: vector-store.json not found`

**Cause:** Vector store not initialized
**Solution:**
```bash
npm run vectorize
```

### `Error: ENOENT: no such file or directory, open 'ai-docs/...'`

**Cause:** Directory structure not set up
**Solution:**
```bash
# Create required directories
mkdir -p ai-docs/scout-results
mkdir -p ai-docs/plans
mkdir -p ai-docs/builds
mkdir -p ai-docs/reports
mkdir -p app-docs/specs
mkdir -p app-docs/guides
```

### `Error: permission denied`

**Cause:** File permission issues
**Solution:**
```bash
# Fix script permissions
chmod +x scripts/*.sh

# Fix directory permissions
chmod -R 755 .claude/
```

---

## 🔄 Verification Checklist

After running the init script, verify everything is set up correctly:

### ✅ File Structure
```bash
# Check all required directories exist
ls -d .claude/ ai-docs/ app-docs/ scripts/

# Check slash commands copied
ls .claude/commands/ | wc -l
# Should show ~17 files
```

### ✅ Dependencies
```bash
# Verify package.json has required scripts
cat package.json | grep -E "vectorize|search|lint"

# Verify dependencies installed
npm list --depth=0
```

### ✅ Slash Commands
```bash
# Start Claude Code
claude-code

# In Claude Code:
/help
# Look for custom commands with (project) marker
```

### ✅ Vector Search
```bash
# Test vectorization
npm run vectorize

# Test search
npm run search -- "test query"
```

### ✅ Scripts Executable
```bash
# Check script permissions
ls -la scripts/*.sh

# Should all be executable (chmod +x if not)
chmod +x scripts/*.sh
```

---

## 🆘 Still Having Issues?

### Debugging Steps

1. **Check init script output:**
   ```bash
   # Re-run with verbose output
   bash -x scripts/init-agentic-workflow.sh 2>&1 | tee init-debug.log
   ```

2. **Verify template integrity:**
   ```bash
   # Ensure template files exist
   ls -la /path/to/template/.claude/commands/
   ```

3. **Check Claude Code version:**
   ```bash
   # Ensure you're using latest version
   claude-code --version
   ```

4. **Check for hidden issues:**
   ```bash
   # Look for hidden files
   ls -la .claude/

   # Check file encoding
   file .claude/commands/*.md
   ```

### Get Help

- **Documentation:** [GETTING-STARTED.md](GETTING-STARTED.md)
- **Examples:** Check `ai-docs/` after running workflows
- **Command Details:** See `.claude/commands/*.md` for prompts
- **Template Issues:** [GitHub Issues](https://github.com/anthropics/claude-code/issues)

---

## 📚 Related Documentation

- [README.md](README.md) - Complete template documentation
- [GETTING-STARTED.md](GETTING-STARTED.md) - Setup guide
- [QUICK-START.md](QUICK-START.md) - 5-minute walkthrough
- [MIGRATION-GUIDE.md](MIGRATION-GUIDE.md) - Upgrading from old SDK

---

**Last Updated:** October 2025
