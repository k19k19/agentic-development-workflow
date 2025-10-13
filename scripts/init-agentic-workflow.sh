#!/bin/bash

# init-agentic-workflow.sh
# BMAD-style one-command setup - no manual steps required
# This script automates the complete integration of the Agentic Development Workflow Template

set -e # Exit immediately if a command exits with a non-zero status.

# --- Configuration ---
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATE_ROOT="$(dirname "$SCRIPT_DIR")"
PROJECT_ROOT="$(pwd)"

# --- Utility Functions ---
log_info() { echo -e "\033[0;34m[INFO]\033[0m $1"; }
log_success() { echo -e "\033[0;32m[SUCCESS]\033[0m $1"; }
log_warn() { echo -e "\033[0;33m[WARN]\033[0m $1"; }
log_error() { echo -e "\033[0;31m[ERROR]\033[0m $1"; exit 1; }

# --- Detect Execution Context ---
detect_context() {
    # Check if we're running from within the template directory
    if [ "$PROJECT_ROOT" = "$TEMPLATE_ROOT" ]; then
        log_error "⚠️  Cannot run from template directory itself.\n   Please run from your target project directory:\n   \$ cd /path/to/your/project\n   \$ bash /path/to/template/scripts/init-agentic-workflow.sh"
    fi

    # Check if template files exist
    if [ ! -d "$TEMPLATE_ROOT/.claude" ]; then
        log_error "Template files not found. Please ensure the script is in the template's scripts/ directory."
    fi

    log_info "✓ Template location: $TEMPLATE_ROOT"
    log_info "✓ Target project: $PROJECT_ROOT"
}

# --- Welcome Message ---
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info "🚀 Budget Agentic Workflow - One-Command Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

detect_context

# --- 1. Copy Core Template Files ---
log_info "📁 Step 1/7: Copying runtime automation..."

# Copy only automation assets – docs stay in the template
for dir in ".claude" "scripts"; do
    if [ ! -d "$PROJECT_ROOT/$dir" ]; then
        cp -r "$TEMPLATE_ROOT/$dir" "$PROJECT_ROOT/$dir"
        log_success "Created $dir/"
    else
        cp -rn "$TEMPLATE_ROOT/$dir/"* "$PROJECT_ROOT/$dir/" 2>/dev/null || true
        log_info "Merged $dir/ (existing files preserved)"
    fi
done

# Scaffold minimal app-docs structure without copying template content
APP_DOCS_DIRS=(
    "specs/active"
    "specs/archive"
    "specs/reference"
    "guides"
    "architecture"
    "mappings"
    "operations"
)

for relative_dir in "${APP_DOCS_DIRS[@]}"; do
    target_dir="$PROJECT_ROOT/app-docs/$relative_dir"
    if [ ! -d "$target_dir" ]; then
        mkdir -p "$target_dir"
        touch "$target_dir/.gitkeep"
    fi
done
log_success "Scaffolded app-docs/ directory"

# Create ai-docs structure (empty on install)
if [ ! -d "$PROJECT_ROOT/ai-docs" ]; then
    mkdir -p "$PROJECT_ROOT/ai-docs"
    touch "$PROJECT_ROOT/ai-docs/.gitkeep"
    log_success "Created ai-docs/ root"
else
    log_info "Preserved existing ai-docs/"
fi

LEGACY_AI_DOCS_DIRS=(plans builds sessions failures logs scout tasks)
for relative_dir in "${LEGACY_AI_DOCS_DIRS[@]}"; do
    if [ ! -d "$PROJECT_ROOT/ai-docs/$relative_dir" ]; then
        mkdir -p "$PROJECT_ROOT/ai-docs/$relative_dir"
        touch "$PROJECT_ROOT/ai-docs/$relative_dir/.gitkeep"
    fi
done

WORKFLOW_ROOT="$PROJECT_ROOT/ai-docs/workflow"
mkdir -p "$WORKFLOW_ROOT"
if [ ! -f "$WORKFLOW_ROOT/status-index.json" ]; then
    echo '{"features":[],"generatedAt":null,"version":"1.1","warnings":[]}' > "$WORKFLOW_ROOT/status-index.json"
    log_success "Initialized ai-docs/workflow/status-index.json"
fi

FEATURES_ROOT="$WORKFLOW_ROOT/features"
mkdir -p "$FEATURES_ROOT"
touch "$FEATURES_ROOT/.gitkeep"

# Ensure knowledge ledger scaffold exists
KNOWLEDGE_LEDGER_DIR="$PROJECT_ROOT/ai-docs/knowledge-ledger"
if [ ! -d "$KNOWLEDGE_LEDGER_DIR" ]; then
    mkdir -p "$KNOWLEDGE_LEDGER_DIR"
    log_success "Created ai-docs/knowledge-ledger/"
