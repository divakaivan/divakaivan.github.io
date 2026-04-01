const posts2024: Record<string, string> = {
  "building-a-data-pipeline.md": `# Building a Data Pipeline from Scratch

*March 14, 2024*

---

After months of wrangling messy CSVs and one-off scripts, I finally sat down and built a proper data pipeline. Here's what I learned.

## The Problem

Every project starts the same way: someone hands you a folder of CSV files, a vague brief, and a deadline. The temptation is to write a quick script that "just works." But tech debt compounds fast.

## The Stack

I settled on:

- **Ingestion:** Python + pandas for local files, SQLAlchemy for databases
- **Transformation:** dbt for SQL-based transformations
- **Orchestration:** Prefect (lightweight, local-first)
- **Storage:** PostgreSQL

## Key Lessons

1. **Schema first** — define what clean data looks like before writing a single line of ETL code.
2. **Idempotency matters** — pipelines should be safe to re-run.
3. **Log everything** — future-you will thank present-you.

## Code Snippet

\`\`\`python
import pandas as pd
from sqlalchemy import create_engine

def load_csv(path: str, engine) -> None:
    df = pd.read_csv(path)
    df.columns = df.columns.str.lower().str.replace(" ", "_")
    df.to_sql("raw_data", engine, if_exists="append", index=False)
    print(f"Loaded {len(df)} rows from {path}")
\`\`\`

## What's Next

I'm planning to add data quality checks with Great Expectations and a simple dashboard in Streamlit.

---

*Tagged: data-engineering, python, postgresql*
`,

  "lessons-from-open-source.md": `# Lessons From My First Open Source Contribution

*July 22, 2024*

---

I finally merged my first PR into a project with over 2k stars. It was a humbling, educational, and deeply satisfying experience.

## How It Started

I found a bug while using a library for a side project. The error message was unhelpful and the fix seemed obvious. I thought: *why not just fix it?*

## The Process

### 1. Read the contributing guide (seriously)

Every project has one. I almost skipped it and wasted an hour setting up the wrong environment.

### 2. Start small

My first PR was a one-line change. Maintainers appreciate contributors who understand scope.

### 3. Write tests

The reviewers asked for a test case before merging. It took longer than the fix itself, but it made the PR bulletproof.

## What I Gained

- A deeper understanding of the codebase
- Confidence in reading unfamiliar code
- A connection to the maintainers

## The Merge

Three weeks and two review rounds later, the PR merged. I got a GitHub notification at 11pm and may have done a small fist pump.

---

*Tagged: open-source, career, learning*
`,
};

export default posts2024;
