import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function MergePdf() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [showAllPages1, setShowAllPages1] = useState(false);
  const [showAllPages2, setShowAllPages2] = useState(false);

  const handleFileChange1 = (e) => setFile1(e.target.files[0]);
  const handleFileChange2 = (e) => setFile2(e.target.files[0]);

  return (
    <div className="p-10 space-y-10">
      <div>
        <h2 className="text-xl font-bold mb-2">Upload First PDF</h2>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange1}
        />
        {file1 && (
          <div
            className="border p-2 mt-2 hover:shadow-lg cursor-pointer"
            onClick={() => setShowAllPages1(!showAllPages1)}
          >
            <Document file={file1}>
              {showAllPages1 ? (
                Array.from(new Array(file1.numPages), (el, index) => (
                  <Page key={index} pageNumber={index + 1} />
                ))
              ) : (
                <Page pageNumber={1} />
              )}
            </Document>
            {!showAllPages1 && (
              <div className="text-sm mt-1">Hover/click to see all pages</div>
            )}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Upload Second PDF</h2>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange2}
        />
        {file2 && (
          <div
            className="border p-2 mt-2 hover:shadow-lg cursor-pointer"
            onClick={() => setShowAllPages2(!showAllPages2)}
          >
            <Document file={file2}>
              {showAllPages2 ? (
                Array.from(new Array(file2.numPages), (el, index) => (
                  <Page key={index} pageNumber={index + 1} />
                ))
              ) : (
                <Page pageNumber={1} />
              )}
            </Document>
            {!showAllPages2 && (
              <div className="text-sm mt-1">Hover/click to see all pages</div>
            )}
          </div>
        )}
      </div>

      <Button className="mt-5">Submit PDFs</Button>
    </div>
  );
}
