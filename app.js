#!/usr/bin/env node
/* global process */
/* eslint-disable no-console */

const execSync = require('child_process').execSync
const dayjs = require('dayjs')
const opts = require('commander')

// コマンド定義
opts
  .version('0.1.0')
  .option(
    '-f, --from [from]',
    '(required) This flag specifies the start date. [YYYYMMDD]'
  )
  .option(
    '-t, --to [to]',
    '(required) This flag specifies the end date. [YYYYMMDD]'
  )
  .option(
    '-w, --weekyday [weekyday]',
    'This argument is the percentage to run during the daytime on weekdays. [number]'
  )
  .option(
    '-h, --holiday [holiday]',
    'This argument is the percentage to run on holidays and at night. [number]'
  )
  .parse(process.argv) // eslint-disable-line

// from to がないときはエラーにする
if (!opts.from || !opts.to) {
  const red = '\u001b[31m'
  if (!opts.from) console.error(`${red}from argument is required`)
  if (!opts.to) console.error(`${red}to argument is required`)
  process.exit(1)
}

// 変数の定義
const { from, to, weekyday: wd = 5, holiday: hd = 50 } = opts
// 開始の日時をセット
let date = dayjs(from)
// 5年後の日時をセット
const end = dayjs(to)
// dateとendのdiffを取る
const diff = () => {
  return date.diff(end) < 0
}

// commitする
function commit(n) {
  // 1/n判定
  const r = n => {
    return n ? Math.floor(Math.random() * n) === 0 : false
  }

  if (!r(n)) {
    return
  }
  const string = `git commit --allow-empty --date='${date.format()}' -m 'update'`
  const result = execSync(string).toString()
  console.log(result || string)
}

// dateがendの日時を過ぎるまで続ける
while (diff()) {
  // 月-金判定
  const d = +date.format('d') > 0 && +date.format('d') < 6

  // 10-22時判定
  const h = +date.format('h') >= 10 && +date.format('h') <= 22

  if (d && h) {
    // 月-金で10-22時の間で1/5の確率でgit commitを行う
    commit(+wd)
  } else {
    // 土日もしくは23-09時の間で1/50の確率でgit commitを行う
    commit(+hd)
  }

  // 時間を1時間進める
  date = date.add(30, 'minute')
}
