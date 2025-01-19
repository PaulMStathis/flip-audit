function testFileAccess() {
  const fileId = '1OAI35SNR_hAZuGTbyHIXybqv_Da01f0-'; // Replace with your file ID
  const file = DriveApp.getFileById(fileId);
  Logger.log('File Name: %s', file.getName());
}

////////////////////////////////////////////////////////////////////
 // Get the ID of a child folder within a specified parent folder.
 //
 // @param {string} parentFolderID - The ID of the parent folder.
 // @param {string} childFolderName - The name of the child folder to find.
 // @returns {string|null} - The ID of the child folder if found, otherwise null.
 //
function getChildFolderID(parentFolderID, childFolderName) {
  // 1. Get the parent folder's contents.
  const parentFolder = DriveApp.getFolderById(parentFolderID);
  const folders = parentFolder.getFolders();

  // 2. Iterate through the folders and find the one with the matching name.
  while (folders.hasNext()) {
    const folder = folders.next();
    if (folder.getName() === childFolderName) {
      return folder.getId();
    }
  }

  // 3. If no matching folder is found, return null.
  return null;
}
////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////
// Copy a file to a specified folder, rename it with the source file
// name and the target folder name as the extension, and return the
// ID of the newly created file.
// @param {string} sourceFileID The ID of the source file.
// @param {string} targetFileFolderID The ID of the target folder.
// @returns {string} The ID of the newly created file.

 function newFileID(sourceFileID, targetFileFolderID) {
  // Get the source file.
  const sourceFile = DriveApp.getFileById(sourceFileID);

  // Get the target folder.
  const targetFolder = DriveApp.getFolderById(targetFileFolderID);

  // Get the source file name.
  const sourceFileName = sourceFile.getName();

  // Get the target folder name.
  const targetFolderName = targetFolder.getName();

  // Construct the new file name.
  const newFileName = `${sourceFileName}.${targetFolderName}`;

  // Copy the file to the target folder with the new name.
  const newFile = sourceFile.makeCopy(newFileName, targetFolder);

  // Return the ID of the newly created file.
  return newFile.getId();
}
////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////
function getFileUrl(partialFileName) {
  var folders = DriveApp.getFolders();
  while (folders.hasNext()) {
    var folder = folders.next();
    var folderName = folder.getName();
    //if (folderName == "Checks")
    {
      //dbg(folder.getName());

      //var files = folder.getFilesByName(partialFileName);
      var files = folder.getFiles();
      while (files.hasNext()) {
        var file = files.next();
        var filename = file.getName();
        if (stringIsInText(filename, partialFileName))
        {
        //  dbg("Match "+filename);
          return file.getUrl();  // Returns the first matching file's URL
        }
        else
        {
        //  dbg(filename);
        }
      }
    }
  }
  return ''; // Return an empty string if no file is found
}
//////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////
// Return text extracted from the specified file.
// @param {string} fileId
// @returns {string} txtContent
function getTextFromFile(fileId){
  var parentFolderId = getParentFolderId(fileId)
  var sourceFile = DriveApp.getFileById(fileId);

  // Get the parent folder of the source file.
  var parentFolder = sourceFile.getParents().next();

  const destFolder = Drive.Files.get(parentFolderId, { "supportsAllDrives": true });
  
  const newFile = {
    "fileId": fileId,
    "parents": [
      destFolder
    ]
  };
  const args = {
    "resource": {
      "parents": [
        destFolder
      ],
      "name": "temp",
      "mimeType": "application/vnd.google-apps.document",
    },
    "supportsAllDrives": true
  };

  //const docFileID = newFileID(fileId, RECEIPT_DOC_DIR)

  // Create a .doc file in drive to hold the contents.
  const docFile = Drive.Files.copy(newFile, fileId, args);
  const xxx = drive.files.copy()
  const docContent = DocumentApp.openById(docFile.getId());

  // Extract the contents to a .txt file.
  var txtContent = docContent.getBody().getText();
  txtContent = getStringClean(txtContent)
  // Create a text file containing the body.
  createTextFileInSameFolder(fileId,txtContent)
  // Clean up.
  //deleteFileById(fileId)
  deleteFilesByName(parentFolderId, "temp")
  return txtContent
}
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Create a new file in the same Drive folder as the specified file ID, 
// with the same name as the input file with extension .txt, 
// and containing the given text string.
// @param {string} fileId The ID of the source file.
// @param {string} textString The text content to be written to the new file.
// @return {File} The newly created file.
function createTextFileInSameFolder(fileId, textString) {
  // Get the source file.
  var sourceFile = DriveApp.getFileById(fileId);

  // Get the parent folder of the source file.
  var parentFolder = sourceFile.getParents().next();

  // Create the new file name with .txt extension.
  var fileName = sourceFile.getName() + ".txt";

  // Create the new file in the same folder.
  var newFile = parentFolder.createFile(fileName, textString);

  return newFile;
}
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
function getParentFolderId(fileId) {
  try {
    const file = DriveApp.getFileById(fileId);
    const parents = file.getParents();
    if (parents.hasNext()) {
      const parentFolder = parents.next();
      return parentFolder.getId();
    } else {
      Logger.log("File with ID: " + fileId + " has no parent folder.");
      return null; 
    }
  } catch (error) {
    Logger.log("Error getting parent folder ID for file with ID: " + fileId + ". Error message: " + error.message);
    return null; 
  }
}
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
function deleteFileById(fileId) {
  try {
    DriveApp.getFileById(fileId).setTrashed(true); 
    Logger.log("File with ID: " + fileId + " was successfully trashed.");
  } catch (error) {
    Logger.log("Error deleting file with ID: " + fileId + ". Error message: " + error.message);
  }
}
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
function deleteFilesByName(folderId, fileName) {
  try {
    const folder = DriveApp.getFolderById(folderId);
    const files = folder.getFiles();

    while (files.hasNext()) {
      const file = files.next();
      if (file.getName() === fileName) {
        file.setTrashed(true); 
        Logger.log(`File '${fileName}' with ID: ${file.getId()} was trashed.`);
      }
    }
  } catch (error) {
    Logger.log(`Error deleting files named '${fileName}' in folder with ID: ${folderId}. Error message: ${error.message}`);
  }
}
///////////////////////////////////////////////////////////////////////////////