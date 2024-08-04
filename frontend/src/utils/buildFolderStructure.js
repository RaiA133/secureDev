export const buildFolderStructure = (paths, checkedPaths) => {
  const createFolder = (folderName, id) => ({
    id,
    folderName,
    checked: false,
    filesChecked: [],
    files: [],
    subfolders: []
  });

  const getId = () => '_' + Math.random().toString(36).substr(2, 9);

  let root = null;
  const foldersMap = new Map();

  // Build the folder structure
  paths.forEach(path => {
    const parts = path.split('/');
    let currentPath = '';
    let parentFolder = null;

    for (const part of parts) {
      currentPath += currentPath ? '/' + part : part;

      if (!foldersMap.has(currentPath)) {
        const isFile = currentPath === path;
        const id = getId();
        const folder = isFile
          ? null
          : createFolder(part, id);

        if (folder) {
          foldersMap.set(currentPath, folder);
          if (parentFolder) {
            parentFolder.subfolders.push(folder);
          } else if (!root) {
            root = folder;
          }
        } else {
          foldersMap.set(currentPath, { id, fileName: part });
        }

        parentFolder = folder;
      } else {
        parentFolder = foldersMap.get(currentPath);
      }
    }
  });

  // Populate files in folders and mark checked files
  paths.forEach(path => {
    const parts = path.split('/');
    const fileName = parts.pop();
    const folderPath = parts.join('/');

    const parentFolder = foldersMap.get(folderPath);
    if (parentFolder) {
      parentFolder.files.push(fileName);
      if (checkedPaths.includes(path)) {
        parentFolder.filesChecked.push(fileName);
      }
    }
  });

  // Check if all files in a folder are checked and update the `checked` property
  const updateFolderCheckedStatus = (folder) => {
    if (folder.files.length === folder.filesChecked.length) {
      folder.checked = true;
    }
    folder.subfolders.forEach(updateFolderCheckedStatus);
  };

  if (root) {
    updateFolderCheckedStatus(root);
  }

  // Return the root folder or an empty array if root is null
  return root ? [root] : [];
};