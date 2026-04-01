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

All content lives in `lib/content/` (TypeScript files that export strings) and `content/` (Markdown source files). The virtual filesystem is assembled in `lib/filesystem.ts`.

### Update your personal intro (`whoami`)

Edit `lib/content/whoami.ts` directly — it exports a plain Markdown string:

```ts
// lib/content/whoami.ts
const whoami = `# Your Name

Brief bio, links, etc.
`;

export default whoami;
```

### Update the 2025 year overview

Edit `lib/content/year2025.ts`. It is another plain Markdown string export — update the goals, progress, reading list, etc. in place.

### Add a new project

1. Create a Markdown file in `content/projects/`, e.g. `content/projects/my-new-project.md`.
2. Import it and add it to the record in `lib/content/projects.ts`:

```ts
import myNewProject from "../../content/projects/my-new-project.md";

const projects: Record<string, string> = {
  "terminal-cv.md": terminalCv,
  "my-new-project.md": myNewProject, // 👈 add this line
};
```

The file will automatically appear under `~/projects/` in the terminal.

### Add a new post

1. Create a Markdown file in the appropriate year folder, e.g. `content/posts/2024/my-new-post.md`.
2. Import it and add it to the record in `lib/content/posts2024.ts`:

```ts
import myNewPost from "../../content/posts/2024/my-new-post.md";

const posts2024: Record<string, string> = {
  "building-a-data-pipeline.md": buildingDataPipeline,
  "my-new-post.md": myNewPost, // 👈 add this line
};
```

### Add a brand-new section / directory

To add a completely new directory to the terminal filesystem (e.g. `~/notes/`):

1. Create your content files in `content/` and a matching `lib/content/` TypeScript module that exports a `Record<string, string>`.
2. Register the new directory in `lib/filesystem.ts`:

```ts
import notes from "./content/notes";

export const filesystem: DirectoryNode = {
  type: "directory",
  children: {
    // ... existing entries ...
    notes: {
      type: "directory",
      children: Object.fromEntries(
        Object.entries(notes).map(([name, content]) => [
          name,
          { type: "file", content } as FileNode,
        ])
      ),
    },
  },
};
```

### Quick reference

| What you want to change | File to edit |
|-------------------------|--------------|
| Personal intro (`whoami`) | `lib/content/whoami.ts` |
| 2025 year overview | `lib/content/year2025.ts` |
| Projects list | `lib/content/projects.ts` + `content/projects/*.md` |
| 2024 posts | `lib/content/posts2024.ts` + `content/posts/2024/*.md` |
| Filesystem layout | `lib/filesystem.ts` |

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router, static export)
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
