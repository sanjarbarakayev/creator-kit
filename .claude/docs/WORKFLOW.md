# Development Workflow Guide

## Quick Start

```bash
# Start dev server (in tmux for persistence)
tmux new-session -d -s dev "pnpm dev"

# Open Claude Code
claude

# Start working
/f "Add skeleton loaders"
```

## Commands

### Daily Work

| Command | When | Example |
|---------|------|---------|
| `/f "desc"` | New feature | `/f "Add skeleton loaders"` |
| `/b "desc"` | Fix a bug | `/b "Block editor not saving"` |
| `/r "desc"` | Refactor code | `/r "Extract block editor logic"` |
| `/h "desc"` | Quick urgent fix | `/h "Fix typo in login"` |

### Quality

| Command | When | Example |
|---------|------|---------|
| `/code-review` | After writing code | Reviews recent changes |
| `/verify` | Before PR/commit | Build + types + lint + tests + security |
| `/tdd` | Need tests first | `/tdd "Block reorder logic"` |
| `/e2e` | Test user flows | `/e2e "Test page creation flow"` |
| `/test-coverage` | Check coverage | Shows coverage report |
| `/build-fix` | Build broken | Fixes type/build errors |

### Planning & Advanced

| Command | When | Example |
|---------|------|---------|
| `/plan` | Before complex work | Creates step-by-step plan, waits for approval |
| `/task` | Interactive workflow | Asks task type, shows complexity |
| `/task security "desc"` | Security audit | `/task security "Review auth flow"` |
| `/task custom "agents" "desc"` | Custom agent chain | `/task custom "architect,tdd-guide" "Redesign block system"` |

### Maintenance

| Command | When | Example |
|---------|------|---------|
| `/refactor-clean` | Clean dead code | Finds unused exports/deps |
| `/update-docs` | Sync docs with code | Regenerates codemaps |
| `/update-codemaps` | Update architecture maps | Scans codebase structure |
| `/checkpoint` | Save progress | Snapshot current state |
| `/learn` | Extract patterns | Learns from recent code |
| `/security-review` | Security audit | Checks auth, input validation |

## Feature Workflow (what /f does)

```
1. PLAN    - Opus agent analyzes requirements, creates plan
2. APPROVE - You review and approve the plan
3. TEST    - Sonnet writes failing tests (TDD)
4. BUILD   - Sonnet implements to pass tests
5. REVIEW  - Opus reviews all changes
6. APPROVE - You do final review
7. COMMIT  - "feat: description"
```

## Custom Agent Chains

Chain any agents together via `/task custom`:

```bash
# Security-focused review
/task security "Review auth flow"
# Runs: security-reviewer -> code-reviewer -> architect

# Custom chain
/task custom "architect,tdd-guide,code-reviewer" "Redesign block system"

# Parallel agents (independent checks run simultaneously)
/task custom "code-reviewer,security-reviewer,architect" "Review upload system"
```

## Parallel Work (tmux)

Run multiple Claude instances on different tasks:

```bash
# Terminal 1: Start dev server
tmux new-session -d -s dev "pnpm dev"

# Terminal 2: Feature work
tmux new-session -s feature
claude
/f "Add video block"

# Terminal 3: Bug fix (separate pane/window)
tmux new-session -s bugfix
claude
/b "Fix block reorder"
```

Both Claude instances share the same codebase. Avoid editing the same files.

## What Happens Automatically

These run without you doing anything:

| Trigger | What happens |
|---------|-------------|
| Edit .ts/.tsx file | Prettier auto-formats, TypeScript check runs |
| Edit .js/.jsx file | Prettier auto-formats |
| Any code edit | console.log warning if found |
| `pnpm dev` | Blocked outside tmux |
| `git push` | Reminder to review changes |
| Create .md file | Blocked (except README, CLAUDE.md, .claude/) |
| Session end | console.log audit on all modified files |

## 9 Agents (auto-selected by commands)

| Agent | Does | Used by |
|-------|------|---------|
| planner | Creates implementation plans | `/f`, `/plan`, `/task` |
| architect | System design decisions | `/task custom`, `/task security` |
| tdd-guide | Writes tests first, then code | `/f`, `/b`, `/tdd` |
| code-reviewer | Reviews code quality | `/code-review`, `/f`, `/task` |
| security-reviewer | Finds vulnerabilities | `/security-review`, `/task security` |
| build-error-resolver | Fixes build/type errors | `/build-fix` |
| e2e-runner | Playwright E2E tests | `/e2e` |
| refactor-cleaner | Removes dead code | `/refactor-clean` |
| doc-updater | Updates documentation | `/update-docs`, `/update-codemaps` |

## Tips

1. **Start with `/f` or `/b`** for most work - they handle the full pipeline
2. **Use `/plan` first** if you're unsure about approach
3. **Run `/verify` before committing** - catches everything
4. **Parallel tmux panes** for independent features (don't edit same files)
5. **`/task custom`** when you want explicit control over agent order
6. **/h for quick fixes** - skips planning and review, fastest path
7. **Dev server in tmux** - hook will block it otherwise
