# ml-experiment-tracker

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

```python
from ml_tracker import Experiment

with Experiment("bert-fine-tune") as exp:
    exp.log_param("learning_rate", 2e-5)
    exp.log_param("epochs", 3)

    # ... training loop ...

    exp.log_metric("accuracy", 0.923)
    exp.log_metric("f1_score", 0.918)
```

## Query Your Experiments

```bash
ml-tracker list --sort accuracy --top 5
```

## Links

- 🐙 [GitHub](https://github.com/divakaivan/ml-experiment-tracker)
