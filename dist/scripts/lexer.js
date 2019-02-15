/* lexer.ts  */
var TSC;
(function (TSC) {
    var Lexer = /** @class */ (function () {
        function Lexer() {
        }
        Lexer.lex = function () {
            {
                // Creating all the RegEx for the grammar
                var Keywords = {
                    T_PRINT: new RegExp('print'),
                    T_WHILE: new RegExp('while'),
                    T_IF: new RegExp('if'),
                    T_INT: new RegExp('int'),
                    T_STRING: new RegExp('string'),
                    T_BOOLEAN: new RegExp('boolean'),
                    T_TRUE: new RegExp('true'),
                    T_FALSE: new RegExp('false')
                };
                var Symbols = {
                    T_L_BRACE: new RegExp('{'),
                    T_R_BRACE: new RegExp('}'),
                    T_EOP: new RegExp('\\$'),
                    T_SPACE: new RegExp('\\s'),
                    T_ADDITION_OP: new RegExp('\\+'),
                    T_L_PAREN: new RegExp('\\('),
                    T_R_PAREN: new RegExp('\\)'),
                    T_EQUALS: new RegExp('=='),
                    T_NOT_EQUAL: new RegExp('!='),
                    T_ASSIGNMENT_OP: new RegExp('^=$'),
                    T_QUOTE: new RegExp('^\\"$'),
                    T_BEGIN_COMMENT: new RegExp('\\/\\*'),
                    T_END_COMMENT: new RegExp('\\*\\/')
                };
                var T_ID = new RegExp('[a-z]');
                var T_DIGIT = new RegExp('[0-9]');
                // Lex hierarchy:
                // 1. Keyword
                // 2. ID
                // 3. Symbol
                // 4. Digit
                // 5. Char
                /*
                Lexer TODO: Have lexer fix a missing $. Ignore Comments. Option to switch on verbose mode.
                */
                var lextext = "Lexing program 1...\n";
                for (currentTokenIndex; currentTokenIndex < tokens.length; currentTokenIndex++) {
                    var tokenFound = false;
                    var currentChar = tokens.charAt(currentTokenIndex);
                    currentToken = currentToken + currentChar;
                    currentToken = currentToken.trim();
                    console.log("Current Token" + currentToken);
                    // Check for keyword
                    for (var regex in Keywords) {
                        if (Keywords[regex].test(currentToken)) {
                            console.log("Found keyword " + currentToken);
                            var keywordStart = currentToken.search(Keywords[regex]) + lastTokenIndex;
                            var keywordStartFromCurrent = keywordStart - lastTokenIndex;
                            console.log(Keywords[regex]);
                            console.log(currentToken);
                            // If found keyword, print all last IDs
                            console.log(lastTokenTypeFound);
                            console.log(lastTokenIndex);
                            console.log(keywordStart);
                            if (lastTokenTypeFound == "ID") {
                                while (lastTokenIndex < keywordStart) {
                                    console.log(lastTokenIndex);
                                    console.log(tokens.charAt(lastTokenIndex));
                                    if (!lexErrorFound)
                                        lextext += "Found Token T_ID [ " + tokens.charAt(lastTokenIndex) + " ] " + " at index " + lastTokenIndex + "\n";
                                    lastTokenIndex++;
                                }
                                console.log("current token is before " + currentToken);
                                currentToken = currentToken.substring(keywordStartFromCurrent);
                                console.log("current token is now " + currentToken);
                            }
                            if (!lexErrorFound)
                                lextext += "Found Token " + regex + " [ " + currentToken + " ] " + " at index " + keywordStart + "\n";
                            lastTokenIndex = keywordStart - 1;
                            tokenFound = true;
                            currentToken = "";
                            lastTokenTypeFound = "Keyword";
                        }
                    }
                    if (!tokenFound) {
                        // Not keyword, check for id
                        if (T_ID.test(currentChar)) {
                            if (lastTokenTypeFound != "ID") {
                                lastTokenIndex = currentTokenIndex;
                            }
                            tokenFound = true;
                            currentSearchString += currentChar;
                            lastTokenTypeFound = "ID";
                        }
                        else {
                            // Not id, check for symbol
                            for (var regex in Symbols) {
                                if (Symbols[regex].test(currentChar)) {
                                    // If found symbol, print all last IDs
                                    if (lastTokenTypeFound == "ID") {
                                        var keywordFound = false;
                                        console.log("last index is " + lastTokenIndex);
                                        while (lastTokenIndex < currentTokenIndex) {
                                            console.log("last index in here is " + lastTokenIndex);
                                            // Check if the current list of ids contains a keyword
                                            var currentTokens = tokens.substring(lastTokenIndex, currentTokenIndex);
                                            for (var K_regex in Keywords) {
                                                if (Keywords[K_regex].test(currentTokens) && !lexErrorFound) {
                                                    console.log("Found keyword " + currentTokens);
                                                    lextext += "Found Token " + K_regex + " [ " + currentTokens + " ] " + " at index " + lastTokenIndex + "\n";
                                                    keywordFound = true;
                                                }
                                            }
                                            if (!lexErrorFound && !keywordFound) {
                                                lextext += "Found Token T_ID [ " + tokens.charAt(lastTokenIndex) + " ] " + " at index " + lastTokenIndex + "\n";
                                            }
                                            lastTokenIndex++;
                                        }
                                    }
                                    // Check for == case
                                    if (Symbols[regex] == Symbols['T_ASSIGNMENT_OP']) {
                                        var lastChar = currentChar;
                                        lastTokenIndex = currentTokenIndex;
                                        currentTokenIndex++;
                                        currentToken = currentChar + tokens.charAt(currentTokenIndex);
                                        if (Symbols['T_EQUALS'].test(currentToken)) {
                                            if (!lexErrorFound)
                                                lextext += "Found Token T_EQUALS [ " + currentToken + " ] " + " at index " + lastTokenIndex + "\n";
                                            lastTokenIndex = currentTokenIndex;
                                            tokenFound = true;
                                            currentToken = "";
                                            lastTokenTypeFound = "Symbol";
                                        }
                                        else {
                                            currentTokenIndex = lastTokenIndex;
                                            //currentToken = lastToken;
                                        }
                                    }
                                    if (!tokenFound) {
                                        if (!lexErrorFound)
                                            console.log("the regex is " + regex);
                                        lextext += "Found Token " + regex + " [ " + currentChar + " ] " + " at index " + currentTokenIndex + "\n";
                                        lastTokenIndex = currentTokenIndex;
                                        tokenFound = true;
                                        currentToken = "";
                                        lastTokenTypeFound = "Symbol";
                                    }
                                    if (Symbols[regex] == Symbols['T_EOP']) {
                                        lextext += "Finished program " + programCount + "\n";
                                        lexErrorFound = false;
                                        programCount++;
                                        if (currentTokenIndex < tokens.length - 1)
                                            lextext += "Lexing program " + programCount + "...\n";
                                    }
                                }
                            }
                            if (!tokenFound) {
                                // Not symbol, check digit
                                if (T_DIGIT.test(currentChar)) {
                                    //If found keyword, print all last IDs
                                    if (lastTokenTypeFound == "ID") {
                                        var keywordFound = false;
                                        while (lastTokenIndex < currentTokenIndex) {
                                            // Check if the current list of ids contains a keyword
                                            var currentTokens = tokens.substring(lastTokenIndex, currentTokenIndex);
                                            for (var K_regex in Keywords) {
                                                if (Keywords[K_regex].test(currentTokens) && !lexErrorFound) {
                                                    lextext += "Found Token " + K_regex + " [ " + currentTokens + " ] " + " at index " + lastTokenIndex + "\n";
                                                    keywordFound = true;
                                                }
                                            }
                                            if (!lexErrorFound && !keywordFound) {
                                                lextext += "Found Token T_ID [ " + tokens.charAt(lastTokenIndex) + " ] " + " at index " + lastTokenIndex + "\n";
                                            }
                                            lastTokenIndex++;
                                        }
                                    }
                                    if (!lexErrorFound)
                                        lextext += "Found Token T_DIGIT [ " + currentChar + " ] " + " at index " + currentTokenIndex + "\n";
                                    lastTokenIndex = currentTokenIndex;
                                    tokenFound = true;
                                    currentToken = "";
                                    lastTokenTypeFound = "Digit";
                                }
                                else {
                                    // check for !=
                                    currentToken = currentChar + tokens.charAt(currentTokenIndex + 1);
                                    if (Symbols['T_NOT_EQUAL'].test(currentToken)) {
                                        if (!lexErrorFound)
                                            lextext += "Found Token T_NOT_EQUAL [ " + currentToken + " ] " + " at index " + currentTokenIndex + "\n";
                                        lastTokenIndex = currentTokenIndex;
                                        currentTokenIndex++;
                                        tokenFound = true;
                                        currentToken = "";
                                        lastTokenTypeFound = "Symbol";
                                    }
                                    else {
                                        //currentToken = lastToken;
                                        if (!lexErrorFound)
                                            lextext += "Invalid Token [ " + currentChar + " ] " + " at index " + currentTokenIndex + "\n";
                                        lexErrorFound = true;
                                        lexErrorCount++;
                                        errorText = "Compilation failed! " + lexErrorCount + " Lex errors found!";
                                        if (currentTokenIndex < tokens.length - 1) {
                                            morePrograms = true;
                                        }
                                        else {
                                            morePrograms = false;
                                        }
                                        lextext += "Compilation of program " + programCount + " stopped due to a Lexer error\n";
                                    }
                                }
                            }
                        }
                    }
                }
                return lextext;
            }
        };
        return Lexer;
    }());
    TSC.Lexer = Lexer;
})(TSC || (TSC = {}));
