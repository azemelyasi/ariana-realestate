import fs from "fs";
import path from "path";

const src1 = path.join(process.cwd(), "src/assets/images/ariana_premium_logo_1780405823718.png");
const src2 = path.join(process.cwd(), "src/assets/images/ariana_new_logo_1780405216507.png");

const dest1 = path.join(process.cwd(), "public/logo512.png");
const dest2 = path.join(process.cwd(), "public/logo192.png");

async function run() {
  try {
    // Dynamically load Jimp to handle serverless build-time failures or library mismatch on target hosts like Vercel
    const jimpModule = await import("jimp");
    const Jimp = jimpModule.Jimp;

    // If the premium logo exists, process it with proper aspect ratio padding to 1:1 square config
    const sourcePath = fs.existsSync(src1) ? src1 : (fs.existsSync(src2) ? src2 : null);

    if (sourcePath) {
      console.log("Processing high-quality PWA icons from source:", sourcePath);
      const image = await Jimp.read(sourcePath);
      const w = image.width;
      const h = image.height;

      // Pad container to perfect 1:1 square, using #0b0f19 (0x0b0f19ff) to match Melkban theme
      const maxDim = Math.max(w, h);
      const square = new Jimp({
        width: maxDim,
        height: maxDim,
        color: 0x0b0f19ff
      });

      const x = Math.floor((maxDim - w) / 2);
      const y = Math.floor((maxDim - h) / 2);
      square.composite(image, x, y);

      // Write valid PNG formatted files (this fixes Windows not displaying the logo and mobile stretching)
      const logo512 = square.clone().resize({ w: 512, h: 512 });
      await logo512.write(dest1);
      console.log("✓ Successfully generated real square public/logo512.png");

      const logo192 = square.clone().resize({ w: 192, h: 192 });
      await logo192.write(dest2);
      console.log("✓ Successfully generated real square public/logo192.png");
    } else {
      console.warn("⚠ No source logo assets found to generate PWA icons.");
    }
  } catch (err) {
    console.error("✕ Failed to generate PWA logo assets:", err);
    // Fallback copy if Jimp fails for some reason
    try {
      if (fs.existsSync(src1)) {
        fs.copyFileSync(src1, dest1);
        console.log("✓ Fallback copied src1 to dest1");
      }
      if (fs.existsSync(src2)) {
        fs.copyFileSync(src2, dest2);
        console.log("✓ Fallback copied src2 to dest2");
      }
    } catch (fallbackError) {
      console.error("✕ Fallback copying failed too:", fallbackError);
    }
  }
}

run();
