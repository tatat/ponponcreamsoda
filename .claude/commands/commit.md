---
description: Run quality checks and create a git commit
---

# Commit Command

Run quality checks (test, lint, format, type-check) and create a git commit following the project's conventions.

## Steps:

1. Run format first:

   - `npm run format`

2. Run test, lint, and type-check in parallel:

   - `npm test`
   - `npm run lint`
   - `npm run type-check`

3. Review changes:

   - `git status`
   - `git diff` (unstaged changes)
   - `git diff --cached` (staged changes)
   - `git log -3 --oneline` (recent commit style)

4. Create commit:

   - Add relevant files to staging area
   - Create commit with appropriate message format
   - Use HEREDOC format for multi-line commit messages
   - Include Claude Code attribution:

     ```
     🤖 Generated with [Claude Code](https://claude.com/claude-code)

     Co-Authored-By: Claude <noreply@anthropic.com>
     ```

5. Verify:
   - Run `git status` after commit to verify success

**Important Notes**:

- Follow the existing commit message style observed in git log
- Focus the commit message on the primary change
- Code organization done as part of implementing the main change is NOT refactoring - it's part of the main change itself
- Don't separately mention refactoring, restructuring, or code cleanup if it's done as part of implementing the primary feature/fix
