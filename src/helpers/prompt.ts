import process from "node:process";
import fs from "node:fs";

export function getPrompt(fallback: string) {
  if (process.stdin.isTTY) {
    return fallback;
  }
  return fs.readFileSync(process.stdin.fd).toString().trim() || fallback;
}
