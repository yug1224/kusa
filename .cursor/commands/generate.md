---
name: /generate
id: generate
category: Development
description: kusa 生成のパラメータをガイドして実行する
---

kusa（フェイクコミット）の生成パラメータを対話的にガイドし、コマンドを構築・実行する。

**Input**: `/generate` の後に続く引数は、オプションパラメータ（任意）。

---

## Steps

1. **パラメータの収集**

   引数が不足している場合、ユーザーに質問して収集する。

   - `--from` (必須): 開始日 YYYYMMDD
   - `--to` (必須): 終了日 YYYYMMDD
   - `--weekday` (任意): 日中帯の確率分母（デフォルト: 5）
   - `--holiday` (任意): その他の時間帯の確率分母（デフォルト: 50）
   - `--co-author` (任意): AI co-author トレーラー（cursor / claude / devin /
     random）

2. **コマンドの構築と確認**

   収集したパラメータからコマンドを構築し、ユーザーに確認する。

   ```bash
   deno task generate -- --from YYYYMMDD --to YYYYMMDD [options]
   ```

3. **実行**

   ユーザーの確認後、コマンドを実行する。

---

## Guardrails

- `--from` が `--to` より後の日付でないことを検証する
- 期間が長い場合（90日以上）は確認を促す
- 実行前にコマンド全体を表示して確認を取る
