import { useEffect, useState } from "react";
import {
	Card, CardHeader, CardBody, CardFooter, Divider, Link, Image,
} from "@nextui-org/react";

function ImportProject() {
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [filePaths, setFilePaths] = useState([]);

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
		setSelectedFiles(Array.from(event.target.files));
	};

	// console.log(JSON.stringify(filePaths, null, 2));
	console.log(filePaths);

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
						directory=""
						webkitdirectory=""
						type="file"
						onChange={handleFileChange}
					/>
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
	)
}

export default ImportProject;