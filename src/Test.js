import React from "react";

import Tesseract from "tesseract.js";

export const Test = () => {
  const tesseractWorkerPath = "js/tesseract/worker.min.js";
  const tesseractLangPath = "js/tesseract/lang-data/4.0.0_best";
  const tesseractCorePath = "js/tesseract/tesseract-core.wasm.js";
  var worker;

  async function initTesseractWorker() {
    worker = Tesseract.createWorker({
      workerPath: tesseractWorkerPath,
      langPath: tesseractLangPath,
      corePath: tesseractCorePath,
    });
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    return new Promise((resolve) => resolve("worker initialised."));
  }

  return (
    <div>
      <button onClick={()=>initTesseractWorker()}>test</button>
    </div>
  );
};
