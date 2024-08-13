import React, { useContext, useEffect, useState } from 'react';

import {
	Card, CardBody, Divider, Skeleton,
	Accordion, AccordionItem, CheckboxGroup, Checkbox,
	Popover, PopoverTrigger, PopoverContent, Button, // info pop up filePathsAiSuggest
	Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure // modal for result before read all checked file
} from "@nextui-org/react";

import { ResultContext } from '../contexts/resultContextJson';
import { FileImportContext } from '../contexts/fileImportContext';
import { GenerateCodeChanges } from '../contexts/generateCodeChanges';

import { readFiles } from '../utils/readFiles';
import { getCheckedPaths } from '../utils/getCheckedPaths';
import { buildFolderStructure } from '../utils/buildFolderStructure';



function FileStructure() {
	const [filesStructure, setFilesStructure] = useState([]); // hasil perubahan dari array path project ke object yg bisa dibaca UI
	const {
		selectedFiles,
		filePaths,
		filePathsAiSuggest,
		projectFramework,
		checkedPaths, setCheckedPaths,
		setIsResultVisible,
	} = useContext(FileImportContext)
	const { 
		setResultCodeChange 
	} = useContext(GenerateCodeChanges);
	const {
		setDataset, result,
		isLoading,
	} = useContext(ResultContext)

	const { isOpen, onOpen, onOpenChange } = useDisclosure(); // modal 

	useEffect(() => {
		setFilesStructure(buildFolderStructure(filePaths, filePathsAiSuggest))
	}, [filePaths, filePathsAiSuggest])

	useEffect(() => {
		setCheckedPaths(getCheckedPaths(filesStructure[0]))
	}, [filesStructure])

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
			className='my-1 pl-2'
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
		<AccordionItem key={folder.id} textValue={folder.folderName} subtitle={
			<div className="flex items-center text-white text-xs">
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

	// membaca semua file ketika pencet submit
	const handleSubmit = () => {
		setResultCodeChange("")
		readFiles(selectedFiles, checkedPaths)
			.then((fileContents) => {
				const filesArray = fileContents.map(file => ({
					FileName: file.fileName,
					filePath: file.filePath,
					content: file.content,
				}));
				setIsResultVisible(true);
				setDataset({
					'framework': projectFramework,
					'code': filesArray,
				})
			})
			.catch((error) => {
				console.error("Error reading files:", error);
			});
	};

	return (
		<>
			{filesStructure.length > 0 ? (
				<div className='flex flex-row gap-4'>
					<Card className='min-w-[300px] w-full p-5 pb-5'>
						<CardBody className='max-h-[600px] scroll-auto justify-top'>

							<div className='flex flex-row'>
								{filePathsAiSuggest.length == 0 ? (
									<div className=" ps-2 max-w-[200px] w-full flex items-center gap-3">
										<div className="w-full flex flex-col gap-2">
											<Skeleton className="h-3 w-2/5 rounded-lg pb-8" />
										</div>
									</div>
								) : projectFramework}
							</div>

							<Divider className='my-2' />

							<Accordion selectionMode="multiple" showDivider={true} isCompact >
								{filesStructure.map((folder) => renderFolders(folder, folder.id, filesStructure))}
							</Accordion>

							<div className='flex flex-row gap-2 mt-2 h-full justify-between items-end'>

								{filePathsAiSuggest.length > 0 ? (
									<div className='flex flex-row gap-2'>
										<Popover placement="bottom" showArrow={true} key='warning' color={'default'}>
											<PopoverTrigger disabled>
												<Button color='ghost' size="sm" className="w-fit">{filePathsAiSuggest.length} file is already checked by AI</Button>
											</PopoverTrigger>
											<PopoverContent>
												<div className="px-1 py-2">
													<div className="text-small font-bold mb-2">List AI suggested pre-checked file ({projectFramework})</div>

													<div className="text-tiny max-h-40 overflow-y-auto">
														<ol className=''>
															{filePathsAiSuggest.map((listCheck, index) => (
																<li key={index}>
																	{index + 1}. {listCheck}
																</li>
															))}
														</ol>
													</div>

													<Divider className='my-2 bg-slate-400' />

													<div className='border border-indigo-500/75  rounded-md p-2 px-4 text-xs'>
														<span>This list of files is suggested by AI based on files that are often changed by developers,</span> <br />
														<span>you can changes it by re-checked file/folder, its editable.</span>
													</div>

												</div>
											</PopoverContent>
										</Popover>
									</div>
								) : (
									<div className=" ps-2 max-w-[200px] w-full flex items-center gap-3">
										<div className="w-full flex flex-col gap-2">
											<Skeleton className="h-3 w-5/5 rounded-lg pb-8" />
										</div>
									</div>
								)}

								{/* MODAL */}
								{filesStructure.length > 0 ? (
									<div className=''>

										{!isLoading && (
											<Button color='default' size='sm' onPress={onOpen}>Scan
												{result ? (" Again ") : " "}
											({checkedPaths.length} files)</Button>
										)}

										<Modal
											size='2xl'
											backdrop='blur'
											isOpen={isOpen}
											onOpenChange={onOpenChange}
											classNames={{
												body: "py-6",
												base: "border-[#292f46] bg-[#27272A] dark:bg-[#27272A] text-white",
												header: "border-b-[1px] border-[#292f46]",
												footer: "border-t-[1px] border-[#292f46]",
												closeButton: "hover:bg-white/5 active:bg-white/10",
											}}
										>
											<ModalContent>
												{(onClose) => (
													<>
														<ModalHeader className="flex flex-col gap-1">Let Gemini AI understand your Code </ModalHeader>
														<ModalBody>

															<ol className='text-xs max-h-[300px] overflow-y-auto'>
																{checkedPaths.map((listCheck, index) => (
																	<li key={index}>
																		{index + 1}. {listCheck}
																	</li>
																))}
															</ol>

															<Divider className='my-2 bg-white' />

															<div className='text-xs'>
																These are all the files that have been checked, please double check whether you have changed all these files before, before the <span className='font-bold text-warning-500'>application vulnerability scanning</span> process for your  <span className='font-bold text-green-500'>{projectFramework}</span> App start.
															</div>

														</ModalBody>
														<ModalFooter>
															<Button color="secondary" variant="light" onPress={onClose} className='text-white'>
																Cencel
															</Button>
															<Button color="default" onPress={onClose} onClick={handleSubmit}>
																Submit
															</Button>
														</ModalFooter>
													</>
												)}
											</ModalContent>
										</Modal>
									</div>
								) : ""}
								{/* END MODAL */}

							</div>

						</CardBody>
					</Card>
				</div>
			) : ""}
		</>
	);
}

export default FileStructure;