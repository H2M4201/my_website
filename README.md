# Monorepo Structure

This repository uses a monorepo structure containing both the `homepage` and the `adminPage` projects.

## Git Workflow for Independent Development

You can develop both applications independently while tracking them in the same repository. By keeping their code in separate folders (`/homepage` and `/adminPage`), conflicts will be extremely rare because changes will naturally occur in different files.

Here is the recommended workflow to ensure smooth development:

### 1. Feature Branches
When starting new work, create a feature branch specifically for the project you are working on:

```bash
# For a homepage feature
git checkout -b feature/homepage-new-design

# For an admin page feature
git checkout -b feature/admin-dashboard
```

### 2. Scoped Commits
A commit message template has been configured (`.gitmessage`) to help you keep your commits organized. Use the standard Conventional Commits format with a scope:

```
feat(homepage): add hero section
fix(adminPage): resolve login error
chore(root): update workspace dependencies
```

### 3. Managing Conflicts
If you have different branches modifying shared files (e.g., if you later add a `/shared` folder or edit root config files), you may encounter a merge conflict when merging into `main`.

If a conflict occurs during a merge or rebase:
1. Run `git status` to see which files are in conflict.
2. Open the files and look for the conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`).
3. Manually resolve the code to keep the correct changes.
4. Run `git add <resolved-file>`.
5. Run `git commit` to finalize the merge (or `git rebase --continue` if rebasing).

*Tip:* Since the apps are in separate folders, you'll generally only see conflicts if two branches modify the *exact same file* in `homepage` or `adminPage` simultaneously.
