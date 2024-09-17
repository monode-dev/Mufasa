import { doNow } from "../Utils.js";

export async function compressImage(config: {
  webPath: string;
  maxSize?:
    | number
    | {
        width: number;
        height: number;
      };
  format?: `png` | `jpeg`;
}): Promise<string | null> {
  try {
    const image = new Image();
    image.src = config.webPath;

    await new Promise((resolve) => {
      image.onload = resolve;
    });

    const { outWidth, outHeight } = doNow(
      (): { outWidth: number; outHeight: number } => {
        if (config.maxSize === undefined) {
          return { outWidth: image.width, outHeight: image.height };
        } else if (typeof config.maxSize === `number`) {
          if (image.width * image.height > config.maxSize) {
            const aspectRatio = image.width / image.height;
            const outWidth = Math.sqrt(config.maxSize * aspectRatio);
            return {
              outWidth,
              outHeight: outWidth / aspectRatio,
            };
          } else {
            return { outWidth: image.width, outHeight: image.height };
          }
        } else {
          if (
            image.width * image.height >
            config.maxSize.width * config.maxSize.height
          ) {
            const aspectRatio = image.width / image.height;
            const outWidth = Math.sqrt(
              config.maxSize.width * config.maxSize.height * aspectRatio,
            );
            return {
              outWidth,
              outHeight: outWidth / aspectRatio,
            };
          } else {
            return { outWidth: image.width, outHeight: image.height };
          }
        }
      },
    );

    const canvas = document.createElement("canvas");
    canvas.width = outWidth;
    canvas.height = outHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(image, 0, 0, outWidth, outHeight);
    }

    return canvas.toDataURL(`image/${config.format ?? `jpeg`}`, 0.75);
  } catch (error) {
    console.error("Error converting to Base64:", error);
    return null;
  }
}
