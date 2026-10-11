import fs from "node:fs";
import path from "node:path";
import { Desk } from "@/components/desk";

export default function HomePage() {
  const html = fs.readFileSync(path.join(process.cwd(), "school/shell.html"), "utf8");
  return <Desk html={html} />;
}
