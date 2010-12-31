---
name: generate-kusa
description: Generate fake commits for GitHub contribution graph. Use when the user wants to generate kusa, create fake commits, fill GitHub grass, or mentions "generate", "kusa", "contribution graph", "grass".
---

# Generate Kusa

## Overview

Generates fake commits to fill the GitHub contribution graph for a specified
date range.

## Parameters

| Parameter     | Required | Description                              | Default |
| ------------- | -------- | ---------------------------------------- | ------- |
| `--from`      | Yes      | Start date (YYYYMMDD)                    | -       |
| `--to`        | Yes      | End date (YYYYMMDD)                      | -       |
| `--weekday`   | No       | Business hours (10-19) prob. denominator | 5       |
| `--holiday`   | No       | Off-hours prob. denominator              | 50      |
| `--co-author` | No       | AI co-author trailer                     | -       |

Available co-authors: `cursor`, `claude`, `devin`, `random`

## Workflow

1. Collect parameters from the user. If `--from` or `--to` are missing, ask for
   them.

2. Validate:
   - Dates are in YYYYMMDD format
   - `--from` is before `--to`
   - If the range exceeds 90 days, confirm with the user

3. Build and display the command:

```bash
deno task generate -- --from YYYYMMDD --to YYYYMMDD [--weekday N] [--holiday N] [--co-author NAME]
```

4. Execute after user confirmation.

5. After execution, suggest pushing:

```bash
git push -u origin main
```

## Probability Logic

Commits are evaluated every 15 minutes across the date range:

- **Business hours (10:00-18:59)**: `1/weekday` probability (default 20%)
- **Off-hours**: `1/holiday` probability (default 2%)
