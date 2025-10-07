# User Memory vs Project Memory - What Goes Where?

Quick reference to understand the difference between **User Memory** (global) and **Project CLAUDE.md** (project-specific).

---

## 📊 Comparison Table

| Aspect | User Memory | Project CLAUDE.md |
|--------|-------------|-------------------|
| **Scope** | All projects | Single project |
| **Location** | Claude Code global settings | Project root: `CLAUDE.md` |
| **Updates** | Quarterly or when learning new patterns | Weekly or per feature |
| **Size** | ~5-10K words | ~2-5K words |
| **Focus** | Universal principles, tool routing | Project architecture, navigation |

---

## 🌍 User Memory (USER-MEMORY-CLAUDE.md)

**Copy this to your Claude Code global settings**

### What Belongs Here:

✅ **Universal principles** (apply to ALL projects)
- R&D framework philosophy
- Tool delegation rules
- Pre-implementation protocol
- Code quality standards
- Security checklist
- Documentation standards
- Git commit format

✅ **Workflow selection logic**
- Small project → Direct
- Medium project → Scout + Build
- Large project → Full workflow

✅ **Tool-specific guidelines**
- When to use Gemini MCP
- When to use Codex MCP
- When to use Claude
- When to use Playwright MCP

✅ **Debugging protocols**
- Step-by-step process
- Decision trees
- Common patterns

✅ **Token optimization rules**
- General strategies
- Tool preference order
- Efficiency targets

❌ **What DOESN'T belong:**
- Specific file paths from a project
- Project-specific architecture
- Feature specifications
- Tech stack details for one project
- Custom commands for one project

### Example from User Memory:

```markdown
## Tool Delegation Strategy (Universal)

Single file + syntax? → Codex MCP
Documentation task? → Gemini MCP
Multi-file + logic? → Claude
Testing? → Playwright MCP
```

**This applies to EVERY project, so it's in user memory.**

---

## 🎯 Project CLAUDE.md (From Template)

**One per project, in project root**

### What Belongs Here:

✅ **Project-specific details**
- Project name and purpose
- Architecture summary
- Tech stack (Node.js, Python, React, etc.)
- Service boundaries
- Database schema overview

✅ **Project navigation**
- Where to find features
- Key file locations
- Module organization
- Documentation locations

✅ **Project commands**
- How to run dev server
- How to run tests
- Deployment commands
- Custom scripts

✅ **Project patterns**
- Service pattern in THIS project
- API endpoint structure in THIS project
- Component architecture in THIS project

✅ **Current state**
- Active development phase
- Recent changes
- Known issues specific to this project
- Work in progress

✅ **Project workflows**
- When to use which workflow for THIS project
- Project scale (Small/Medium/Large)
- Custom slash commands for THIS project

❌ **What DOESN'T belong:**
- Universal principles (those go in user memory)
- Tool delegation rules (universal)
- General debugging protocols (universal)
- Standards that apply to all projects

### Example from Project CLAUDE.md:

```markdown
## Architecture Summary

Backend: Node.js/Express + Socket.io + SQLite
Frontend: React + TypeScript + Vite
Real-time: WebSocket (port 3003)

**Service boundaries:**
- IoT Gateway (port 4003): GPS protocol handling
- Web Service (port 3003): API + WebSocket
- Database: SQLite (data/gps_tracking.db)
```

**This is specific to THIS project, so it's in project CLAUDE.md.**

---

## 🔍 Side-by-Side Examples

### Example 1: Code Quality

**User Memory (Universal):**
```markdown
## Code Quality Standards

- File size: Target 300-500 lines
- Tests: >80% coverage
- Security: Input validation, parameterized queries
- Organization: Separation of concerns
```

**Project CLAUDE.md (Specific):**
```markdown
## Code Quality for IoT Analytics

- Service classes: app/services/*.js
- Test files: app/services/*.test.js
- Current coverage: 87% (target: >80% ✅)
- Linting: ESLint with Airbnb style
```

### Example 2: Documentation

**User Memory (Universal):**
```markdown
## Documentation Standards

Every project needs:
- CLAUDE.md (project memory)
- README.md (setup, usage)
- app-docs/specs/ (features)
- app-docs/guides/ (patterns)
```

**Project CLAUDE.md (Specific):**
```markdown
## Documentation Hub

- Specs: app-docs/specs/authentication.md
- API Docs: app-docs/architecture/API-ENDPOINTS.md
- Feature Map: app-docs/mappings/feature-to-source.md
- Debugging: app-docs/debugging/known-issues.md
```

### Example 3: Workflows

**User Memory (Universal):**
```markdown
## Workflow Selection

Small projects (<10 files):
  → Direct implementation (~10K tokens)

Medium projects (10-50 files):
  → /scout_build (~40K tokens)

Large projects (>50 files):
  → /scout_plan_build_report (~95K tokens)
```

**Project CLAUDE.md (Specific):**
```markdown
## Project Scale: LARGE (>50 files)

Recommended workflow: /scout_plan_build_report

Quick commands:
  npm run dev        # Start IoT gateway + web server
  npm test           # Run test suite
  node scripts/send-gps-data.js  # Test GPS ingestion
```

---

## 🎯 Quick Decision Guide

### Ask yourself: "Does this apply to ALL my projects?"

**YES → User Memory**
- Tool delegation rules
- Pre-implementation protocol
- Code quality standards
- Git commit format
- Debugging process
- Security checklist

