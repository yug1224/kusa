import dayjs from "https://esm.sh/dayjs/";
import Denomander from "https://deno.land/x/denomander/mod.ts";

const program = new Denomander(
  {
    app_name: "kusa",
    app_description: "jinko shiba generator",
    app_version: "2.0.0",
  },
);

// コマンド定義
program
  .command("kusa")
  .requiredOption(
    "--from",
    "(required) This flag specifies the start date. [YYYYMMDD]",
    String
  )
  .requiredOption(
    "--to",
    "(required) This flag specifies the end date. [YYYYMMDD]",
    String
  )
  .option(
    "--weekday",
    "This argument is the percentage to run during the daytime on weekdays. [number]",
    Number
  )
  .option(
    "--holiday",
    "This argument is the percentage to run on holidays and at night. [number]",
    Number
  )
  .parse(Deno.args);

// 変数の定義
const { from, to, weekday: wd = 5, holiday: hd = 50 } = program;
// 開始の日時をセット
let date = dayjs(`${from}`, 'YYYYMMDD');
// 終了の日時をセット
const end = dayjs(`${to}`, 'YYYYMMDD');
// dateとendのdiffを取る
const diff = () => {
  return date.diff(end) < 0;
};

// commitする
async function commit(n: number) {
  // 1/n判定
  const r = (n: number) => {
    return n ? Math.floor(Math.random() * n) === 0 : false;
  };

  if (!r(n)) {
    return;
  }

  // const string =
  //   `git commit --allow-empty --date='${date.format()}' -m 'update'`;
  const p = Deno.run({
    cmd: [
      "git",
      "commit",
      "--allow-empty",
      `--date='${date.format()}'`,
      "-m",
      "update",
    ],
    stderr: "piped",
    stdout: "piped",
  });

  const [status, stdout, stderr] = await Promise.all([
    p.status(),
    p.output(),
    p.stderrOutput(),
  ]);
  p.close();

  console.log(new TextDecoder().decode(stdout || stderr));
}

// dateがendの日時を過ぎるまで続ける
while (diff()) {
  // 月-金判定
  const d = +date.format("d") > 0 && +date.format("d") < 6;

  // 10-22時判定
  const h = +date.format("h") >= 10 && +date.format("h") <= 22;

  if (d && h) {
    // 月-金で10-22時の間で1/5の確率でgit commitを行う
    await commit(+wd);
  } else {
    // 土日もしくは23-09時の間で1/50の確率でgit commitを行う
    await commit(+hd);
  }

  // 時間を進める
  date = date.add(30, "minute");
}
