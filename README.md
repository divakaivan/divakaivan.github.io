# terminal-cv

A terminal-like personal website built with Next.js. Visitors explore your content using familiar Unix commands (`ls`, `cat`, `cd`).

**Live site:** https://divakaivan.github.io/terminal-cv

## Features

- 🖥️ Full terminal UI with a blinking cursor and command prompt
- 📁 Simulated filesystem — navigate directories and read files
- 📝 Markdown rendering — headings, lists, code blocks, tables, and images
- ⌨️ Command history with ↑/↓ arrow key navigation
- ↹ Tab completion for file and directory names
- `Ctrl+L` / `clear` to clear the terminal

## Available Commands

```
ls [path]     List directory contents
cat <file>    Display file contents (markdown rendered)
cd <dir>      Change directory
pwd           Print working directory
whoami        Display personal information
help          Show available commands
clear         Clear the terminal
```

## Filesystem Structure

```
~/
├── whoami          Personal introduction
├── 2024/           Posts and notes from 2024
│   └── *.md
├── 2025.md         Year overview for 2025
└── projects/       Project write-ups
    └── *.md
```

## Customising Your Content

All content lives in `lib/content/`:

| File | What it controls |
|------|-----------------|
| `lib/content/whoami.ts` | Your personal intro (shown by `whoami`) |
| `lib/content/posts2024.ts` | Posts from 2024 (add more key/value pairs) |
| `lib/content/year2025.ts` | Your 2025 overview |
| `lib/content/projects.ts` | Project write-ups |

To add a new file to the filesystem, add an entry to the appropriate `Record<string, string>` export (or create a new content file and register it in `lib/filesystem.ts`).

## Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router, static export)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [react-markdown](https://github.com/remarkjs/react-markdown)
- Deployed to [GitHub Pages](https://pages.github.com/)

## Local Development

```bash
npm install
npm run dev      # http://localhost:3000
```

## Deployment

The site is automatically built and deployed to GitHub Pages on every push to `main` via the workflow at `.github/workflows/deploy.yml`.

To enable GitHub Pages in your repo:
1. Go to **Settings → Pages**
2. Set Source to **GitHub Actions**
