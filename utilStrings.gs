//////////////////////////////////////////////////////////////////////////
function getStringClean(theString){
    var theCleanString = cleanWhitespace(theString);
    theCleanString = theCleanString.replace(String.fromCharCode(10)," ");
    theCleanString = theCleanString.replace(String.fromCharCode(13)," ");
    theCleanString = theCleanString.replace("  "," ");
    theCleanString = theCleanString.trim();
    return theCleanString
  }
  //////////////////////////////////////////////////////////////////////////
  
  //////////////////////////////////////////////////////////////////////////
  function cleanWhitespace(inputString) {
    // Regular expression to match one or more consecutive whitespace or non-printable characters
    const regex = /[\s\p{C}]+/gu; 
    return inputString.replace(regex, " "); 
  }
  //////////////////////////////////////////////////////////////////////////
  
  //////////////////////////////////////////////////////////////////////////
  function stringIsInText(theStringToSearch, theStringToSearchFor)
  {
    var theResult = false
    var theIndex = theStringToSearch.toLowerCase().indexOf(theStringToSearchFor.toLowerCase())
    if (theIndex > -1) { theResult = true}
    return theResult;
  }
        // TEST
        function testStringIsInText()
        {
          const theStringToSearch = "Home Depot- Plumbing materials ($27.56)"
          var theTab = 15, theResult
          var i=0, theStringToSearchFor = theStringsToSearchFor[i]
          Logger.log(theStringToSearch)
          while (theStringToSearchFor != null)
          {
            theResult = ""
            var theTabDelta = theTab - theStringToSearchFor.length
            while (theTabDelta > 0)
            {
              theResult = theResult + " "
              theTabDelta--;
            }
            var theResult = theResult +"WAS"
            if(!stringIsInText(theStringToSearch, theStringToSearchFor))
            {
              theResult = theResult + " NOT"
            }
            Logger.log("  " + theStringToSearchFor + theResult + " found.")
            theStringToSearchFor = theStringsToSearchFor[++i]
          }
        }
  //////////////////////////////////////////////////////////////////////////////////////////////