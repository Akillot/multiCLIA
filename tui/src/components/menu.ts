import * as p from "@clack/prompts";
import { theme, divider, accent } from "../utils/theme.js";
import { sleep } from "../utils/animate.js";

export interface MenuItem {
  label: string;
  hint?: string;
  value: string;
}

const TOOLS: MenuItem[] = [
  { value: "ai",        label: "AI Chat",          hint: "ChatGPT · GPT-3.5" },
  { value: "weather",   label: "Weather",           hint: "real-time forecast" },
  { value: "translate", label: "Translate",         hint: "DeepL API" },
  { value: "network",   label: "Network",           hint: "HTTP diagnostics" },
  { value: "crypt",     label: "Cryptography",      hint: "encrypt / decrypt" },
  { value: "genqr",     label: "QR Generator",      hint: "file or ASCII" },
  { value: "genart",    label: "ASCII Art",         hint: "banner text" },
  { value: "time",      label: "Time & Date",       hint: "world clocks" },
  { value: "terminal",  label: "Terminal Emulator", hint: "shell passthrough" },
];

const SYSTEM: MenuItem[] = [
  { value: "settings", label: "Settings",    hint: "theme · colors" },
  { value: "info",     label: "About",       hint: "version · credits" },
  { value: "quit",     label: "Quit",        hint: "bye!" },
];

export async function showMainMenu(): Promise<string> {
  const allOptions = [
    { label: accent.multiline("  TOOLS"), value: "__group_tools__", hint: "" },
    ...TOOLS.map((t) => ({
      label:  "  " + theme.white(t.label),
      hint:   theme.dim(t.hint ?? ""),
      value:  t.value,
    })),
    { label: accent.multiline("  SYSTEM"), value: "__group_system__", hint: "" },
    ...SYSTEM.map((t) => ({
      label:  "  " + theme.white(t.label),
      hint:   theme.dim(t.hint ?? ""),
      value:  t.value,
    })),
  ];

  const result = await p.select<string>({
    message: theme.primary("Select a tool"),
    options: allOptions.filter(
      (o) => !o.value.startsWith("__group_")
    ),
  });

  if (p.isCancel(result)) return "quit";
  return result as string;
}

export async function prompt(message: string): Promise<string> {
  const result = await p.text({
    message: theme.primary(message),
    placeholder: "",
  });
  if (p.isCancel(result)) return "";
  return result as string;
}

export async function confirm(message: string): Promise<boolean> {
  const result = await p.confirm({ message: theme.primary(message) });
  if (p.isCancel(result)) return false;
  return result as boolean;
}

export function sectionHeader(title: string): void {
  process.stdout.write("\n" + divider() + "\n");
  const pad = Math.max(0, Math.floor((62 - title.length) / 2));
  process.stdout.write(" ".repeat(pad) + theme.primary(theme.bold(title)) + "\n");
  process.stdout.write(divider() + "\n\n");
}

export async function showSpinner<T>(
  label: string,
  task: () => Promise<T>
): Promise<T> {
  const spin = p.spinner();
  spin.start(theme.muted(label));
  try {
    const result = await task();
    spin.stop(theme.success("Done"));
    return result;
  } catch (e) {
    spin.stop(theme.error("Failed"));
    throw e;
  }
}

export function printResult(output: string): void {
  process.stdout.write("\n");
  const lines = output.trim().split("\n");
  for (const line of lines) {
    process.stdout.write("  " + theme.secondary(line) + "\n");
  }
  process.stdout.write("\n");
}

export function printError(msg: string): void {
  process.stdout.write("\n  " + theme.error("✗ " + msg) + "\n\n");
}

export async function pressEnterToContinue(): Promise<void> {
  await p.text({
    message: theme.dim("Press Enter to return to the menu"),
    placeholder: "",
  });
}
