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
import * as p from "@clack/prompts";

async function cli(args: string[]): Promise<string> {
  try {
    return runJavaTool(["--cli", ...args]);
  } catch (e: unknown) {
    return String(e instanceof Error ? e.message : e);
  }
}

export async function handleTool(tool: string): Promise<void> {
  switch (tool) {
    case "ai":        return handleAi();
    case "weather":   return handleWeather();
    case "translate": return handleTranslate();
    case "network":   return handleNetwork();
    case "crypt":     return handleCrypt();
    case "genqr":     return handleQr();
    case "genart":    return handleAsciiArt();
    case "time":      return handleTime();
    case "terminal":  return handleTerminal();
    case "settings":  return handleSettings();
    case "info":      return handleInfo();
  }
}

async function handleAi(): Promise<void> {
  sectionHeader("AI Chat");
  const userPrompt = await prompt("Your message to AI");
  if (!userPrompt) return;
  const result = await showSpinner("Thinking...", () =>
    cli(["ai", userPrompt])
  );
  printResult(result);
  await pressEnterToContinue();
}

async function handleWeather(): Promise<void> {
  sectionHeader("Weather");
  const mode = await p.select<string>({
    message: theme.primary("Mode"),
    options: [
      { value: "city",  label: "By city name" },
      { value: "local", label: "By my IP (local)" },
    ],
  });
  if (p.isCancel(mode)) return;

  if (mode === "local") {
    const result = await showSpinner("Fetching local weather...", () =>
      cli(["weather"])
    );
    printResult(result);
  } else {
    const city = await prompt("City name");
    if (!city) return;
    const result = await showSpinner(`Fetching weather for ${city}...`, () =>
      cli(["weather", city])
    );
    printResult(result);
  }
  await pressEnterToContinue();
}

async function handleTranslate(): Promise<void> {
  sectionHeader("Translate");
  const text = await prompt("Text to translate");
  if (!text) return;
  const lang = await prompt("Target language (e.g. UK, DE, FR, EN-US)");
  if (!lang) return;
  const result = await showSpinner("Translating...", () =>
    cli(["translate", text, lang.toUpperCase()])
  );
  printResult(result);
  await pressEnterToContinue();
}

async function handleNetwork(): Promise<void> {
  sectionHeader("Network");
  const action = await p.select<string>({
    message: theme.primary("Select operation"),
    options: [
      { value: "ip",         label: "My IP address" },
      { value: "http",       label: "HTTP request test" },
      { value: "ping",       label: "Ping host" },
      { value: "trace",      label: "Traceroute" },
      { value: "dns",        label: "DNS lookup" },
      { value: "interfaces", label: "Network interfaces" },
    ],
  });
  if (p.isCancel(action)) return;

  let result: string;
  if (action === "ip" || action === "interfaces") {
    result = await showSpinner("Running...", () => cli(["network", action]));
  } else {
    const host = await prompt(action === "http" ? "URL" : "Host / domain");
    if (!host) return;
    result = await showSpinner("Running...", () => cli(["network", action, host]));
  }
  printResult(result);
  await pressEnterToContinue();
}

async function handleCrypt(): Promise<void> {
  sectionHeader("Cryptography");
  const op = await p.select<string>({
    message: theme.primary("Operation"),
    options: [
      { value: "encrypt", label: "Encrypt (AES, auto-generates key)" },
      { value: "decrypt", label: "Decrypt AES" },
      { value: "hash",    label: "Hash SHA-256" },
      { value: "genpass", label: "Generate password" },
    ],
  });
  if (p.isCancel(op)) return;

  let result: string;
  if (op === "encrypt" || op === "hash") {
    const text = await prompt("Text");
    if (!text) return;
    result = await showSpinner(op === "encrypt" ? "Encrypting..." : "Hashing...", () =>
      cli(["crypt", op, text])
    );
  } else if (op === "decrypt") {
    const enc = await prompt("Encrypted text (Base64)");
    if (!enc) return;
    const key = await prompt("Key (Base64)");
    if (!key) return;
    result = await showSpinner("Decrypting...", () =>
      cli(["crypt", "decrypt", enc, key])
    );
  } else {
    const len = await prompt("Password length (1–80)");
    const complexity = await p.select<string>({
      message: theme.primary("Complexity"),
      options: [
        { value: "light",  label: "Light  (lowercase only)" },
        { value: "medium", label: "Medium (letters + digits)" },
        { value: "strong", label: "Strong (+ symbols)" },
        { value: "extra",  label: "Extra  (all chars)" },
      ],
    });
    if (p.isCancel(complexity)) return;
    result = await showSpinner("Generating...", () =>
      cli(["crypt", "genpass", len || "16", complexity as string])
    );
  }
  printResult(result);
  await pressEnterToContinue();
}

async function handleQr(): Promise<void> {
  sectionHeader("QR Generator");
  const data = await prompt("URL or data");
  if (!data) return;
  const result = await showSpinner("Generating QR code...", () =>
    cli(["genqr", data])
  );
  printResult(result);
  await pressEnterToContinue();
}

async function handleAsciiArt(): Promise<void> {
  sectionHeader("ASCII Art Generator");
  const text = await prompt("Text for banner");
  if (!text) return;
  const result = await showSpinner("Generating...", () =>
    cli(["genart", text])
  );
  printResult(result);
  await pressEnterToContinue();
}

async function handleTime(): Promise<void> {
  sectionHeader("Time & Date");
  const op = await p.select<string>({
    message: theme.primary("What to show"),
    options: [
      { value: "current",  label: "Current time & timezone" },
      { value: "calendar", label: "Calendar (this month)" },
      { value: "timezone", label: "Time in another timezone" },
    ],
  });
  if (p.isCancel(op)) return;

  let result: string;
  if (op === "timezone") {
    const tz = await prompt("Timezone (e.g. Europe/London, America/New_York)");
    if (!tz) return;
    result = await showSpinner("Fetching...", () =>
      cli(["time", "timezone", tz])
    );
  } else {
    result = await showSpinner("Fetching...", () =>
      cli(["time", op as string])
    );
  }
  printResult(result);
  await pressEnterToContinue();
}

async function handleTerminal(): Promise<void> {
  sectionHeader("Terminal Emulator");
  const cmd = await prompt("Command to run (read-only mode)");
  if (!cmd) return;
  const result = await showSpinner("Executing...", () =>
    cli(["terminal", cmd])
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
