import {
  prompt,
  confirm,
  sectionHeader,
  showSpinner,
  printResult,
  printError,
  pressEnterToContinue,
} from "../components/menu.js";
import { runJavaTool } from "../utils/java.js";
import { theme } from "../utils/theme.js";

async function runTool(args: string[]): Promise<string> {
  return new Promise((resolve) => {
    try {
      const out = runJavaTool(args);
      resolve(out);
    } catch (e: unknown) {
      resolve(String(e instanceof Error ? e.message : e));
    }
  });
}

export async function handleTool(tool: string): Promise<void> {
  switch (tool) {
    case "ai":
      return handleAi();
    case "weather":
      return handleWeather();
    case "translate":
      return handleTranslate();
    case "network":
      return handleNetwork();
    case "crypt":
      return handleCrypt();
    case "genqr":
      return handleQr();
    case "genart":
      return handleAsciiArt();
    case "time":
      return handleTime();
    case "terminal":
      return handleTerminal();
    case "settings":
      return handleSettings();
    case "info":
      return handleInfo();
  }
}

async function handleAi(): Promise<void> {
  sectionHeader("AI Chat");
  const userPrompt = await prompt("Your message to AI");
  if (!userPrompt) return;
  const result = await showSpinner("Thinking...", () =>
    runTool(["ai", "--prompt", userPrompt])
  );
  printResult(result);
  await pressEnterToContinue();
}

async function handleWeather(): Promise<void> {
  sectionHeader("Weather");
  const city = await prompt("City name");
  if (!city) return;
  const result = await showSpinner(`Fetching weather for ${city}...`, () =>
    runTool(["weather", "--city", city])
  );
  printResult(result);
  await pressEnterToContinue();
}

async function handleTranslate(): Promise<void> {
  sectionHeader("Translate");
  const text = await prompt("Text to translate");
  if (!text) return;
  const lang = await prompt("Target language code (e.g. UK, DE, FR)");
  if (!lang) return;
  const result = await showSpinner("Translating...", () =>
    runTool(["translate", "--text", text, "--lang", lang.toUpperCase()])
  );
  printResult(result);
  await pressEnterToContinue();
}

async function handleNetwork(): Promise<void> {
  sectionHeader("Network");
  const url = await prompt("URL to test");
  if (!url) return;
  const result = await showSpinner("Sending request...", () =>
    runTool(["network", "--url", url])
  );
  printResult(result);
  await pressEnterToContinue();
}

async function handleCrypt(): Promise<void> {
  sectionHeader("Cryptography");
  const mode = await confirm("Encrypt? (No = Decrypt)");
  const text = await prompt("Text");
  if (!text) return;
  const key = await prompt("Key");
  if (!key) return;
  const flag = mode ? "--encrypt" : "--decrypt";
  const result = await showSpinner(mode ? "Encrypting..." : "Decrypting...", () =>
    runTool(["crypt", flag, "--text", text, "--key", key])
  );
  printResult(result);
  await pressEnterToContinue();
}

async function handleQr(): Promise<void> {
  sectionHeader("QR Generator");
  const data = await prompt("Data / URL");
  if (!data) return;
  const ascii = await confirm("Output as ASCII in terminal? (No = save to file)");
  const args = ascii
    ? ["genqr", "--data", data, "--output", "ascii"]
    : ["genqr", "--data", data, "--output", "file"];
  const result = await showSpinner("Generating QR code...", () =>
    runTool(args)
  );
  printResult(result);
  await pressEnterToContinue();
}

async function handleAsciiArt(): Promise<void> {
  sectionHeader("ASCII Art Generator");
  const text = await prompt("Text for banner");
  if (!text) return;
  const result = await showSpinner("Generating...", () =>
    runTool(["genart", "--text", text])
  );
  printResult(result);
  await pressEnterToContinue();
}

async function handleTime(): Promise<void> {
  sectionHeader("Time & Date");
  const result = await showSpinner("Fetching time data...", () =>
    runTool(["time"])
  );
  printResult(result);
  await pressEnterToContinue();
}

async function handleTerminal(): Promise<void> {
  sectionHeader("Terminal Emulator");
  const cmd = await prompt("Command to run");
  if (!cmd) return;
  const result = await showSpinner("Executing...", () =>
    runTool(["terminal", "--cmd", cmd])
  );
  printResult(result);
  await pressEnterToContinue();
}

async function handleSettings(): Promise<void> {
  sectionHeader("Settings");
  process.stdout.write(
    "  " + theme.muted("Settings are managed by the Java core (config.json).") + "\n"
  );
  process.stdout.write(
    "  " + theme.muted("Edit: ") + theme.primary("../config.json") + "\n\n"
  );
  await pressEnterToContinue();
}

async function handleInfo(): Promise<void> {
  sectionHeader("About multiCLIA");
  const lines = [
    `multiCLIA ${theme.primary("v4.0")}`,
    "",
    `UI      ${theme.secondary("TypeScript · @clack/prompts · chalk · figlet")}`,
    `Core    ${theme.secondary("Java 17 · Maven · JLine 3")}`,
    `Tools   ${theme.secondary("OpenAI · DeepL · ZXing · BouncyCastle · OkHttp")}`,
    "",
    `Author  ${theme.secondary("Akillot")}`,
    `Repo    ${theme.secondary("github.com/Akillot/multiCLIA")}`,
    `License ${theme.secondary("MIT")}`,
  ];
  for (const line of lines) {
    process.stdout.write("  " + line + "\n");
  }
  process.stdout.write("\n");
  await pressEnterToContinue();
}
