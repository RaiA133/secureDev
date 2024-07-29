
// ini tanpa folder dalam folder

import React, { useState } from 'react';
import {
	Card, CardBody,
	Accordion, AccordionItem, CheckboxGroup, Checkbox
} from "@nextui-org/react";

function FileStructure() {
	const [filesStructure, setFilesStructure] = useState([
		{
			folderName: "Folder1",
			files: ["File1", "File2", "File3"],
			checked: false,
			filesChecked: ["File1", "File2"],
		},
		{
			folderName: "Folder2",
			files: ["File1", "File2"],
			checked: true,
			filesChecked: ["File1", "File2"],
		},
		{
			folderName: "Folder3",
			files: ["File1", "File2", "File3", "File4", "File5"],
			checked: false,
			filesChecked: [],
		}
	]);

	const handleFolderCheckboxChange = (folderIndex) => {
		const newFilesStructure = [...filesStructure];
		newFilesStructure[folderIndex].checked = !filesStructure[folderIndex].checked;
		newFilesStructure[folderIndex].filesChecked = filesStructure[folderIndex].checked ? [...newFilesStructure[folderIndex].files] : [];
		setFilesStructure(newFilesStructure);
	};

	return (
		<div>

			<Card className='min-w-[300px] max-w-[600px] p-5 py-10'>
				<CardBody className='max-h-[600px] scroll-auto justify-center'>
					<Accordion selectionMode="multiple" isCompact>
						{filesStructure.map((folder, folderIndex) => (
							<AccordionItem key={folderIndex} title={
								<div className="flex items-center">
									<Checkbox
										isSelected={folder.checked}
										onChange={(checked) => {
											handleFolderCheckboxChange(folderIndex)
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

export default FileStructure;
