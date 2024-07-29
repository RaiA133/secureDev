import React, { useState } from 'react';
import {
	Card, CardBody,
	Accordion, AccordionItem, CheckboxGroup, Checkbox
} from "@nextui-org/react";

// Fungsi untuk menghasilkan ID unik
const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

function FileStructure() {
	const [filesStructure, setFilesStructure] = useState([
		{
			id: generateId(),
			folderName: "Folder1",
			checked: false,
			filesChecked: ["File1", "File2"],
			files: ["File1", "File2", "File3"],
			subfolders: [
				{
					id: generateId(),
					folderName: "Subfolder1",
					checked: false,
					filesChecked: ["SubFileA"],
					files: ["SubFileA", "SubFileB"],
					subfolders: [
						{
							id: generateId(),
							folderName: "Subfolder2",
							checked: false,
							filesChecked: ["SubFileA"],
							files: ["SubFileA", "SubFileB"],
							subfolders: [
								{
									id: generateId(),
									folderName: "Subfolder3",
									checked: false,
									filesChecked: ["SubFileA"],
									files: ["SubFileA", "SubFileB"],
									subfolders: []
								}
							]
						}
					]
				}
			]
		},
		{
			id: generateId(),
			folderName: "Folder2",
			checked: false,
			filesChecked: ["File1", "File2"],
			files: ["File1", "File2"],
			subfolders: [
				{
					id: generateId(),
					folderName: "Subfolder1",
					checked: true,
					filesChecked: ["SubFileA"],
					files: ["SubFileA", "SubFileB"],
					subfolders: []
				},
				{
					id: generateId(),
					folderName: "Subfolder2",
					checked: false,
					filesChecked: ["SubFileA"],
					files: ["SubFileA", "SubFileB"],
					subfolders: []
				}
			]
		},
		{
			id: generateId(),
			folderName: "Folder3",
			checked: false,
			filesChecked: [],
			files: ["File1", "File2", "File3", "File4", "File5"],
			subfolders: []
		}
	]);

	// Fungsi untuk memperbarui folder berdasarkan ID
	const updateFolderStructure = (folders, updatedFolder) => {
		return folders.map(folder => {
			if (folder.id === updatedFolder.id) return updatedFolder;
			if (folder.subfolders.length > 0) {
				return {
					...folder,
					subfolders: updateFolderStructure(folder.subfolders, updatedFolder)
				};
			}
			return folder;
		});
	};

	// Menangani perubahan checkbox folder
	const handleFolderCheckboxChange = (folders, folderId) => {
		const newFolders = [...folders];
		const folder = newFolders.find(f => f.id === folderId);
		if (!folder) return newFolders;
		folder.checked = !folder.checked;
		folder.filesChecked = folder.checked ? [...folder.files] : [];
		folder.subfolders.forEach((subfolder, index) => {
			const updatedSubfolder = handleFolderCheckboxChange(folder.subfolders, subfolder.id);
			folder.subfolders[index] = updatedSubfolder.find(f => f.id === subfolder.id);
		});
		folder.checked = checkIfFolderChecked(folder);
		const updatedStructure = updateFolderStructure(filesStructure, folder);
		setFilesStructure(updatedStructure);

		return newFolders;
	};

	// Menangani perubahan checkbox file
	const handleFileCheckboxChange = (folders, folderId, values) => {
		const newFolders = [...folders];
		const folder = newFolders.find(f => f.id === folderId);
		if (!folder) return newFolders;
		folder.filesChecked = values;
		folder.checked = values.length === folder.files.length;
		const updatedStructure = updateFolderStructure(filesStructure, folder);
		setFilesStructure(updatedStructure);
		return newFolders;
	};

	// Memeriksa jika folder harus dianggap checked
	const checkIfFolderChecked = (folder) => {
		const allFilesChecked = folder.files.length === folder.filesChecked.length;
		const allSubfoldersChecked = folder.subfolders.every(subfolder => subfolder.checked);
		return allFilesChecked && allSubfoldersChecked;
	};

	// Menampilkan file dalam folder
	const renderFiles = (folder, folderIndex, parentFolders) => (
		<CheckboxGroup
			value={folder.filesChecked}
			onChange={(values) => handleFileCheckboxChange(parentFolders, folder.id, values)}
			className='mb-2 pl-2'
		>
			{folder.files.map((file, fileIndex) => (
				<Checkbox size="sm" key={fileIndex} value={file} color="secondary">
					<span className="text-xs italic text-gray-400">{file}</span>
				</Checkbox>
			))}
		</CheckboxGroup>
	);

	// Menampilkan folder dan subfolder
	const renderFolders = (folder, folderIndex, parentFolders) => (
		<AccordionItem key={folder.id} subtitle={
			<div className="flex items-center text-white">
				<Checkbox
					size="sm"
					isSelected={folder.checked}
					onChange={() => {
						const updatedFolder = handleFolderCheckboxChange(parentFolders, folder.id);
						setFilesStructure(updateFolderStructure(filesStructure, updatedFolder.find(f => f.id === folder.id)));
					}}
				/>
				<span>{folder.folderName}</span>
			</div>
		}>
			{folder.subfolders.length > 0 && (
				<Accordion selectionMode="multiple" showDivider={true} isCompact >
					{folder.subfolders.map((subfolder) =>
						renderFolders(subfolder, subfolder.id, folder.subfolders)
					)}
				</Accordion>
			)}
			{renderFiles(folder, folderIndex, parentFolders)}
		</AccordionItem>
	);

	return (
		<div className='flex flex-row gap-4'>
			<Card className='min-w-[300px] max-w-[600px] p-5 py-10'>
				<CardBody className='max-h-[600px] scroll-auto justify-top'>
					<Accordion selectionMode="multiple" showDivider={true} isCompact >
						{filesStructure.map((folder) => renderFolders(folder, folder.id, filesStructure))}
					</Accordion>
				</CardBody>
			</Card>
		</div>
	);
}

export default FileStructure;
