---
name: /ci
id: ci
category: Development
description: CI チェック一式をローカルで実行する
---

ローカル環境で CI と同等のチェック（fmt, lint, check,
test）を順番に実行し、結果をまとめて報告する。

---

## Steps

1. **チェックの実行**

   以下のコマンドを順番に実行する。各ステップの成否を記録する。

   ```bash
   deno task fmt:check
   deno task lint
   deno task check
   deno task test
   ```

2. **結果の報告**

   下記フォーマットで出力する。

---

## 出力フォーマット

```markdown
## CI Check Results

| Check     | Status  |
| --------- | ------- |
| fmt:check | ✅ / ❌ |
| lint      | ✅ / ❌ |
| check     | ✅ / ❌ |
| test      | ✅ / ❌ |

### エラー詳細（失敗時のみ）

エラー内容と修正案を記載する。
```

---

## Guardrails

- すべてのチェックを実行し、途中で中断しない
- エラーがある場合は修正案を提示する
- 自動修正可能な場合（例: `deno fmt`）は修正を提案する
