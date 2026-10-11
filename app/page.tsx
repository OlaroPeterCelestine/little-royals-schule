import fs from "node:fs";
import path from "node:path";
import { SchoolDesk } from "@/components/school-desk";

const html = fs.readFileSync(path.join(process.cwd(), "school/body.html"), "utf8");

export default function HomePage() {
  return <SchoolDesk html={html} />;
}
