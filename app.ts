import dayjs from "https://esm.sh/dayjs@1.11.3";
// import dayjs from "https://cdn.skypack.dev/dayjs";
import Denomander from "https://deno.land/x/denomander@0.9.1/mod.ts";
import * as log from "https://deno.land/std@0.121.0/log/mod.ts";

// deno-lint-ignore no-explicit-any
function validateDate(value: any): string {
  if (dayjs(String(value), "YYYYMMDD").format("YYYYMMDD") !== String(value)) {
    throw `${program.errors.INVALID_RULE}: ${value}`;
  }
  return String(value);
}

// deno-lint-ignore no-explicit-any
function validateNumber(value: any): number {
  if (Number.isNaN(parseInt(value, 10))) {
    throw `${program.errors.INVALID_RULE}: ${value}`;
  }
  return parseInt(value, 10);
}

const program = new Denomander(
  {
    app_name: "kusa",
    app_description: "jinko shiba generator",
    app_version: "2.0.0",
  },
);

// コマンド定義
program
  .command("generate")
  .requiredOption(
    "--from",
    "(required) This flag specifies the start date. [YYYYMMDD]",
    validateDate,
  )
  .requiredOption(
    "--to",
    "(required) This flag specifies the end date. [YYYYMMDD]",
    validateDate,
  )
  .option(
    "--weekday",
    "This argument is the percentage to run during the daytime on weekdays. [number]",
    validateNumber,
  )
  .option(
    "--holiday",
    "This argument is the percentage to run on holidays and at night. [number]",
    validateNumber,
  )
  .parse(Deno.args);

// 変数の定義
const { from, to, weekday: wd = 5, holiday: hd = 50 } = program;

// 開始の日時をセット
let date = dayjs(`${from}`, "YYYYMMDD");

// 終了の日時をセット
const end = dayjs(`${to}`, "YYYYMMDD");

// dateとendのdiffを取る
const diff = () => {
  return date.diff(end) < 0;
};

// dateがendの日時を過ぎるまで続ける
while (diff()) {
  // 月-金判定
  const isWeekday = +date.format("d") > 0 && +date.format("d") < 6;

  // 10-22時判定
  const isDaytime = +date.format("h") >= 10 && +date.format("h") <= 22;

  // 1/n判定
  const n = isWeekday && isDaytime ? wd : hd;

  // 月-金で10-22時の間で1/5の確率でgit commitを行う
  // 土日もしくは23-09時の間で1/50の確率でgit commitを行う
  const canCommit = Math.floor(Math.random() * n) === 0;

  if (canCommit) {
    await commit();
    await rebase();
  }

  // 時間を進める
  date = date.add(30, "minute");
}

// commitする
async function commit() {
  const p = Deno.run({
    cmd: [
      "git",
      "commit",
      "--allow-empty",
      "--date",
      date.format(),
      "-m",
      "kusa",
    ],
    stderr: "piped",
    stdout: "piped",
  });

  const [_, stdout, stderr] = await Promise.all([
    p.status(),
    p.output(),
    p.stderrOutput(),
  ]);
  p.close();

  log.info(new TextDecoder().decode(stdout || stderr));
}

// rebaseする
async function rebase() {
  const p = Deno.run({
    cmd: [
      "git",
      "rebase",
      "HEAD~1",
      "--committer-date-is-author-date",
    ],
    stderr: "piped",
    stdout: "piped",
  });

  const [_, stdout, stderr] = await Promise.all([
    p.status(),
    p.output(),
    p.stderrOutput(),
  ]);
  p.close();

  log.info(new TextDecoder().decode(stdout || stderr));
}
