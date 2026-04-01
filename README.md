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

### Add a new root-level plain file (no extension, like `whoami`)

1. Create `lib/content/myfile.ts` exporting a Markdown string:

```ts
// lib/content/myfile.ts
const myfile = `# My File

Some content here.
`;

export default myfile;
```

2. Register it in `lib/filesystem.ts`:

```ts
import myfile from "./content/myfile";

export const filesystem: DirectoryNode = {
  type: "directory",
  children: {
    // ... existing entries ...
    myfile: { type: "file", content: myfile }, // 👈 add this line
  },
};
```

The file will appear as `~/myfile` in the terminal (readable with `cat myfile`).

### Add a root-level `.md` file (like `example.md`)

1. Create `lib/content/example.ts` exporting a Markdown string:

```ts
// lib/content/example.ts
const example = `# Example

Some content here.
`;

export default example;
```

2. Register it in `lib/filesystem.ts` with the `.md` extension as the key:

```ts
import example from "./content/example";

export const filesystem: DirectoryNode = {
  type: "directory",
  children: {
    // ... existing entries ...
    "example.md": { type: "file", content: example }, // 👈 add this line
  },
};
```

The file will appear as `~/example.md` in the terminal (readable with `cat example.md`).

> **Tip:** For longer content, you can keep the text in a real Markdown file instead of a TypeScript string. Create `content/example.md`, then import it in your TypeScript file: `import example from "../../content/example.md";`

### Add a new folder with markdown files inside

1. Create one or more Markdown files in a new folder, e.g. `content/notes/first-note.md`.
2. Create `lib/content/notes.ts` that imports each file and exports a record:

```ts
// lib/content/notes.ts
import firstNote from "../../content/notes/first-note.md";

const notes: Record<string, string> = {
  "first-note.md": firstNote,
};

export default notes;
```

3. Register the new directory in `lib/filesystem.ts`:

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

The directory will appear as `~/notes/` in the terminal — navigate with `cd notes` and list files with `ls`.

### Quick reference

| What you want to change | File(s) to edit |
|-------------------------|-----------------|
| Personal intro (`whoami`) | `lib/content/whoami.ts` |
| Root-level plain file | `lib/content/<name>.ts` + `lib/filesystem.ts` |
| Root-level `.md` file | `lib/content/<name>.ts` + `lib/filesystem.ts` |
| Folder with `.md` files | `content/<folder>/*.md` + `lib/content/<folder>.ts` + `lib/filesystem.ts` |
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
