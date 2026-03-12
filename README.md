# kusa

GitHub の草をただ生やし続けるためのリポジトリ

## Requirements

- [Deno](https://deno.com/) v2.x

## Install

```bash
deno install --allow-run=git --allow-env --allow-write --allow-read -n kusa main.ts
```

## Usage

```bash
# 基本的な使い方
deno task generate -- --from 20250101 --to 20250131

# AI Co-author を付与（Cursor）
deno task generate -- --from 20250101 --to 20250131 --co-author cursor

# AI Co-author をランダムに付与
deno task generate -- --from 20250101 --to 20250131 --co-author random

# 生成後にプッシュ
git push -u origin main
```

### Options

| Option        | Description                         | Default |
| ------------- | ----------------------------------- | ------- |
| `--from`      | 開始日 (YYYYMMDD)                   | 必須    |
| `--to`        | 終了日 (YYYYMMDD)                   | 必須    |
| `--weekday`   | 日中帯 (10-19時) のコミット確率分母 | 5       |
| `--holiday`   | その他の時間帯のコミット確率分母    | 50      |
| `--co-author` | AI Co-author トレーラー             | なし    |

### Co-author 対応ツール

`cursor` / `claude` / `devin` / `random`

## Development

```bash
deno task test      # テスト実行
deno task lint      # Lint
deno task fmt       # フォーマット
deno task check     # 型チェック
```

## How it works

`GIT_AUTHOR_DATE` と `GIT_COMMITTER_DATE`
で時間を操作し、指定期間にコミットしたかのように見せかけます。 日中帯
(10:00-19:00) はコミット確率が高く、それ以外の時間帯は低確率でコミットされます。
