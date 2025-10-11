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
    mkdir -p "$PROJECT_ROOT/ai-docs"/{plans,builds,sessions,failures,logs,scout,tasks}
    touch "$PROJECT_ROOT/ai-docs"/{.gitkeep,plans/.gitkeep,builds/.gitkeep,sessions/.gitkeep,failures/.gitkeep,logs/.gitkeep,scout/.gitkeep,tasks/.gitkeep}
    log_success "Created ai-docs/ structure (empty)"
else
    log_info "Preserved existing ai-docs/"
fi

# Configuration files (copy if not exists)
CONFIG_FILES=(
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
  pkg.scripts.vectorize = pkg.scripts.vectorize || 'node scripts/vectorize-docs.js';
  pkg.scripts.search = pkg.scripts.search || 'node scripts/search-docs.js';
  pkg.scripts['scale-detect'] = pkg.scripts['scale-detect'] || 'node scripts/detect-project-scale.js';
  pkg.scripts.lint = pkg.scripts.lint || 'eslint .';
  pkg.scripts['lint:fix'] = pkg.scripts['lint:fix'] || 'eslint . --fix';
  pkg.scripts.format = pkg.scripts.format || 'prettier --write .';

  pkg.devDependencies = pkg.devDependencies || {};
  if (!pkg.devDependencies.eslint) pkg.devDependencies.eslint = '^9.37.0';
  if (!pkg.devDependencies.prettier) pkg.devDependencies.prettier = '^3.6.2';

  pkg.dependencies = pkg.dependencies || {};
  if (!pkg.dependencies['@xenova/transformers']) pkg.dependencies['@xenova/transformers'] = '^2.17.2';

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log('✓ Scripts added: vectorize, search, scale-detect, lint, format');
  console.log('✓ Dependencies added: @xenova/transformers, eslint, prettier');
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
    "vector-store/"
    ".env"
    ".env.local"
    "*.log"
    ".DS_Store"
    "ai-docs/scout/"
    "ai-docs/plans/"
    "ai-docs/builds/"
    "ai-docs/sessions/"
    "ai-docs/failures/"
    "ai-docs/logs/"
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

# --- 6. Initialize Vector Store ---
log_info "🔍 Step 6/7: Initializing vector store..."

if [ ! -f "$PROJECT_ROOT/vector-store.json" ]; then
    echo '{"documents":[],"embeddings":[],"metadata":[]}' > "$PROJECT_ROOT/vector-store.json"
    log_success "Created empty vector-store.json"
else
    log_info "Preserved existing vector-store.json"
fi

# Run initial vectorization if docs exist
if command -v npm &> /dev/null && [ -d "$PROJECT_ROOT/app-docs" ]; then
    log_info "Vectorizing documentation..."
    npm run vectorize --silent 2>&1 | tail -1 || log_warn "Vectorization skipped (run 'npm run vectorize' later)"
    log_success "Documentation vectorized."
else
    log_info "Vectorization skipped (run 'npm run vectorize' when ready)"
fi

echo ""

# --- 7. Detect Project Scale ---
log_info "📊 Step 7/7: Detecting project scale..."

if command -v npm &> /dev/null && [ -f "$PROJECT_ROOT/scripts/detect-project-scale.js" ]; then
    echo ""
    npm run scale-detect --silent 2>&1 || log_warn "Scale detection failed"
    echo ""
else
    log_warn "Scale detection skipped (run 'npm run scale-detect' later)"
fi

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
echo "  1. Get the live dashboard with recommended slash command:"
echo "     \$ npm run tasks:session-start"
echo ""
echo "  2. Run the suggested command immediately (keeps vector store,"
echo "     knowledge ledger, and session automation in sync)."
echo ""
echo "  3. Need a reminder later? Type plain text and Claude will reply"
echo "     with the best slash command to run next."
echo ""
echo "  4. Ready to work? Typical entry points are:"
echo "     • /quick \"add env var validation\"       # small change"
echo "     • /scout_build \"add JWT auth\"            # medium change"
echo "     • /full \"implement billing\" \"docs\" budget  # large change"
echo ""
echo "  5. After any build command, run /test and follow the prompts."
echo ""
log_success "Happy shipping! 🚀"
echo ""
