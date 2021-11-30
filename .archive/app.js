#!/usr/bin/env node
/* global process */

const execSync = require("child_process").execSync;
const dayjs = require("dayjs");
const commander = require("commander");
const {program} = commander;

function validateDate(value) {
  if (dayjs(value, 'YYYYMMDD').format('YYYYMMDD') !== value) {
    throw new commander.InvalidArgumentError('');
  }
  return value;
}

function validateNumber(value) {
  if (Number.isNaN(parseInt(value, 10))) {
    throw new commander.InvalidArgumentError('');
  }
  return value;
}

// コマンド定義
program
  .version("0.1.0")
  .requiredOption(
    "--from <YYYYMMDD>",
    "(required) This flag specifies the start date. [YYYYMMDD]",
    validateDate
  )
  .requiredOption(
    "--to <YYYYMMDD>",
    "(required) This flag specifies the end date. [YYYYMMDD]",
    validateDate

  )
  .option(
    "--weekday <number>",
    "This argument is the percentage to run during the daytime on weekdays. [number]",
    validateNumber
  )
  .option(
    "--holiday <number>",
    "This argument is the percentage to run on holidays and at night. [number]",
    validateNumber
  ).parse(process.argv);

// 変数の定義
const { from, to, weekday: wd = 5, holiday: hd = 50 } = program.opts();
// 開始の日時をセット
let date = dayjs(from);
// 5年後の日時をセット
const end = dayjs(to);
// dateとendのdiffを取る
const diff = () => {
  return date.diff(end) < 0;
};

// commitする
function commit(n) {
  // 1/n判定
  const r = n => {
    return n ? Math.floor(Math.random() * n) === 0 : false;
  };

  if (!r(n)) {
    return;
  }
  const string = `git commit --allow-empty --date='${date.format()}' -m 'update'`;
  const result = execSync(string).toString();
  console.log(result || string);
}

// dateがendの日時を過ぎるまで続ける
while (diff()) {
  // 月-金判定
  const d = +date.format("d") > 0 && +date.format("d") < 6;

  // 10-22時判定
  const h = +date.format("h") >= 10 && +date.format("h") <= 22;

  if (d && h) {
    // 月-金で10-22時の間で1/5の確率でgit commitを行う
    commit(+wd);
  } else {
    // 土日もしくは23-09時の間で1/50の確率でgit commitを行う
    commit(+hd);
  }

  // 時間を1時間進める
  date = date.add(30, "minute");
}
