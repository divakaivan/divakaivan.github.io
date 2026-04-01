const projects: Record<string, string> = {
  "terminal-cv.md": `# terminal-cv

A terminal-like UI for my personal website. Users explore content using familiar Unix commands (\`ls\`, \`cat\`, \`cd\`).

## Tech Stack

- **Framework:** Next.js 15 (App Router, static export)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Deployment:** GitHub Pages

## Features

- Simulated filesystem with directory navigation
- Markdown rendering with images, tables, and code blocks
- Command history (↑/↓ arrows)
- Tab completion
- Responsive terminal UI

## Commands

\`\`\`bash
ls          # list files and directories
cat <file>  # display file contents (with markdown rendering)
cd <dir>    # change directory
whoami      # display personal info
pwd         # print working directory
help        # show available commands
clear       # clear the terminal
\`\`\`

## Links

- 🐙 [GitHub](https://github.com/divakaivan/terminal-cv)
- 🌐 [Live Site](https://divakaivan.github.io/terminal-cv)
`,

  "data-pipeline-toolkit.md": `# data-pipeline-toolkit

A lightweight Python toolkit for building reproducible data pipelines with built-in logging, schema validation, and retry logic.

## Motivation

Tired of copy-pasting the same boilerplate pipeline code across projects, I extracted the common patterns into a reusable package.

## Features

- **Schema validation** using Pydantic models
- **Retry logic** with exponential backoff
- **Structured logging** to both console and file
- **Checkpointing** so pipelines resume where they left off
- **CLI** for running and monitoring pipelines

## Quick Start

\`\`\`python
from data_pipeline_toolkit import Pipeline, CSVSource, PostgresSink

pipeline = Pipeline(
    source=CSVSource("data/raw/*.csv"),
    sink=PostgresSink(url="postgresql://localhost/mydb"),
    schema=MySchema,
)

pipeline.run()
\`\`\`

## Status

🚧 In active development — not yet production-ready.

## Links

- 🐙 [GitHub](https://github.com/divakaivan/data-pipeline-toolkit)
`,

  "ml-experiment-tracker.md": `# ml-experiment-tracker

A minimal experiment tracking tool for machine learning projects — no server required, everything stored locally in SQLite.

## Why Another Tracker?

MLflow and Weights & Biases are great, but overkill for solo projects. I wanted something I could run offline, store in git, and query with plain SQL.

## Features

- Tracks metrics, parameters, and artifacts per experiment run
- Stores everything in a local SQLite database
- Simple Python API and CLI
- Export to CSV or JSON
- Git integration (auto-records the current commit hash)

## Example

\`\`\`python
from ml_tracker import Experiment

with Experiment("bert-fine-tune") as exp:
    exp.log_param("learning_rate", 2e-5)
    exp.log_param("epochs", 3)

    # ... training loop ...

    exp.log_metric("accuracy", 0.923)
    exp.log_metric("f1_score", 0.918)
\`\`\`

## Query Your Experiments

\`\`\`bash
ml-tracker list --sort accuracy --top 5
\`\`\`

## Links

- 🐙 [GitHub](https://github.com/divakaivan/ml-experiment-tracker)
`,
};

export default projects;
