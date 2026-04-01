# terminal-cv

A terminal-like UI for my personal website. Users explore content using familiar Unix commands (`ls`, `cat`, `cd`).

## Tech Stack

- **Framework:** Next.js 15 (App Router, static export)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Deployment:** GitHub Pages

## Features

- Simulated filesystem with directory navigation
- Markdown rendering with images, tables, and code blocks
- Syntax highlighted code blocks (`bat` command)
- Pager for long files (`less` command)
- Command history (↑/↓ arrows)
- Tab completion
- Responsive terminal UI

## Commands

```bash
ls          # list files and directories
cat <file>  # display file contents (markdown rendered)
bat <file>  # display file with syntax highlighting + line numbers
less <file> # page through a file (q to quit)
cd <dir>    # change directory
whoami      # display personal info
pwd         # print working directory
help        # show available commands
clear       # clear the terminal
```

## A Flower

Here's a test image rendered directly in the terminal:

![Types of Flowers](https://www.gardenia.net/wp-content/uploads/2023/05/types-of-flowers-780x520.webp)

## Links

- 🐙 [GitHub](https://github.com/divakaivan/terminal-cv)
- 🌐 [Live Site](https://divakaivan.github.io/terminal-cv)
