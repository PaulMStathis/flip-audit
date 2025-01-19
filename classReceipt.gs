const Dollar_General_JPG = '1O449AbuAE0-eJ2Vya54QkgJCwDBuzVQT'
const FPL_JPG = '1RpNcxtO6ZVBmiOK6xUWhcW3QqPk0F-bS'
const Home_Depot_JPG = '1OAI35SNR_hAZuGTbyHIXybqv_Da01f0-'
const Inspectagator_JPG = '1KeOr_h8oGhGNtCA-5PmPXiSSQb7ANxv9'
const Palm_Bay_PDF = '18nFV6nuuC7HXXSps7ZovnCQnLuh-X9uN'
const Palm_Bay_JPG = '1k_dYPAXohi8hnae2rogyyc3nljhhUjwu'
const Sunstate_PNG = '1dwjjKNgyaUbpRcDyw-QCPj8mdSBr5utz'
const Tropic_Granite_PDF = '1aib4t3y2-fkakcq-XWWJ9OdURd1iwkNZ'

class Receipt {
  constructor(fileId,fileText) {
    //const file = DriveApp.getFileById(receiptFileID);
    //const fileText = file.getBlob().getDataAsString();
    this.theDate = extractDateAndTime(fileText);
    this.thePayee = getPayeeName(fileText);
    this.theDescription = extractDelimitedTextBruteForceFinal(fileText,this.thePayee)
    this.theCreditCardNumber = extractCreditCard(fileText)
    this.theAmount = extractHighestDollarAmount(fileText);
  }

  logToConsole() {
  console.log(`Receipt.
    theDate = ${this.theDate}
    thePayee = ${this.thePayee}
    theDescription = ${this.theDescription}
    theCreditCardNumber = ${this.theCreditCardNumber}
    theAmount = ${this.theAmount}
    `);
  }
}

function testGetTextFromFile(){
  getTextFromFile(Dollar_General_JPG)
  getTextFromFile(FPL_JPG)
  getTextFromFile(Home_Depot_JPG)
  getTextFromFile(Inspectagator_JPG)
  getTextFromFile(Palm_Bay_PDF)
  getTextFromFile(Palm_Bay_JPG)
  getTextFromFile(Sunstate_PNG)
  getTextFromFile(Tropic_Granite_PDF)
}

function testParseReceipt(){
  var theReceipt;
  var theReceiptFileId;
  theReceiptFileId = Palm_Bay_JPG
  theReceipt = new Receipt(theReceiptFileId,getTextFromFile(theReceiptFileId))
  theReceipt.logToConsole()
  //parseReceipt (Home_Depot_JPG_API_Response)
  //parseReceipt (Dollar_General_JPG_API_RESPONSE)
}
function parseReceipt(receiptFileID) {
  var thePayee;
  const file = DriveApp.getFileById(receiptFileID);

  // Read the file content as text
  const fileText = file.getBlob().getDataAsString();
  //Logger.log('File Content: %s', fileText);

  thePayee = getPayeeName(fileText);
  Logger.log('---------------------------');
  if (thePayee) {
    Logger.log('Detected Payee: %s', thePayee);
  } else {
    Logger.log("Failed to extract payee from the file.");
  }
  
  // Extract formatted date and time
  const dateTime = extractDateAndTime(fileText);
  if (dateTime) { Logger.log('Extracted Date/Time: %s', dateTime);
    } else { Logger.log('No date or time found in the receipt.')
  }

  // Extract dollar amount
  const amount = extractHighestDollarAmount(fileText);
  if (amount) {
    Logger.log('Extracted Dollar Amount: $%s', amount);
  } else {
    Logger.log('No dollar amount found in the receipt.');
  }

  const delimitedText = extractDelimitedTextBruteForceFinal(fileText,thePayee)
    if (delimitedText) {
    Logger.log('Extracted Alphabetic Strings: %s', delimitedText);
  } else {
    Logger.log('No items found.');
  }

  const creditCard = extractCreditCard(fileText)
  if (creditCard) {
    Logger.log('Extracted Credit Card: %s', creditCard);
  } else {
    Logger.log('No credit card found.');
  }
}

function extractCreditCard(text) {
  const regexCapitalX = /X{8}.*?(?=\n|\\n)/;   // Regex to match capital X characters followed by text.
  const regexAsterisk = /\*\d+/;               // Regex to match asterisks and the following digits.
  //const regexAsterisk = /\*\*\*\*\*\d+/;     // Regex to match asterisks and the following digits.
  
  // Find the first match in the text
  var matchAsterisk, matchX;
  matchX = text.match(regexCapitalX);
  matchAsterisk = text.match(regexAsterisk)

  // Return the first match if found, otherwise return null
  var theMatch
  theMatch = matchX ? matchX[0] : null
  if (!theMatch){
    theMatch = matchAsterisk ? matchAsterisk[0]: null
  }

  if (theMatch) {
    const regexSeqDigits = /^\D*(\d+)/; //Regex to return only the sequential digits.
    const matchDigits = theMatch.match(regexSeqDigits);
    theMatch = matchDigits ? matchDigits[1] : '';
  }
  return theMatch;
}

