# kusa

GitHub の草をただ生やし続けるためのリポジトリ

## Usage

```
$ deno run --allow-run=git app.ts kusa --from YYYYMMDD --to YYYYMMDD
$ git push -u origin main
```

平日の昼間に草が集中するように、空コミットを行います。

`git commit --allow-empty --date='${date.format()}' -m 'update'`

`--date` オプションで時間を操作し、あたかも過去と未来にコミットしたかのように見せかけています。
