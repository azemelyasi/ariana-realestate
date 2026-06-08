import fs from "fs";
import path from "path";

const src1 = path.join(process.cwd(), "src/assets/images/ariana_premium_logo_1780405823718.png");
const src2 = path.join(process.cwd(), "src/assets/images/ariana_new_logo_1780405216507.png");

const dest1 = path.join(process.cwd(), "public/logo512.png");
const dest2 = path.join(process.cwd(), "public/logo192.png");

try {
  if (fs.existsSync(src1)) {
    fs.copyFileSync(src1, dest1);
    console.log("✓ Copied premium logo to public/logo512.png");
  }
  if (fs.existsSync(src2)) {
    fs.copyFileSync(src2, dest2);
    console.log("✓ Copied standard logo to public/logo192.png");
  }
} catch (e) {
  console.error("✕ Asset copying failed:", e);
}
