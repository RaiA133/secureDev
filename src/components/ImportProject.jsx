import React, { useContext, useEffect, useState } from "react";

import {
  Card, CardHeader, CardBody, CardFooter, Divider, Link, Image,
} from "@nextui-org/react";

import { FileImportContext } from "../contexts/fileImportContext";
import { ResultContext } from "../contexts/resultContextJson";

const EXCLUDED_FOLDERS = ["node_modules", ".git", "dist", "build", ".vscode", "vendor"];



function ImportProject() {
  const [detectedExcludedFolders, setDetectedExcludedFolders] = useState([]);

  const { 
    selectedFiles, setSelectedFiles, 
    filePaths, setFilePaths, 
    isResultVisible, 
    setFilePathsAiSuggest,
  } = useContext(FileImportContext);
  const {
		setResult,
	} = useContext(ResultContext)

  useEffect(() => {
    if (selectedFiles.length > 0) {
      const worker = new Worker(new URL('../utils/fileWorker.js', import.meta.url));
      worker.postMessage(selectedFiles);
      worker.onmessage = (event) => {
        setFilePaths(event.data);
        worker.terminate();
      };
    }
  }, [selectedFiles]);

  const handleFileChange = (event) => {
    setResult("")
    setFilePathsAiSuggest([])
    
    const files = Array.from(event.target.files);
    const foundExcludedFolders = new Set();
    const filteredFiles = files.filter(file => {
      const pathSegments = file.webkitRelativePath.split('/');
      const isExcluded = pathSegments.some(segment => {
        if (EXCLUDED_FOLDERS.includes(segment)) {
          foundExcludedFolders.add(segment);
          return true;
        }
        return false;
      });
      return !isExcluded;
    });
    setSelectedFiles(filteredFiles);
    setDetectedExcludedFolders(Array.from(foundExcludedFolders));

    const filePaths = filteredFiles.map(file => file.webkitRelativePath);
    setFilePaths(filePaths);

  };

  const [stickyImportPage, setStickyImportPage] = useState(false);

  useEffect(() => {
    setStickyImportPage(isResultVisible);
  }, [isResultVisible]);

  return (
    <div className={stickyImportPage ? "sticky top-10 self-start" : ""}>
      <Card className="w-full max-h-[350px] p-5">
        <CardHeader className="flex gap-3">
          <Image
            alt="nextui logo"
            height={40}
            radius="sm"
            src="/Logo_crop_no_bg.png"
            width={40}
          />
          <div className="flex flex-col">
            <p className="text-md">SecureDev</p>
            <p className="text-small text-default-500">Gemini API Developer Competition</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className='justify-center'>

          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white mt-4">Open your local project</label>
          <input
            className="mb-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            aria-describedby="file_input_help"
            directory=""
            webkitdirectory=""
            type="file"
            onChange={handleFileChange}
          />

          {filePaths.length && detectedExcludedFolders.join(', ') ? (
            <div className="text-xs">
              <p className='mb-2'><span className="italic font-bold">{detectedExcludedFolders.join(', ')}</span> are not included</p>
              <p className='mb-2'>{filePaths.length} total files filtered</p>
            </div>
          ) : ""}
        </CardBody>
        <Divider className="mt-4" />
        <CardFooter>
          <Link
            isExternal
            showAnchorIcon
            href="https://ai.google.dev/gemini-api"
            size="sm"
          >
            Powered by Gemini API
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ImportProject;
