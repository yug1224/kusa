---
name: local-ci
description: Run CI checks locally and auto-fix issues. Use when the user wants to run CI, check code quality, verify before pushing, fix lint/format errors, or mentions "CI", "lint", "fmt", "check", "test".
---

# Local CI

## Workflow

1. Run all checks sequentially, capturing each result:

```bash
deno task fmt:check
deno task lint
deno task check
deno task test
```

2. Report results in a table:

| Check     | Status    |
| --------- | --------- |
| fmt:check | pass/fail |
| lint      | pass/fail |
| check     | pass/fail |
| test      | pass/fail |

3. If any check fails, attempt auto-fix:

**fmt failures**: Run `deno task fmt` to auto-format, then re-run
`deno task fmt:check`.

**lint failures**: Read the error output, identify the lint rule, and fix the
code. Re-run `deno task lint`.

**check failures**: Read type errors and fix. Re-run `deno task check`.

**test failures**: Read failing test output, fix the code or test, and re-run
`deno task test`.

4. After all fixes, re-run the full check suite to confirm everything passes.
