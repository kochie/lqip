import { useEffect } from "react";
import { spawn, Worker } from "threads";

type Base64Function = (
  filePath: string,
  fileMime: string,
  resizeWidth: number
) => Promise<string>;

export default () => {
  let base64: Base64Function;

  useEffect(() => {
    const init = async () => {
      base64 = await spawn<Base64Function>(
        new Worker("../workers/base64.worker.ts")
      );
    };
    init();
  }, []);

  return null
};
