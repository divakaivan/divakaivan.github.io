# Building a Data Pipeline from Scratch

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

```python
import pandas as pd
from sqlalchemy import create_engine

def load_csv(path: str, engine) -> None:
    df = pd.read_csv(path)
    df.columns = df.columns.str.lower().str.replace(" ", "_")
    df.to_sql("raw_data", engine, if_exists="append", index=False)
    print(f"Loaded {len(df)} rows from {path}")
```

## What's Next

I'm planning to add data quality checks with Great Expectations and a simple dashboard in Streamlit.

---

*Tagged: data-engineering, python, postgresql*
