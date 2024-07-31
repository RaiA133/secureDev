self.onmessage = function (event) {
	const files = event.data;
	const filePaths = files.map(file => file.webkitRelativePath);
	postMessage(filePaths);
};