else
    log_info "Preserved ai-docs/knowledge-ledger/"
fi

LEDGER_FILE="$KNOWLEDGE_LEDGER_DIR/ledger.md"
if [ ! -f "$LEDGER_FILE" ]; then
    cat > "$LEDGER_FILE" <<'EOF'
# Knowledge Ledger (Stub)

This ledger lists adopted implementation decisions. Add a new entry to the
"Adopted Decisions" section whenever you promote a `KL-` RFC into the core
system. Move entries to "Superseded Decisions" when you replace them.

## Adopted Decisions

_None yet._

## Superseded Decisions

_None yet._
EOF
    log_success "Created ai-docs/knowledge-ledger/ledger.md"
else
    log_info "Preserved existing knowledge ledger"
fi

# Configuration files (copy if not exists)
CONFIG_FILES=(
    "eslint.config.mjs:optional"
    ".eslintrc.js:optional"
    ".prettierrc.js:optional"
)

for entry in "${CONFIG_FILES[@]}"; do
    file="${entry%%:*}"
    if [ ! -f "$PROJECT_ROOT/$file" ]; then
        cp "$TEMPLATE_ROOT/$file" "$PROJECT_ROOT/$file" 2>/dev/null || log_info "Skipped $file (not in template)"
    else
        log_info "Preserved existing $file"
    fi
done

log_success "Core files copied."
echo ""

# --- 2. Initialize CLAUDE.md from Template ---
log_info "📝 Step 2/7: Generating CLAUDE.md..."

if [ ! -f "$PROJECT_ROOT/CLAUDE.md" ]; then
    # Auto-detect project name from package.json or directory name
    if [ -f "$PROJECT_ROOT/package.json" ]; then
        PROJECT_NAME=$(node -pe "try { require('$PROJECT_ROOT/package.json').name } catch(e) { '' }" 2>/dev/null || echo "")
    fi

    if [ -z "$PROJECT_NAME" ]; then
        PROJECT_NAME=$(basename "$PROJECT_ROOT")
    fi

    # Generate CLAUDE.md from template
    cp "$TEMPLATE_ROOT/CLAUDE-TEMPLATE.md" "$PROJECT_ROOT/CLAUDE.md"

    # Replace placeholder with actual project name (works on both macOS and Linux)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/\[Project Name\]/$PROJECT_NAME/g" "$PROJECT_ROOT/CLAUDE.md"
    else
        sed -i "s/\[Project Name\]/$PROJECT_NAME/g" "$PROJECT_ROOT/CLAUDE.md"
    fi

    log_success "Created CLAUDE.md (project: $PROJECT_NAME)"
else
    log_info "Preserved existing CLAUDE.md"
fi

echo ""

# --- 3. Merge package.json ---
log_info "📦 Step 3/7: Merging package.json..."
PACKAGE_JSON="$PROJECT_ROOT/package.json"

if [ ! -f "$PACKAGE_JSON" ]; then
    log_warn "package.json not found. Creating a basic one."
    cat > "$PACKAGE_JSON" <<EOF
{
  "name": "$(basename "$PROJECT_ROOT")",
  "version": "1.0.0",
  "description": "Agentic workflow project",
  "scripts": {},
  "dependencies": {},
  "devDependencies": {}
}
EOF
fi

