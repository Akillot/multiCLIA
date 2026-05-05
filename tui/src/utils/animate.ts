import { theme } from "./theme.js";

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export async function typewriter(
  text: string,
  delay = 18,
  indent = ""
): Promise<void> {
  for (const char of text) {
    process.stdout.write(indent + char === "\n" ? "\n" : char);
    if (char !== " ") await sleep(delay);
  }
  process.stdout.write("\n");
}

export async function fadeIn(lines: string[], delay = 60): Promise<void> {
  for (const line of lines) {
    process.stdout.write(line + "\n");
    await sleep(delay);
  }
}

export async function printLogo(logoLines: string[]): Promise<void> {
  process.stdout.write("\n");
  await fadeIn(logoLines, 35);
  process.stdout.write("\n");
}

export function clearScreen(): void {
  process.stdout.write("\x1Bc");
}

export function moveCursorUp(n: number): void {
  process.stdout.write(`\x1B[${n}A`);
}

export function clearLine(): void {
  process.stdout.write("\x1B[2K\r");
}

export async function glitchText(
  text: string,
  cycles = 4,
  delay = 60
): Promise<void> {
  const glitchChars = "█▓▒░╔╗╚╝║═╠╣╦╩╬";
  for (let i = 0; i < cycles; i++) {
    const glitched = text
      .split("")
      .map((c) =>
        c !== " " && Math.random() < 0.3
          ? theme.primary(glitchChars[Math.floor(Math.random() * glitchChars.length)])
          : c
      )
      .join("");
    clearLine();
    process.stdout.write(glitched);
    await sleep(delay);
  }
  clearLine();
  process.stdout.write(text + "\n");
}