function testExtractCreditCard() {
  const receiptText = `
    XXXXXXXXXXXX9473 VISA\n
    XXXXXXXXXXXX1234 MASTERCARD
    Some other text here
    XXXXXXXXXXXX5678 AMEX\n
    More random text
  `;

  const result = extractCreditCard(receiptText);

  if (result.length > 0) {
    Logger.log('Extracted Matches: %s', result.join(', '));
  } else {
    Logger.log('No matches found.');
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////

function extractDelimitedTextBruteForceFinal(text,thePayee) {
  // Brute force removal of problematic characters
  const cleanedText = text
    .replace(/[\n\r]+/g, ' ') // Remove all newline variations
    .replace(/<A>/g, '')      // Remove occurrences of <A>
    //.replace(/n/g, '')        // Remove every 'n', regardless of context
    .trim();                  // Trim any leading or trailing whitespace

  var delimiterStart, delimiterEnd;

  if(thePayee == "Home Depot")
  {
    // Regular expressions for a 12-digit number and the word "subtotal"
    delimiterStart = /\b\d{12}\b/; // Matches the first 12-digit number
    delimiterEnd = /\bsubtotal\b/i; // Matches the word "subtotal" (case-insensitive)
  }
  else if(thePayee == "Dollar General")
  {
    // TRANSACTION - Tax
    delimiterStart = 'TRANSACTION';
    delimiterEnd = 'Tax:';
  }else if(thePayee == "Tropic Granite")
  {
    delimiterStart = 'Amount';
    delimiterEnd = 'Thank you for your business';
  }
  
  // Find the start delimiter.
  const delimiterStartMatch = cleanedText.match(delimiterStart);
  if (!delimiterStartMatch) {
    return null; // Return null if no 12-digit number is found
  }

  // Find the end delimiter.
  const delimiterEndMatch = cleanedText.match(delimiterEnd);
  if (!delimiterEndMatch) {
    return null; // Return null if "subtotal" is not found
  }

  // Extract text between the first 12-digit number and "subtotal"
  const startIndex = cleanedText.indexOf(delimiterStartMatch[0]);
  const endIndex = cleanedText.indexOf(delimiterEndMatch[0]);
  if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
    return null; // Return null if delimiters are invalid
  }

  const delimitedText = cleanedText.substring(startIndex + delimiterStartMatch[0].length, endIndex);

  // Extract all alphabetic strings (ignoring numbers and special characters)
  const alphabeticStrings = delimitedText.match(/\b[A-Za-z]+\b/g);

  if (!alphabeticStrings) {
    return ''; // Return an empty string if no alphabetic strings are found
  }

  // Create a unique, comma-delimited list of alphabetic strings
  var uniqueStrings = [...new Set(alphabeticStrings)].join(',');
  // Retain only the entries longer than the length below.
  return uniqueStrings.split(',').filter(item => item.length > 3).join(',');
}

function extractHighestDollarAmount(text) {
    const dollarAmounts = text.match(/\$\d+(?:\.\d{1,2})?/g); // Find all $ amounts
    if (!dollarAmounts) {
        return null; // Return null if no dollar amounts are found
    }
    const numericValues = dollarAmounts.map(amount => parseFloat(amount.replace('$', ''))); // Convert to numbers
    return Math.max(...numericValues); // Find and return the highest value
}
  //TEST
  function testExtractHighestDollarAmount(){
    const inputText = "The items cost $45.67, $123.45, and $67.89.";
    const highestAmount = extractHighestDollarAmount(inputText);
    console.log(`The highest dollar amount is: $${highestAmount}`);
  }


function xextractDollarAmount(text) {
  // Define regular expressions for TOTAL and USD$
  const totalPattern = /^\wTOTAL[^\d]*\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i;
  const usdPattern = /USD\$[^\d]*\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i;

  // Try to find the dollar amount after "TOTAL"
  const totalMatch = text.match(totalPattern);
  if (totalMatch) {
    return formatDollarAmount(totalMatch[1]);
  }

  // If not found, try to find the dollar amount after "USD$"
  const usdMatch = text.match(usdPattern);
  if (usdMatch) {
    return formatDollarAmount(usdMatch[1]);
  }

  // Return null if no amount is found
  return null;
}

function formatDollarAmount(amount) {
  // Remove commas if present and ensure proper decimal places
  return parseFloat(amount.replace(/,/g, '')).toFixed(2);
}

function extractDateAndTime(text) {
  // Define regular expressions for date and time patterns
  const dateTimePattern = /\b(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})[ ,]*(\d{1,2}:\d{2}(?:\s?[APap][Mm])?)?\b/;
  const datePattern = /\b(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})\b/;

  // Try to match date and time
  const dateTimeMatch = text.match(dateTimePattern);
  if (dateTimeMatch) {
    const rawDate = dateTimeMatch[1];
    const rawTime = dateTimeMatch[2] || null; // Time may be missing

    // Format date to MM/DD/YYYY
    const formattedDate = formatDate(rawDate);

    // If time exists, format it and return both
    if (rawTime) {
      const formattedTime = formatTime(rawTime);
    //  return `${formattedDate} ${formattedTime}`;
    }
    // Return only the formatted date if no time
    return formattedDate;
  }

  // If no date and time found, try to match just the date
  const dateMatch = text.match(datePattern);
  if (dateMatch) {
    const rawDate = dateMatch[1];
    return formatDate(rawDate);
  }

  // Return null if no date or time found
  return null;
}

function formatDate(rawDate) {
  // Convert raw date to MM/DD/YYYY format
  const parts = rawDate.split(/[-/]/);
  const month = parts[0].padStart(2, '0');
  const day = parts[1].padStart(2, '0');
  const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
  return `${month}/${day}/${year}`;
}

function formatTime(rawTime) {
  // Convert raw time to HH:MM format (24-hour)
  const timeParts = rawTime.match(/(\d{1,2}):(\d{2})\s?([APap][Mm])?/);
  let hours = parseInt(timeParts[1], 10);
  const minutes = timeParts[2];
  const meridian = timeParts[3];

  // Convert to 24-hour time if meridian is present
  if (meridian) {
    const isPM = meridian.toUpperCase() === 'PM';
    if (isPM && hours !== 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;
  }

  return `${hours.toString().padStart(2, '0')}:${minutes}`;
}