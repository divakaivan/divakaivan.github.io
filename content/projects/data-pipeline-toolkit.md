# data-pipeline-toolkit

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

```python
from data_pipeline_toolkit import Pipeline, CSVSource, PostgresSink

pipeline = Pipeline(
    source=CSVSource("data/raw/*.csv"),
    sink=PostgresSink(url="postgresql://localhost/mydb"),
    schema=MySchema,
)

pipeline.run()
```

## Status

🚧 In active development — not yet production-ready.

## Links

- 🐙 [GitHub](https://github.com/divakaivan/data-pipeline-toolkit)
