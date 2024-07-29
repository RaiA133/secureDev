import './App.css';
import React, { useState } from 'react';
import {
  Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, Input,
  Accordion, AccordionItem, CheckboxGroup, Checkbox
} from "@nextui-org/react";

function App() {
  const [filesStructure, setFilesStructure] = useState([
    {
      folderName: "Folder1",
      files: ["File1", "File2", "File3"],
      checked: false,
      filesChecked: ["File1", "File2"]
    },
    {
      folderName: "Folder2",
      files: ["File1", "File2"],
      checked: false,
      filesChecked: ["File5", "File2"]
    },
    {
      folderName: "Folder3",
      files: ["File1", "File2", "File3", "File4", "File5"],
      checked: false,
      filesChecked: []
    }
  ]);

  const handleFolderCheckboxChange = (folderIndex, checked) => {
    const newFilesStructure = [...filesStructure];
    newFilesStructure[folderIndex].checked = !filesStructure[folderIndex].checked;
    newFilesStructure[folderIndex].filesChecked = filesStructure[folderIndex].checked ? [...newFilesStructure[folderIndex].files] : [];
    setFilesStructure(newFilesStructure);
  };

  return (
    <div className='flex flex-row gap-4'>

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
          <Input type="file" multiple />
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

      <Card className='w-[600px] p-5 py-10'>
        <CardBody className='max-h-[600px] scroll-auto justify-center'>
          <Accordion selectionMode="multiple" isCompact>
            {filesStructure.map((folder, folderIndex) => (
              <AccordionItem key={folderIndex} title={
                <div className="flex items-center">
                  <Checkbox
                    isSelected={folder.checked}
                    onChange={(checked) => {
                      handleFolderCheckboxChange(folderIndex, checked)
                    }}
                  />
                  <span>{folder.folderName}</span>
                </div>
              }>
                <CheckboxGroup 
                  value={folder.filesChecked} 
                  onChange={(values) => {
                    const newFilesStructure = [...filesStructure];
                    newFilesStructure[folderIndex].filesChecked = values;
                    newFilesStructure[folderIndex].checked = values.length === newFilesStructure[folderIndex].files.length;
                    setFilesStructure(newFilesStructure);
                  }} 
                  className='mb-3 pl-5'
                >
                  {folder.files.map((file, fileIndex) => (
                    <Checkbox
                      key={fileIndex}
                      value={file}
                    >
                      {file}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </AccordionItem>
            ))}
          </Accordion>
        </CardBody>
      </Card>
      
    </div>
  );
}

export default App;
