///////////////////////////////////////////////////////////////////////////////////
// CONSTANTS
const Dollar_General_JPG_API_RESPONSE = '1pmlgB9aPSqiEtvWWcJg3vwxIVVm5PDyZ'
const FPL_JPG_API_Response = '1apaj78TOYUPtBSqoYU8Uu_fowVgB3z_o'
const Home_Depot_JPG_API_Response = '1awCY5NJLAg9khOJ90ce4UfSJSjSSTx6n'
const Inspectagator_JPG_API_Response = '1F2eL29ZhvbgINyv31yBrcfE6fUC0g7lD'
const Sunstate_PNG_API_Response = '1wCvUB02klIh-m9GoiEn0_n-18Fq2CuRG'
const Tropic_Granite_Binary_PDF_Converted_TO_GDoc = '1IWW0s9vFfMJU1_-uZv3ARdNqC1hPvTgOTzWQEI1ed_U'
const Tropic_Granite_Binary_PDF_Converted_TO_TXT = '1yPPJd6Qh_-w2SwDYUDWKdFyvIBX9gj0V'
///////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////
// Main function to process a receipt using Google Cloud Vision API.
function processReceipt(receiptFileID) {
  const theType = getFileTypeById(receiptFileID)
  Logger.log (theType)

  //const accessToken = getAccessTokenFromServiceAccount();
  //const imageBase64 = getFileAsBase64(receiptFileID);
  //const response = callVisionAPI(accessToken, imageBase64);

  // Save the API response to Google Drive
 // const fileUrl = saveResponseToFile(response);
 //Logger.log('API Response saved to file: %s', fileUrl);
}
      // TEST
      function testProcessReceipt(){
        processReceipt(Home_Depot_JPG);
        processReceipt(Inspectagator_JPG);
        processReceipt(Dollar_General_JPG);
        processReceipt(Tropic_Granite_Binary_PDF);
        processReceipt(FPL_JPG)
        processReceipt(Sunstate_PNG)
      }

///////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////
// Get the file type of a file given its ID.
//  fileId: The ID of the file.
//  Returns: The file type of the file, or an error message if the file cannot be found.
function getFileTypeById(fileId) {
  try {
    // Get the file using its ID
    var file = DriveApp.getFileById(fileId); 

    // Get the file type
    var fileType = file.getMimeType(); 

    return fileType; 
  } catch (error) { 
    return `Error: File with ID '${fileId}' not found.`; 
  }
}
///////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////
function saveResponseToFile(responseJson, fileName = 'API_Response.json') {
  // Ensure responseJson is a string
  const responseString = typeof responseJson === 'string' ? responseJson : JSON.stringify(responseJson, null, 2);

  // Create a blob with the JSON string
  const blob = Utilities.newBlob(responseString, 'application/json', fileName);

  // Save the blob as a file in Google Drive
  const file = DriveApp.createFile(blob);
  Logger.log('File created: %s', file.getUrl());
  return file.getUrl();
}
      // TEST
      function testSaveResponseToFile(){
        var response = "Now is the time for all good men to come to the aid of their country"
        const fileUrl = saveResponseToFile(response);
        Logger.log('API Response saved to file: %s', fileUrl);
      }
///////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////
// Get an access token using the service account JSON key file.
function getAccessTokenFromServiceAccount() {
  const file = DriveApp.getFilesByName(SERVICE_ACCOUNT_KEY_FILE).next();
  const keyFile = JSON.parse(file.getBlob().getDataAsString());

  const jwtHeader = {
    alg: "RS256",
    typ: "JWT"
  };

  const jwtClaimSet = {
    iss: keyFile.client_email,
    scope: "https://www.googleapis.com/auth/cloud-platform",
    aud: "https://oauth2.googleapis.com/token",
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000)
  };

  const jwtHeaderEncoded = Utilities.base64EncodeWebSafe(JSON.stringify(jwtHeader));
  const jwtClaimSetEncoded = Utilities.base64EncodeWebSafe(JSON.stringify(jwtClaimSet));
  const jwtSignature = Utilities.base64EncodeWebSafe(
    Utilities.computeRsaSha256Signature(jwtHeaderEncoded + "." + jwtClaimSetEncoded, keyFile.private_key)
  );

  const jwt = `${jwtHeaderEncoded}.${jwtClaimSetEncoded}.${jwtSignature}`;

  const tokenResponse = UrlFetchApp.fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    contentType: "application/x-www-form-urlencoded",
    payload: {
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt
    }
  });

  return JSON.parse(tokenResponse.getContentText()).access_token;
}
///////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////
// Convert a file in Google Drive to a Base64-encoded string.
 function getFileAsBase64(fileId) {
  const fileBlob = DriveApp.getFileById(fileId).getBlob();
  return Utilities.base64Encode(fileBlob.getBytes());
}
///////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////
// Call the Google Cloud Vision API with the image data.
 function callVisionAPI(accessToken, imageBase64) {
  const url = "https://vision.googleapis.com/v1/images:annotate";
  const payload = {
    requests: [
      {
        image: { content: imageBase64 },
        features: [{ type: "TEXT_DETECTION" }]
      }
    ]
  };

  const options = {
    method: "POST",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    payload: JSON.stringify(payload)
  };

  const response = UrlFetchApp.fetch(url, options);
  return JSON.parse(response.getContentText());
}
///////////////////////////////////////////////////////////////////////////////////