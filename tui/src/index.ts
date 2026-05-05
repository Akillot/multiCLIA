import * as p from "@clack/prompts";
import { renderLogo } from "./components/logo.js";
import { showMainMenu } from "./components/menu.js";
import { handleTool } from "./tools/index.js";
import { clearScreen } from "./utils/animate.js";
import { theme, divider } from "./utils/theme.js";
import os from "os";

async function greet(): Promise<void> {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const name = os.userInfo().username;
  const now = new Date().toLocaleString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  process.stdout.write(
    "  " +
      theme.muted(`${greeting}, `) +
      theme.primary(name) +
      theme.muted("  ·  ") +
      theme.dim(now) +
      "\n"
  );
  process.stdout.write("\n");
}

async function main(): Promise<void> {
  clearScreen();
  p.intro(theme.primary("  multiCLIA  "));

  await renderLogo();
  await greet();

  while (true) {
    const choice = await showMainMenu();

    if (choice === "quit") {
      process.stdout.write("\n");
      p.outro(theme.dim("See you next time. Bye!"));
      process.exit(0);
    }

    clearScreen();
    await handleTool(choice);
    clearScreen();
    await renderLogo();
  }
}

main().catch((e) => {
  p.outro(theme.error("Fatal: " + (e as Error).message));
  process.exit(1);
});
