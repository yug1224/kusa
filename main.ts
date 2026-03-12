import { parseArgs } from "@std/cli/parse-args";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";

export const CO_AUTHORS: Record<string, string> = {
  cursor: "Co-authored-by: Cursor <cursoragent@cursor.com>",
  claude: "Co-authored-by: Claude <noreply@anthropic.com>",
  devin:
    "Co-authored-by: devin-ai-integration[bot] <devin-ai-integration[bot]@users.noreply.github.com>",
};

export function validateDate(value: string): string {
  const parsed = dayjs(value);
  if (!parsed.isValid() || parsed.format("YYYYMMDD") !== value) {
    throw new Error(`Invalid date format: ${value}. Expected YYYYMMDD.`);
  }
  return value;
}

export function isBusinessHours(hour: number): boolean {
  return hour >= 10 && hour <= 18;
}

export function getCoAuthorTrailer(coAuthor: string): string {
  if (coAuthor === "random") {
    const keys = Object.keys(CO_AUTHORS);
    return CO_AUTHORS[keys[Math.floor(Math.random() * keys.length)]];
  }
  return CO_AUTHORS[coAuthor] ?? "";
}

function showUsage(): void {
  console.log(`kusa - jinko shiba generator v2.0.0

Usage:
  kusa generate --from YYYYMMDD --to YYYYMMDD [options]

Options:
  --from         (required) Start date [YYYYMMDD]
  --to           (required) End date [YYYYMMDD]
  --weekday      Probability denominator for business hours 10-19 (default: 5)
  --holiday      Probability denominator for off-hours (default: 50)
  --co-author    AI co-author trailer (cursor|claude|devin|random)
  --help, -h     Show this help message`);
}

async function commit(date: dayjs.Dayjs, coAuthor: string): Promise<void> {
  Deno.env.set("GIT_AUTHOR_DATE", date.format());
  Deno.env.set("GIT_COMMITTER_DATE", date.format());

  if (faker.datatype.boolean()) {
    const fakePersonList = [...Array(faker.number.int(20))].map(() => ({
      userId: faker.string.uuid(),
      fullName: faker.person.fullName(),
      bio: faker.person.bio(),
      gender: faker.person.gender(),
      birthdate: faker.date.birthdate(),
      registeredAt: faker.date.past(),
    }));
    await Deno.writeTextFile(
      ".fake/personList.json",
      JSON.stringify(fakePersonList, null, 2) + "\n",
    );
  }

  if (faker.datatype.boolean()) {
    const fakeCompanyList = [...Array(faker.number.int(20))].map(() => ({
      companyId: faker.string.uuid(),
      companyName: faker.company.name(),
      catchPhrase: faker.company.catchPhrase(),
      buzzPhrase: faker.company.buzzPhrase(),
      established: faker.date.birthdate({ min: 0, max: 100, mode: "age" }),
      registeredAt: faker.date.past(),
    }));
    await Deno.writeTextFile(
      ".fake/companyList.json",
      JSON.stringify(fakeCompanyList, null, 2) + "\n",
    );
  }

  if (faker.datatype.boolean()) {
    const fakeProductList = [...Array(faker.number.int(20))].map(() => ({
      productId: faker.string.uuid(),
      productName: faker.commerce.productName(),
      price: faker.commerce.price(),
      productDescription: faker.commerce.productDescription(),
      registeredAt: faker.date.past(),
    }));
    await Deno.writeTextFile(
      ".fake/productList.json",
      JSON.stringify(fakeProductList, null, 2) + "\n",
    );
  }

  const sentence = faker.lorem.sentence({ max: 5, min: 3 });
  const trailer = coAuthor ? getCoAuthorTrailer(coAuthor) : "";
  const fullMessage = trailer ? `${sentence}\n\n${trailer}` : sentence;

  const c = new Deno.Command("git", {
    args: ["commit", "--allow-empty", "-am", fullMessage],
  });

  const { stdout, stderr } = await c.output();
  console.info(new TextDecoder().decode(stdout.length ? stdout : stderr));
}

if (import.meta.main) {
  const args = parseArgs(Deno.args, {
    string: ["from", "to", "co-author", "weekday", "holiday"],
    boolean: ["help"],
    alias: { h: "help" },
  });

  const command = args._[0];

  if (args.help || command !== "generate") {
    showUsage();
    Deno.exit(args.help ? 0 : 1);
  }

  const { from, to } = args;

  if (!from || !to) {
    console.error("Error: --from and --to are required.");
    showUsage();
    Deno.exit(1);
  }

  validateDate(from);
  validateDate(to);

  const wd = args.weekday ? parseInt(args.weekday, 10) : 5;
  const hd = args.holiday ? parseInt(args.holiday, 10) : 50;
  const coAuthor = args["co-author"] ?? "";

  if (Number.isNaN(wd) || Number.isNaN(hd)) {
    console.error("Error: --weekday and --holiday must be numbers.");
    Deno.exit(1);
  }

  if (coAuthor && coAuthor !== "random" && !(coAuthor in CO_AUTHORS)) {
    console.error(
      `Error: Invalid co-author "${coAuthor}". Available: ${
        Object.keys(CO_AUTHORS).join(", ")
      }, random`,
    );
    Deno.exit(1);
  }

  let date = dayjs(from);
  const end = dayjs(to);

  while (date.diff(end) < 0) {
    const hour = +date.format("H");
    const n = isBusinessHours(hour) ? wd : hd;
    const canCommit = Math.floor(Math.random() * n) === 0;

    if (canCommit) {
      await commit(date, coAuthor);
    }

    date = date.add(15, "minute");
  }
}
