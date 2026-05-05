import chalk from "chalk";
import gradient from "gradient-string";

export const theme = {
  primary: chalk.hex("#9B79FF"),
  secondary: chalk.hex("#B7A4FF"),
  dim: chalk.hex("#5A5A7A"),
  success: chalk.hex("#4ADE80"),
  error: chalk.hex("#F87171"),
  warning: chalk.hex("#FBBF24"),
  muted: chalk.hex("#94A3B8"),
  white: chalk.white,
  bold: chalk.bold,
} as const;

// typed as any to avoid gradient-string internal type export issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const logo: any = gradient(["#9B79FF", "#C084FC", "#F472B6"]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const accent: any = gradient(["#60A5FA", "#9B79FF", "#C084FC"]);

export const BORDER_CHAR = "━";
export const BORDER_WIDTH = 62;

export function divider(color = theme.dim): string {
  return color(BORDER_CHAR.repeat(BORDER_WIDTH));
}

export function header(text: string): string {
  const pad = Math.max(0, Math.floor((BORDER_WIDTH - text.length) / 2));
  return " ".repeat(pad) + logo.multiline(text);
}

export const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
