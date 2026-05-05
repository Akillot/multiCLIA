import { spawnSync, spawn } from "child_process";
import { existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function findJar(): string {
  const candidates = [
    resolve(__dirname, "../../../target/MultiCLIA-3.0-jar-with-dependencies.jar"),
    resolve(__dirname, "../../../target/MultiCLIA-3.0.jar"),
  ];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  throw new Error(
    "MultiCLIA JAR not found. Run: cd .. && mvn package -q"
  );
}

export function runJavaTool(args: string[]): string {
  const jar = findJar();
  const result = spawnSync("java", ["-jar", jar, ...args], {
    encoding: "utf-8",
    timeout: 30_000,
    env: { ...process.env },
  });
  if (result.error) throw result.error;
  return (result.stdout ?? "") + (result.stderr ?? "");
}

export function spawnJavaInteractive(args: string[]): void {
  const jar = findJar();
  const child = spawn("java", ["-jar", jar, ...args], {
    stdio: "inherit",
    env: { ...process.env },
  });
  child.on("error", (e) => {
    process.stderr.write(`Java error: ${e.message}\n`);
  });
  // block until child exits
  const result = spawnSync("java", ["-jar", jar, ...args], {
    stdio: "inherit",
    env: { ...process.env },
  });
  void result;
}
