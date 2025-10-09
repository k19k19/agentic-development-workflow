#!/bin/bash

# Debug script for Claude Code slash commands

echo "=== Claude Code Slash Command Diagnostics ==="
echo ""

echo "1. Checking .claude/commands/ directory..."
if [ -d ".claude/commands" ]; then
    echo "   ✓ Directory exists"
    echo "   Found $(ls -1 .claude/commands/*.md 2>/dev/null | wc -l | xargs) command files"
else
    echo "   ✗ Directory not found!"
    exit 1
fi

echo ""
echo "2. Checking frontmatter format..."
for file in .claude/commands/*.md; do
    filename=$(basename "$file")

    # Check for frontmatter delimiters
    if head -1 "$file" | grep -q "^---$"; then
        echo "   ✓ $filename has opening ---"
    else
        echo "   ✗ $filename missing opening ---"
    fi

    # Check for description
    if head -10 "$file" | grep -q "^description:"; then
        echo "   ✓ $filename has description field"
    else
        echo "   ✗ $filename missing description field"
    fi
done

echo ""
echo "3. Checking for common issues..."

# Check for tabs in frontmatter
echo "   Checking for tabs (should use spaces)..."
tabs_found=0
for file in .claude/commands/*.md; do
    if head -10 "$file" | grep -P '\t' >/dev/null 2>&1; then
        echo "   ⚠ $(basename "$file") contains tabs in frontmatter"
        tabs_found=1
    fi
done
if [ $tabs_found -eq 0 ]; then
    echo "   ✓ No tabs found (good!)"
fi

echo ""
echo "4. Available commands (based on filename):"
for file in .claude/commands/*.md; do
    cmd_name=$(basename "$file" .md)
    desc=$(grep "^description:" "$file" | cut -d':' -f2- | xargs)
    echo "   /$cmd_name - $desc"
done

echo ""
echo "=== Next Steps ==="
echo "1. Exit current Claude Code session (type: exit)"
echo "2. Restart in debug mode: claude --debug"
echo "3. Look for 'Loaded custom slash commands:' in debug output"
echo "4. Try typing '/' in Claude Code to see autocomplete"
