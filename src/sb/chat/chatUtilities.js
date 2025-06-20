// ------------------------------------------------------------------------------------------
// Helper functions and variables for chat
// ------------------------------------------------------------------------------------------


export const sourcesRegex = /<source>(.*?)<\/source>/g;

export const httpsRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.~#?&//=]*)/g;


// ------------------------------------------------------------------------------------------


export function formatDuration(timestamp) {
   const totalSeconds = Math.floor(timestamp / 1000);
   
   const minutes = Math.floor(totalSeconds / 60);
   const seconds = totalSeconds % 60;
   
   let formattedTime = '';
   
   if (minutes > 0) {
      formattedTime += `${minutes} min${minutes > 1 ? 's' : ''}`;
   }
   
   if (seconds > 0) {
      if (formattedTime.length > 0) {
         formattedTime += ', ';
      }
      
      formattedTime += `${seconds} sec${seconds > 1 ? 's' : ''}`;
   }
   
   return formattedTime;
}


// ------------------------------------------------------------------------------------------


export const shortTimeFormat = new Intl.DateTimeFormat('en', {
   timeStyle: 'short',
   dateStyle: 'short',
});


// ------------------------------------------------------------------------------------------


export function maskEmail(text) {
   const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
   
   return text.replace(emailRegex, '####');
}


// ------------------------------------------------------------------------------------------


export function maskDOB(str) {
   
   const pattern = /(?:\b(?:birthday|DOB)\b\s*(?:\w+\s*){0,4}\b(\d{2}\/\d{2}\/\d{2,4})\b|\b(\d{2}\/\d{2}\/\d{2,4})\b\s*(?:\w+\s*){0,2}\b(?:birthday|DOB)\b)/gi;
   
   const maskDate = (match, date1, date2) => {
      const date = date1 || date2;
      return `${match.slice(0, match.indexOf(date))} #### ${match.slice(match.indexOf(date) + date.length)}`;
   };
   
   return str.replace(pattern, maskDate);
}


// ------------------------------------------------------------------------------------------


export function maskSensitiveInfo(input, { bankingCards = true, emailIds = true, phoneNumbers = true, ssn = true, additionalPatterns = [] }) {
   
   const inputText = emailIds ? maskEmail(input) : input;
   
   const regexes = [

      // credit/debit card
      ...bankingCards ? [
         /\d{4}-\d{6}-\d{4}/,
         /\d{4}\s\d{6}\s\d{4}/,
         /\d{16}/,
         /\d{4}\.\d{6}\.\d{4}/,
         /\d{4}-\d{6}-\d{5}/,
         /\d{4}\s\d{6}\s\d{5}/,
         /\d{15}/,
         /\d{4}\.\d{6}\.\d{5}/,
         /\d{4}-\d{4}-\d{4}-\d{4}/,
         /\d{4}\s\d{4}\s\d{4}\s\d{4}/,
         /\d{19}/,
         /\d{4}\.\d{4}\.\d{4}\.\d{4}/,
      ] : [],

      // phone numbers
      ...phoneNumbers ? [
         /\b\s?\d{3}-\d{4}\s?\b/g,                                            // 123-4567
         /\b\s?\d{3}-\d{3}-\d{4}\s?\b/g,                                      // 123-456-7890
         /\b\s?\d{3}[-\u2011)]?\d{7}\s?\b/g,                                  // 123-4567890
         /\b\s?\d{10}\s?\b/g,                                                 // 1234567890

         /\(\d{3}\)\d{3}[-\u2011)]?\d{4}/,                                    // (123)456-7890
         /\(\d{3}\)[-\u2011)]?\d{3}-\d{4}/,                                   // (123)-456-7890
         /\(\d{3}\)(?:[-\u2011)]?)?\d{3}-\d{4}/,                              //combination of the above two

         /\(\d{3}\)[-\u2011)]?\d{7}/,                                         // (123)-4567890
         /\b\s?1[-\u2011)]?\d{3}[-\u2011)]?\d{3}[-\u2011)]?\d{4}\s?\b/g,      // 1-123-456-7890
         /\b\s?1-\d{3}-\d{7}\s?\b/g,                                          // 1-123-4567890
         /\b\s?1-\d{10}\s?\b/g,                                               // 1-2345678901
         /\b\s?\d{11}\s?\b/g,                                                 // 12345678901
         /\b\s?1\(\d{3}\)\d{3}-\d{4}\s?\b/g,                                  // 1(123)456-7890
         /\b\s?1\(\d{3}\)-\d{3}-\d{4}\s?\b/g,                                 // 1(123)-456-7890
         /\b\s?1\(\d{3}\)-\d{7}\s?\b/g,                                       // 1(123)-4567890
         /\b\s?1-\(\d{3}\)\d{3}-\d{4}\s?\b/g,                                 // 1-(123)456-7890
         /\b\s?1-\(\d{3}\)-\d{3}-\d{4}\s?\b/g,                                // 1-(123)-456-7890
         /\b\s?1-\(\d{3}\)-\d{7}\s?\b/g,                                      // 1-(123)-4567890
         // /(\+\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g
      ] : [],

      // SSN
      ...(ssn ? [
         /\d{3}-\d{2}-\d{4}/,
         /\d{9}/,
         /\d{3}\.\d{2}\.\d{4}/,
         /\d{3}\s\d{2}\s\d{4}/,
      ] : []),

      // additional patterns
      ...stringsToRegex(additionalPatterns)
   ];
   
   let result = inputText;
   
   regexes.sort((a, b) => b.source.length - a.source.length); //so that longer patterns are matched first, avoiding partial matches
   
   for (const regex of regexes) {
      result = result.replace(regex, '####');
   }
   
   return result;
}


export function processRegexes(regexArray) {
   const regexStrings = regexArray
      .map((line) => line.trim())
      .filter((line) => line !== '')
      .map(removeEnclosingSlashes);

   const regexObjects = regexStrings
      .map((str) => {
         try {
            const [pattern, flags] = separatePatternAndFlags(str);
            return new RegExp(pattern, flags);
         } catch (e) {
            console.error(`Invalid regex: ${str}`);
            return null;
         }
      })
      .filter((regex) => regex !== null);

   const regexForPayload = regexesToStrings(regexObjects);
   
   return regexForPayload;
}


function removeEnclosingSlashes(str) {
   if (str.startsWith("/") && str.lastIndexOf("/") > 0) {
      return str.slice(1, str.lastIndexOf("/"));
   }
   return str;
}


function separatePatternAndFlags(str) {
   const lastSlash = str.lastIndexOf("/");
   if (lastSlash > 0 && lastSlash < str.length - 1) {
      return [str.slice(0, lastSlash), str.slice(lastSlash + 1)];
   }
   return [str, ''];
}


function regexesToStrings(regexArray) {
   return regexArray
      .map((regex) => {
         if (regex instanceof RegExp) {
            return regex.source + (regex.flags ? "/" + regex.flags : '');
         } else if (typeof regex === "string") {
            return regex;
         } else {
            return null;
         }
      })
      .filter((str) => str !== null);
}


function stringsToRegex(stringArray) {
   return stringArray.map((str) => {
      const lastSlash = str.lastIndexOf("/");
      if (lastSlash > 0 && lastSlash < str.length - 1) {
         const pattern = str.slice(0, lastSlash);
         const flags = str.slice(lastSlash + 1);

         return new RegExp(pattern, flags);
      } else {
         return new RegExp(str);
      }
   });
}