# Add/update scripts and dependencies
node -e "
  const fs = require('fs');
  const path = require('path');
  const pkgPath = path.join(process.cwd(), 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  pkg.scripts = pkg.scripts || {};
  pkg.scripts['baw:knowledge:manage'] = pkg.scripts['baw:knowledge:manage'] || 'node scripts/manage-knowledge.js';
  pkg.scripts['baw:session:start'] = pkg.scripts['baw:session:start'] || 'node scripts/tasks-session-start.js';
  pkg.scripts['baw:work'] = pkg.scripts['baw:work'] || 'node scripts/unified-dashboard.js';
  pkg.scripts['baw:workflow:sync'] = pkg.scripts['baw:workflow:sync'] || 'node scripts/update-workflow-status.js';
  pkg.scripts.test = pkg.scripts.test || 'jest --passWithNoTests';
  pkg.scripts.lint = pkg.scripts.lint || 'eslint .';
  pkg.scripts['lint:fix'] = pkg.scripts['lint:fix'] || 'eslint . --fix';
  pkg.scripts.format = pkg.scripts.format || 'prettier --write .';

  pkg.devDependencies = pkg.devDependencies || {};
  if (!pkg.devDependencies.eslint) pkg.devDependencies.eslint = '^9.37.0';
  if (!pkg.devDependencies['@eslint/js']) pkg.devDependencies['@eslint/js'] = '^9.37.0';
  if (!pkg.devDependencies.globals) pkg.devDependencies.globals = '^16.4.0';
  if (!pkg.devDependencies.jest) pkg.devDependencies.jest = '^29.7.0';
  if (!pkg.devDependencies.prettier) pkg.devDependencies.prettier = '^3.6.2';

  pkg.dependencies = pkg.dependencies || {};
  if (!pkg.dependencies.glob) pkg.dependencies.glob = '^10.3.10';
  if (!pkg.dependencies['@xenova/transformers']) pkg.dependencies['@xenova/transformers'] = '^2.17.2';

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log('✓ Scripts added: baw:knowledge:manage, baw:session:start, baw:work, baw:workflow:sync, test, lint, format');
  console.log('✓ Dependencies added: glob, @xenova/transformers, eslint, @eslint/js, globals, jest, prettier');
" || log_error "Failed to merge package.json"

log_success "package.json merged."
echo ""

# --- 4. Merge .gitignore ---
log_info "🔒 Step 4/7: Merging .gitignore..."
GITIGNORE="$PROJECT_ROOT/.gitignore"

if [ ! -f "$GITIGNORE" ]; then
    touch "$GITIGNORE"
    log_info "Created .gitignore"
fi

# Patterns to add if not already present
GIT_IGNORE_PATTERNS=(
    "node_modules/"
    ".env"
    ".env.local"
    "*.log"
    ".DS_Store"
    "ai-docs/workflow/features/*/builds/"
    "ai-docs/workflow/features/*/reports/"
    "ai-docs/workflow/features/*/sessions/"
    "ai-docs/workflow/features/*/workflow/"
    "!ai-docs/.gitkeep"
    "!ai-docs/**/.gitkeep"
    "!ai-docs/README.md"
)

for pattern in "${GIT_IGNORE_PATTERNS[@]}"; do
    if ! grep -qF "$pattern" "$GITIGNORE"; then
        echo "$pattern" >> "$GITIGNORE"
        log_info "  + $pattern"
    fi
done

log_success ".gitignore merged."
echo ""

# --- 5. Install Dependencies ---
log_info "⬇️  Step 5/7: Installing dependencies..."

if command -v npm &> /dev/null; then
    npm install --silent 2>&1 | grep -v "^npm WARN" || true
    log_success "Dependencies installed."
else
    log_warn "npm not found. Please install Node.js and run: npm install"
fi

echo ""

# --- 6. Prepare Workflow Automation ---
log_info "🧭 Step 6/7: Preparing workflow automation..."
mkdir -p "$PROJECT_ROOT/ai-docs/workflow/features"
log_info "Workflow automation directories confirmed."

echo ""

# --- 7. Final Reminders ---
log_info "✅ Step 7/7: Final reminders..."
log_info "Run 'npm install' if dependencies were not installed automatically."
log_info "After your first slash command, run 'npm run baw:workflow:sync' before opening the dashboard with 'npm run baw:work'."

# --- Clean Up Template Artifacts ---
log_info "🧹 Cleaning up template artifacts..."

# Remove QUICK-START.md if it exists (deprecated, merged into GETTING-STARTED)
if [ -f "$PROJECT_ROOT/QUICK-START.md" ]; then
    rm "$PROJECT_ROOT/QUICK-START.md"
    log_info "Removed deprecated QUICK-START.md (merged into GETTING-STARTED.md)"
fi

log_success "Cleanup complete."
echo ""

# --- Final Success Message ---
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_success "🎉 Setup Complete! Your project is ready."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
log_info "📋 Next Steps (no docs required):"
echo ""
echo "  1. Run your first slash command (e.g., /baw:scout or /baw:plan) to capture context."
echo ""
echo "  2. Refresh automation data:"
echo "     \$ npm run baw:workflow:sync"
echo "     \$ npm run baw:work"
echo ""
echo "  3. Need a reminder later? Type plain text and Claude will reply"
echo "     with the best slash command to run next."
echo ""
echo "  4. Ready to work? Typical entry points are:"
echo "     • /baw:quick \"add env var validation\"       # small change"
echo "     • /baw:scout_build \"add JWT auth\"            # medium change"
echo "     • /baw:full \"implement billing\" \"docs\" budget  # large change"
echo ""
echo "  5. After any build command, run /baw:test and follow the prompts."
echo ""
log_success "Happy shipping! 🚀"
echo ""
