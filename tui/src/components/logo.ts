import figlet from "figlet";
import gradient from "gradient-string";
import { sleep } from "../utils/animate.js";
import { theme, divider } from "../utils/theme.js";

const TAGLINE = "Terminal Tool Suite  ·  Open-source  ·  v4.0";

function buildBanner(): string {
  const raw = figlet.textSync("multiCLIA", {
    font: "ANSI Shadow",
    horizontalLayout: "fitted",
  });
  return gradient(["#9B79FF", "#C084FC", "#E879F9", "#F472B6"]).multiline(raw);
}

export async function renderLogo(): Promise<void> {
  process.stdout.write("\n");
  const banner = buildBanner();
  const lines = banner.split("\n");

  for (const line of lines) {
    process.stdout.write(line + "\n");
    await sleep(28);
  }

  process.stdout.write("\n");
  const tagPad = Math.max(0, Math.floor((62 - TAGLINE.length) / 2));
  process.stdout.write(
    " ".repeat(tagPad) + theme.dim(TAGLINE) + "\n"
  );
  process.stdout.write("\n");
  process.stdout.write(divider() + "\n");
  process.stdout.write("\n");
}
