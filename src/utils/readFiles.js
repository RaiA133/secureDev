export const readFiles = (files, selectedFilePaths) => {
  const promises = files
    .filter(file => selectedFilePaths.includes(file.webkitRelativePath))
    .map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
          // const modifiedContent = event.target.result.replace(/"/g, "'");

          // Mengembalikan konten file
          resolve({
            fileName: file.name,
            filePath: file.webkitRelativePath,
            content: event.target.result,
            // content: modifiedContent,
          });
        };

        reader.onerror = (error) => {
          reject(error);
        };

        // Membaca file sebagai teks
        reader.readAsText(file);
      });
    });

  // Menunggu semua file selesai dibaca
  return Promise.all(promises);
};