**NO → Project CLAUDE.md**
- This project's architecture
- File locations in THIS project
- Commands for THIS project
- Tech stack of THIS project
- Current status of THIS project

---

## 📝 Setup Instructions

### Step 1: Setup User Memory (One Time)

1. **Copy universal principles:**
   ```bash
   cp USER-MEMORY-CLAUDE.md ~/claude-user-memory.md
   ```

2. **Add to Claude Code global settings:**
   - Open Claude Code settings
   - Find "User Memory" or "Global Project Memory"
   - Paste contents of `USER-MEMORY-CLAUDE.md`

3. **Update quarterly:**
   - Review every 3 months
   - Add new patterns learned
   - Update tool delegation if needed

### Step 2: Setup Project Memory (Per Project)

1. **Copy template to project:**
   ```bash
   cp CLAUDE-TEMPLATE.md ~/my-project/CLAUDE.md
   ```

2. **Customize for project:**
   - Replace `[Project Name]`
   - Update "Architecture Summary"
   - Add project-specific commands
   - Update "Current Project State"

3. **Update per feature:**
   - Update after significant changes
   - Keep "Recent Changes" current
   - Link to new documentation

---

## 🔄 Maintenance

### User Memory Updates

**When to update:**
- ✅ Learned a new universal pattern
- ✅ Found better tool delegation strategy
- ✅ Discovered new debugging technique
- ✅ Updated workflow decision logic

**How often:**
- Quarterly review (every 3 months)
- Or after major learnings

### Project Memory Updates

**When to update:**
- ✅ After each feature implementation
- ✅ Architecture changes
- ✅ New documentation added
- ✅ Tech stack changes
- ✅ Known issues discovered

**How often:**
- After major features
- Weekly for active projects
- `/report` phase can auto-update some sections

---

## ⚡ Pro Tips

### 1. Start with User Memory

Set up your user memory ONCE, use across all projects:
```bash
# Setup global principles (one time)
1. Copy USER-MEMORY-CLAUDE.md to Claude settings
2. Done! Works for all projects now.
```

### 2. Clone Project Memory

For each new project:
```bash
# Quick project setup
cp ~/templates/agentic-workflow/CLAUDE-TEMPLATE.md ~/new-project/CLAUDE.md
# Edit new-project/CLAUDE.md with project specifics
```

### 3. Keep User Memory DRY

If you find yourself copying the same text to multiple project CLAUDE.md files → **Move it to user memory!**

**Example:**
```
Found in 3 project CLAUDE.md files:
"Always validate input with Joi schema"

→ Move to USER-MEMORY-CLAUDE.md under "Security Standards"
→ Remove from individual projects
```

### 4. Reference, Don't Duplicate

In project CLAUDE.md:
```markdown
✅ GOOD:
"See user memory for tool delegation rules. This project uses the standard approach."

❌ BAD:
[Copies entire tool delegation section from user memory]
```

---

## 📚 Real-World Example

### Your IoT Analytics Project

**In USER-MEMORY-CLAUDE.md (Global):**
```markdown
## Pre-Implementation Protocol

Before ANY code changes:
1. Read app-docs/specs/ (via Gemini)
2. Check app-docs/mappings/
3. Confirm approach with user
4. WAIT for approval

## Tool Delegation

Boilerplate → Codex MCP
Documentation → Gemini MCP
Complex logic → Claude
```

**In ~/iot-analytics-app/CLAUDE.md (Project-Specific):**
```markdown
## IoT Analytics App

**Architecture**: Node.js + Express + Socket.io + SQLite

**Services:**
- IoT Gateway (port 4003): GPS protocol handlers
- Web Service (port 3003): REST API + WebSocket

**Quick Commands:**
```bash
node backend/app.js              # Combined mode
node backend/iot-gateway-service.js  # Gateway only
```

**Known Issues:**
- Port 80 conflict: Run `sudo apachectl stop`
- String concatenation bug: Fixed in commit abc123

**Current Phase**: Phase 1 (60% complete)
```

---

## ✅ Verification Checklist

### User Memory is Correct When:

- [x] Contains NO specific file paths from any project
- [x] Contains NO project-specific commands
- [x] Contains NO architecture specific to one project
- [x] ALL content applies to EVERY project you work on
- [x] Changes infrequently (quarterly updates)

### Project CLAUDE.md is Correct When:

- [x] Contains THIS project's architecture
- [x] Contains THIS project's file locations
- [x] Contains THIS project's commands
- [x] References user memory for universal rules
- [x] Updates frequently (weekly or per feature)

---

## 🎉 Summary

**User Memory = The Rules of the Game**
- How to play (tool delegation, workflows)
- What's always true (standards, protocols)
- Universal strategies (debugging, optimization)

**Project CLAUDE.md = The Current Game State**
- What's on the board (architecture, files)
- Special moves (project commands, patterns)
- Score and status (current phase, known issues)

**Together they enable:**
- ✅ Consistency across all projects (from user memory)
- ✅ Project-specific efficiency (from project CLAUDE.md)
- ✅ 90%+ token efficiency (both working together)
- ✅ Handle multiple enterprise projects simultaneously

---

**Now you know exactly what goes where!** 🎯

Copy:
- `USER-MEMORY-CLAUDE.md` → Claude Code global settings (ONE TIME)
- `CLAUDE-TEMPLATE.md` → `CLAUDE.md` in each project (PER PROJECT)
