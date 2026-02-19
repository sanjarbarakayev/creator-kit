# Hooks System

Hooks are configured in `.claude/hooks/hooks.json`.

## Active Hooks

### PreToolUse
- **Dev server blocker**: Blocks `pnpm dev` outside tmux
- **tmux reminder**: Suggests tmux for long-running commands
- **git push review**: Reminder before push
- **Doc blocker**: Blocks creation of unnecessary .md/.txt files (allows .claude/)

### PostToolUse
- **Prettier**: Auto-formats JS/TS files after edit
- **TypeScript check**: Runs tsc after editing .ts/.tsx files
- **console.log warning**: Warns about console.log in edited files
- **PR creation**: Logs PR URL after `gh pr create`

### Stop
- **console.log audit**: Checks all modified files for console.log
