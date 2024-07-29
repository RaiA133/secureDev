import React, { useState } from 'react';
import {
  Card, CardBody,
  Accordion, AccordionItem, CheckboxGroup, Checkbox
} from "@nextui-org/react";

function FileStructure() {
  const [filesStructure, setFilesStructure] = useState([
    {
      folderName: "Folder1",
      checked: false,
      filesChecked: ["File1", "File2"],
      files: ["File1", "File2", "File3"],
      subfolders: [
        {
          folderName: "Subfolder1",
          checked: false,
          filesChecked: ["SubFileA"],
          files: ["SubFileA", "SubFileB"],
          subfolders: []
        }
      ]
    },
    {
      folderName: "Folder2",
      checked: true,
      filesChecked: ["File1", "File2"],
      files: ["File1", "File2"],
      subfolders: []
    },
    {
      folderName: "Folder3",
      checked: false,
      filesChecked: [],
      files: ["File1", "File2", "File3", "File4", "File5"],
      subfolders: []
    }
  ]);

  const updateFilesStructure = (newStructure, parentFolders = filesStructure) => {
		setFilesStructure(parentFolders.map(folder => {
      if (folder.subfolders.length > 0) {
				return {
					...folder,
          subfolders: updateFilesStructure(newStructure, folder.subfolders)
        };
      } else if (folder.folderName === newStructure.folderName) {
        return newStructure;
      }
      return folder;
    }));
  };

  const handleFolderCheckboxChange = (folders, folderIndex) => {
    const newFolders = [...folders];
    const folder = newFolders[folderIndex];
    folder.checked = !folder.checked;
    folder.filesChecked = folder.checked ? [...folder.files] : [];

    folder.subfolders.forEach((subfolder, index) => {
      handleFolderCheckboxChange(folder.subfolders, index);
    });

    updateFilesStructure(folder, filesStructure);

    return newFolders;
  };

  const handleFileCheckboxChange = (folders, folderIndex, values) => {
    const newFolders = [...folders];
    const folder = newFolders[folderIndex];
    folder.filesChecked = values;
    folder.checked = values.length === folder.files.length;

    updateFilesStructure(folder, filesStructure);

    setFilesStructure(newFolders);
  };

  const renderFiles = (folder, folderIndex, parentFolders) => (
    <CheckboxGroup
      value={folder.filesChecked}
      onChange={(values) => handleFileCheckboxChange(parentFolders, folderIndex, values)}
      className='mb-3 pl-5'
    >
      {folder.files.map((file, fileIndex) => (
        <Checkbox key={fileIndex} value={file}>
          {file}
        </Checkbox>
      ))}
    </CheckboxGroup>
  );

  const renderFolders = (folder, folderIndex, parentFolders) => (
    <AccordionItem key={folderIndex} title={
      <div className="flex items-center">
        <Checkbox
          isSelected={folder.checked}
          onChange={() => {
            const newFilesStructure = handleFolderCheckboxChange(parentFolders, folderIndex);
            setFilesStructure(newFilesStructure);
          }}
        />
        <span>{folder.folderName}</span>
      </div>
    }>
      {folder.subfolders.length > 0 && (
        <Accordion>
          {folder.subfolders.map((subfolder, subfolderIndex) =>
            renderFolders(subfolder, subfolderIndex, folder.subfolders)
          )}
        </Accordion>
      )}
      {renderFiles(folder, folderIndex, parentFolders)}
    </AccordionItem>
  );

  return (
    <div className='flex flex-row gap-4'>
      <Card className='min-w-[300px] max-w-[600px] p-5 py-10'>
        <CardBody className='max-h-[600px] scroll-auto justify-center'>
          <Accordion selectionMode="multiple" isCompact>
            {filesStructure.map((folder, folderIndex) => renderFolders(folder, folderIndex, filesStructure))}
          </Accordion>
        </CardBody>
      </Card>
    </div>
  );
}

export default FileStructure;
