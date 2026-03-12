# kusa

GitHub の草（contribution graph）を生成するための CLI ツール。
指定した期間に対して、フェイクデータのコミットを生成する。

## 技術スタック

- **Runtime**: Deno 2.x
- **Language**: TypeScript (strict mode)
- **Dependencies**: dayjs (日付操作), @faker-js/faker (フェイクデータ), @std/cli
  (CLI パーサー)

## プロジェクト構成

```
kusa/
├── main.ts             エントリーポイント + コアロジック
├── main_test.ts        テスト
├── deno.jsonc          Deno 設定 (imports, tasks, lint, fmt)
├── deno.lock           ロックファイル
├── README.md           ドキュメント
├── CLAUDE.md           AI 向けプロジェクトドキュメント (このファイル)
├── AGENTS.md           GitHub Copilot Workspace 向け
├── .fake/              生成されるフェイクデータ (Git 追跡対象)
├── .github/
│   └── workflows/
│       └── ci.yml      CI ワークフロー
├── .claude/
│   └── settings.json   Claude Code 設定
├── .cursor/
│   ├── commands/       Cursor コマンド
│   ├── rules/          Cursor ルール
│   └── skills/         Cursor スキル
└── .vscode/
    └── settings.json   VS Code / Cursor 設定
```

## コミット確率ロジック

- 15 分刻みで `from` から `to` まで走査し、確率的にコミットを生成する
- **日中帯 (10:00-19:00)**: `1/weekday` の確率（デフォルト 1/5 = 20%）
- **その他の時間帯**: `1/holiday` の確率（デフォルト 1/50 = 2%）
- `isBusinessHours(hour)` で日中帯かどうかを判定

## 開発コマンド

```bash
deno task generate    # コミット生成を実行 (-- --from YYYYMMDD --to YYYYMMDD)
deno task test        # テスト実行
deno task lint        # Lint 実行
deno task fmt         # フォーマット実行
deno task fmt:check   # フォーマットチェック（CI 用）
deno task check       # 型チェック実行
```

## コーディング規約

- import は deno.jsonc の imports で管理。`jsr:` (Deno std) / `npm:` (npm)
  specifier を使用
- `https://deno.land/...` 形式の URL import は使用しない
- 型定義は明示的に行い、`any` の使用を避ける
- 非同期処理には async/await を使用
- テストは `Deno.test()` + `@std/assert` で記述
- テストファイルは `*_test.ts` の命名規則
- `.fake/` に JSON を書き出す際は末尾改行 (`+ "\n"`) を付与する

## Cursor コマンド

- `/ci` - CI チェック一式をローカルで実行（fmt:check, lint, check, test）
- `/generate` - kusa 生成のパラメータをガイドして実行

## Cursor スキル

- `local-ci` - CI チェックの実行とエラー自動修正
- `generate-kusa` - kusa 生成パラメータの構築と実行支援

## コミットメッセージ規約

```
<type>(<scope>): <subject>
```

Types: feat, fix, docs, style, refactor, perf, test, chore

## 注意事項

- Deno の権限モデルに従い、必要最小限の権限のみを使用する
- `--allow-run=git`, `--allow-env`, `--allow-write`, `--allow-read` が必要
- `.fake/` ディレクトリは Git 追跡対象（コミット対象のフェイクデータ生成先）
- `import.meta.main` ガードにより、テストからの import 時に CLI
  コードは実行されない
