import React, { useContext, useEffect, useState } from "react";
import {
  Card, CardHeader, CardBody, CardFooter, Divider, Link, Image,
} from "@nextui-org/react";
import { FileImportContext } from "../contexts/fileImportContext";
import { buildFolderStructure } from "../utils/buildFolderStructure";

const EXCLUDED_FOLDERS = ["node_modules", ".git", "dist", "build"];

function ImportProject() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const {filePaths, setFilePaths} = useContext(FileImportContext);
  const [detectedExcludedFolders, setDetectedExcludedFolders] = useState([]);

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

    // Extract file paths as strings
    const filePaths = filteredFiles.map(file => file.webkitRelativePath);
    setFilePaths(filePaths);
  };

  return (
    <div>
      <Card className="max-w-[600px] max-h-[350px] p-5">
        <CardHeader className="flex gap-3">
          <Image
            alt="nextui logo"
            height={40}
            radius="sm"
            src="/vite.svg"
            width={40}
          />
          <div className="flex flex-col">
            <p className="text-md">SecureDev</p>
            <p className="text-small text-default-500">securedev.org</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className='justify-center'>
          <p className='mb-2 text-center'>Open your local project</p>
          <input
            className="mb-2"
            directory=""
            webkitdirectory=""
            type="file"
            onChange={handleFileChange}
          />
          {filePaths.length ? (
            <div className="text-xs">
              <p className='mb-2'><span className="italic font-bold">{detectedExcludedFolders.join(', ')}</span> are not included</p>
              <p className='mb-2'>{filePaths.length} total files filtered</p>
            </div>
          ) : ""}
        </CardBody>
        <Divider />
        <CardFooter>
          <Link
            isExternal
            showAnchorIcon
            href="https://github.com/raia133"
          >
            About Me
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ImportProject;
