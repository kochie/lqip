import Jimp from "jimp";
import { expose } from "threads/worker";

const ERROR_EXT = `Error: Input file is missing or of an unsupported image format lqip`;

const SUPPORTED_MIMES = ["image/jpeg", "image/png"];

function base64(
  filePath: string,
  fileMime: string,
  resizeWidth: number
) {
  return new Promise((resolve, reject) => {
    if (!SUPPORTED_MIMES.includes(fileMime)) {
      return reject(ERROR_EXT);
    }

    return Jimp.read(filePath)
      .then(image => image.resize(resizeWidth, Jimp.AUTO))
      .then(image =>
        image.getBuffer(fileMime, (err, data) => {
          if (err) return reject(err);
          if (data) {
            return resolve(toBase64(fileMime, data));
          }

          return reject(
            new Error("Unhandled promise rejection in base64 promise")
          );
        })
      )

      .catch(err => {
        return reject(err);
      });
  });
}

const toBase64 = (extMimeType: string, data: Buffer) => {
  return `data:${extMimeType};base64,${data.toString("base64")}`;
};

expose(base64);
