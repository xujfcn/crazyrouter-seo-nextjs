import { writeFile } from "node:fs/promises";

const url = "https://cn.crazyrouter.com/api/pricing";
const output = new URL("../content/pricing-snapshot.json", import.meta.url);

const response = await fetch(url);

if (!response.ok) {
  throw new Error(`Pricing sync failed: ${response.status} ${response.statusText}`);
}

const json = await response.json();

if (!json?.success || !Array.isArray(json.data)) {
  throw new Error("Pricing sync failed: unexpected response shape");
}

await writeFile(output, `${JSON.stringify(json)}\n`);
console.log(`Synced ${json.data.length} pricing rows to ${output.pathname}`);
