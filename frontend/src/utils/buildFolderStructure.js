export const buildFolderStructure = (paths) => {
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

  // Populate files in folders
  paths.forEach(path => {
    const parts = path.split('/');
    const fileName = parts.pop();
    const folderPath = parts.join('/');

    const parentFolder = foldersMap.get(folderPath);
    if (parentFolder) {
      parentFolder.files.push(fileName);
    }
  });

  // Return the root folder or an empty array if root is null
  return root ? [root] : [];
};