import React, { useState, useRef } from "react";


import Tesseract from "tesseract.js";

import {Buffer} from 'buffer';


export default function App() {
  const [language, setLanguage] = useState("eng");

  const [percentage, setPercentage] = useState(0);
  const [progressBar, setProgressBar] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");
  const [image, setImage] = useState("");

  const { createWorker } = Tesseract;

  const [holData, setHolData] = useState();

  const onFileChange = (e) => {
    let file = e.target.files[0];
    console.log("file :- ", file);
    // setImage(file);


    if(file){
      const reader = new FileReader();
      reader.onload = _handleReaderLoaded
      reader.readAsBinaryString(file)
    }
    // setFiles(e.target.files[0]);
  };

  const _handleReaderLoaded=(readerEvt)=>{
    let binaryString = readerEvt.target.result

    setImage(btoa(binaryString))

    console.log(btoa(binaryString))
  }

  const handleClick = async () => {
    setIsLoading(true);
    window.Buffer = window.Buffer || require("buffer").Buffer; 
    

    // let imageBuffer = Buffer.from((image, "base64"))

    let base64 = image;   
    let imageBuffer = Buffer.from(base64, "base64");

    // return(console.log("imageBuffer :- ",imageBuffer))

    const worker = createWorker({
      logger: (m) => {
        // console.log(m)
        if (m.status === "recognizing text") {
          setProgressBar(m.progress);
          setPercentage(parseInt(m.progress * 100));
        }
      },
    });

    await worker.load();
    await worker.loadLanguage(language);
    await worker.initialize(language);
    const data = await worker.recognize( imageBuffer);
    console.log(data);
    setHolData(data);
    setText(data.data.text);
    setIsLoading(false);

    downloadPDF(worker)
    // await worker.terminate();
  };

  const downloadPDF = async (worker) => {

      const filename = 'Celect-ocr.pdf';
      const { data } = await worker.getPDF('CELECT OCR Result');
      const blob = new Blob([new Uint8Array(data)], { type: 'application/pdf' });

      var fileURL = URL.createObjectURL(blob);
      window.open(fileURL);

      // return console.log("blob :- ", blob, data);

    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, filename);
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  return (
    <div className="container">
      <div className="row h-100">
        <div className="col-md-5 mx-auto d-flex flex-column align-items-center">
          {!isLoading && <h1 className="mt-5 mb-4 pb-5">Image To Text</h1>}

          {/* form */}

          {!isLoading && !text && (
            <>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="form-select mb-3"
                aria-label="Default select example"
              >
                <option value="eng">English</option>
                <option value="hin">Hindi</option>
                <option value="urd">Urdu</option>
              </select>

              <div className="col-12 mb-3">
                <input
                  className="form-control"
                  type="file"
                  id="formFile"
                  onChange={(e) => onFileChange(e)}
                />
              </div>

              <input
                type="button"
                className="form-control btn btn-primary mt-4"
                value={"Convert"}
                onClick={handleClick}
              />
            </>
          )}

          {/* PROGRESS BAR */}
          {isLoading && (
            <>
              <p className="text-center mt-5">
                Converting :- <progress value={progressBar} max={1} />{" "}
                {percentage}%
              </p>
            </>
          )}

          {/* Text Area */}
          {!isLoading && text && (
            <>
              <textarea
                name=""
                id=""
                cols="30"
                className="form-control"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows="15"
              ></textarea>

              <p className="mt-5">{text}</p>

              <div className="mt-3 mb-5">
                <button
                  onClick={() => downloadPDF()}
                  // onClick={handlePrint}

                  className="btn btn-primary"
                >
                  Download PDF
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
