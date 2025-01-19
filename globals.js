///////////////////////////////////////////////////////////////////////////////////
// CONSTANTS
const SERVICE_ACCOUNT_KEY_FILE = 'crypto-ascent-411320-e3ccd3ca11bc.json';
const APP_DIR = '1_mWgOwvm6Wbm-_wXqnBxVoRlYjUMZOFS'
const RECEIPTS_DIR = getChildFolderID(APP_DIR, "Receipts")
const RECEIPT_DOC_DIR = getChildFolderID(RECEIPTS_DIR, "doc")
const RECEIPT_TXT_DIR = getChildFolderID(RECEIPTS_DIR, "txt")

      // TEST
      function testConstants() {
        Logger.log ('APP_DIR = ' + DriveApp.getFileById(APP_DIR))
        Logger.log ('RECEIPTS_DIR = ' + DriveApp.getFileById(RECEIPTS_DIR))
        Logger.log ('RECEIPT_DOC_DIR = ' + DriveApp.getFileById(RECEIPT_DOC_DIR))
        Logger.log ('RECEIPT_TXT_DIR = ' + DriveApp.getFileById(RECEIPT_TXT_DIR))
      }

      // TEST
      function testReceiptDocTxt(){
        Logger.log ('RECEIPTS_DIR = ' + DriveApp.getFileById(RECEIPTS_DIR))
        Logger.log ('Home_Depot_JPG = ' + DriveApp.getFileById(Home_Depot_JPG))
        const docFileID = newFileID(Home_Depot_JPG, RECEIPT_DOC_DIR)
        Logger.log ('docFileID = ' + DriveApp.getFileById(docFileID))
      }

//////////////////////////////////////////////////////////////////////////////////////////////
// Create instances of CreditCard and store them in a static array
CreditCard.allCards = [
  new CreditCard("WF Visa", "9791", "Paul"),
  new CreditCard("Lowe's Amex", "1047", "Karen"),
  new CreditCard("Lowe's Amex", "1039", "Kaylyn"),
  new CreditCard("Lowe's Amex", "1021", "T"),
  new CreditCard("Lowe's Amex", "1005", "Paul"),
  new CreditCard("Lowe's Amex", "1013", "Paul"),
  new CreditCard("Personal Card", "9473", "Karen"),
  new CreditCard("Personal Card", "0509", "Kaylyn"),
  new CreditCard("Personal Card", "4326" , "T")
];
      // TEST
      function testGetHolder(){
        var the4DigitID
        the4DigitID = "9791"; console.log(the4DigitID + " " + CreditCard.getHolder(the4DigitID)); // Output: "Paul"
        the4DigitID = "0000"; console.log(the4DigitID + " " + CreditCard.getHolder(the4DigitID)); // Output: "UNKNOWN"
        the4DigitID = "1021"; console.log(the4DigitID + " " + CreditCard.getName(the4DigitID)); // Output: "Lowe's Amex"
        the4DigitID = "0000"; console.log(the4DigitID + " " + CreditCard.getName(the4DigitID)); // Output: "UNKNOWN"
      }
//////////////////////////////////////////////////////////////////////////////////////////////