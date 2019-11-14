import React, { FormEvent, useRef, useState, useEffect } from "react";
import ReactCompareImage from "react-compare-image";
import { spawn, Worker } from "threads";

import Modal from "../components/modal";

import Class from "../styles/index.module.css";

interface Lqip {
  filename: string;
  lqip: string;
  url: string;
}

type Base64Function = (
  filePath: string,
  fileMime: string,
  resizeWidth: number
) => Promise<string>;

export default () => {
  const fileInput = useRef<HTMLInputElement>(null);
  const [lqips, setLqips] = useState<Lqip[]>([]);
  const [resizeWidth, setResizeWidth] = useState<number>(10);

  let base64: Base64Function;

  useEffect(() => {
    const init = async () => {
      base64 = await spawn<Base64Function>(
        new Worker("../workers/base64.worker")
      );
    };
    init();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (fileInput.current === null) return;
    if (fileInput.current.files === null) return;

    const files = Array.from(fileInput.current.files);

    files.forEach(async file => {
      if (file === null) return;
      if (!base64) return
      const lqip = await base64(
        URL.createObjectURL(file),
        file.type,
        resizeWidth
      );
      const l = { filename: file.name, lqip, url: URL.createObjectURL(file) };
      setLqips([...lqips, l]);
    });
  }

  const trigger = <div className={Class.fullscreenButton}>fullscreen</div>;

  return (
    <>
      <h1>LQIP Converter</h1>
      <form onSubmit={(e: FormEvent<HTMLFormElement>) => handleSubmit(e)}>
        <input ref={fileInput} type="file" multiple />
        <label>
          <p>Resize Width: {resizeWidth}</p>
          <input
            type="range"
            min="1"
            max="100"
            value={resizeWidth}
            onChange={e => setResizeWidth(Number(e.target.value))}
          />
        </label>
        <button type="submit">Submit</button>
      </form>

      {lqips.map((lqip, i) => (
        <div key={`${lqip.filename}-${i}`}>
          <h3>{lqip.filename}</h3>
          <div className={Class.container}>
            <textarea className={Class.textbox} readOnly value={lqip.lqip} />
            <div className={Class.imageCompareContainer}>
              <Modal trigger={trigger}>
                <div className={Class.fullscreen}>
                  <ReactCompareImage
                    leftImage={lqip.lqip}
                    rightImage={lqip.url}
                  />
                </div>
              </Modal>
              <div className={Class.imageCompare}>
                <ReactCompareImage
                  leftImage={lqip.lqip}
                  rightImage={lqip.url}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
