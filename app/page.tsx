import fs from "node:fs";
import path from "node:path";
import { Desk } from "@/components/desk";

const html = fs.readFileSync(path.join(process.cwd(), "school/shell.html"), "utf8");

export default function HomePage() {
  return <Desk html={html} />;
}
