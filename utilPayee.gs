//////////////////////////////////////////////////////////////////////////////////////////////
const THE_PAYEES = ["All Brevard Insurance", "Amazon", "Brevard County", "City of Palm Bay", "Conry Roofing", "Dollar General","Drain Mechanics","Dumpster", "Florida Power and Light", "FPL", "Home Depot", "Inspectagator", "Lowe's", "MK Electric", "Melbourne Utilities", "Palm Bay Air Care", "Paradise Garage Doors", "SCCU", "Speedway", "Sunstate Tree", "Tropic Granite", "Tucker's", "Wedland Septic"];

////////////////////////////////////////////////////////////////////
function getPayeeName(theInputString){
  var payeeX, thePayee = ""
  payeeX=0
  while ((THE_PAYEES[payeeX] != null) && (thePayee == "")) {
    if (stringIsInText(theInputString, THE_PAYEES[payeeX])) {
      return THE_PAYEES[payeeX] }
    payeeX++
  }
}
      // TEST
      const SUBJECT_STRINGS = [
        "20240202 Amazon $75.31 Electrical",                    // 0
        "Account update",                                       // 1
        "Summary of failures for Google Apps Script: Scripts",  // 2
        "Home Depot- Paint/miscellaneous $453.48",              // 3
        "Lowes- Paint/Primer $295.32",                          // 4
        "You made a credit card purchase of $453.48",           // 5
        "20240108 Earnest money wire transfer $5000.00",        // 6
        "Home Depot- Plumbing materials ($27.56)",              // 7
        "Evidence of insurnace",                                // 8
        "20240202 $9800 Conry Roofing",                         // 9
        "Share request for Docs",                               //10
        "Dumpster’s & Dads $400.00 Dumpster ",                  //11
        "Home Depot Flooring Materials $150",                   //12
        ""                                                      //13
      ];
      function testGetPayeeName(){
        var i=0, thePayeeName, theInputString = SUBJECT_STRINGS[i];
        while (theInputString != null) {
          thePayeeName = getPayeeName(theInputString);
          Logger.log(theInputString + " --> " + thePayeeName);
          theInputString = SUBJECT_STRINGS[++i];
        }
      }
////////////////////////////////////////////////////////////////////