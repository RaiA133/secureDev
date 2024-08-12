export const getCheckedPaths = (folder, parentPath = '') => {
  if (!folder) return [];

  let paths = [];

  // Construct the current path for this folder
  const currentPath = parentPath ? `${parentPath}/${folder.folderName}` : folder.folderName;

  // Add checked files in the current folder to paths
  folder.filesChecked.forEach(file => {
    paths.push(`${currentPath}/${file}`);
  });

  // Recursively process subfolders
  folder.subfolders.forEach(subfolder => {
    paths = paths.concat(getCheckedPaths(subfolder, currentPath));
  });

  return paths;
};
