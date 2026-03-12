# kusa

GitHub の草（contribution graph）を生成するための CLI ツール。

## 技術スタック

- Runtime: Deno 2.x
- Language: TypeScript (strict mode)
- Dependencies: dayjs, @faker-js/faker, @std/cli

## 開発コマンド

```bash
deno task generate    # コミット生成 (-- --from YYYYMMDD --to YYYYMMDD)
deno task test        # テスト実行
deno task lint        # Lint
deno task fmt         # フォーマット
deno task check       # 型チェック
```

## ファイル構成

- `main.ts` - エントリーポイント + コアロジック
- `main_test.ts` - テスト
- `deno.jsonc` - Deno 設定 (imports, tasks, lint, fmt)

## コーディング規約

- import は deno.jsonc の imports で管理。`jsr:` / `npm:` specifier を使用
- `https://deno.land/...` 形式の URL import は禁止
- `any` の使用禁止。明示的な型定義を行う
- テストは `Deno.test()` + `@std/assert` で記述

## コミットメッセージ

```
<type>(<scope>): <subject>
```

Types: feat, fix, docs, style, refactor, perf, test, chore
