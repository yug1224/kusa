# kusa

GitHub の草をただ生やし続けるためのリポジトリ

## Install

```
deno install --unstable --allow-run=git --allow-env -n kusa app.ts
```

`Deno.Command`を利用しているため、`--unstable`をつけています。

## Usage

```
$ kusa generate --from 20220101 --to 20220131
$ git push -u origin main
```

平日の昼間に草が集中するように、空コミットを行います。

```
GIT_AUTHOR_DATE=<date>
GIT_COMMITTER_DATE=<date>
git commit --allow-empty -m 'kusa'
```

`GIT_AUTHOR_DATE`と`GIT_COMMITTER_DATE`で時間を操作し、あたかも過去や未来にコミットしたかのように見せかけています。
