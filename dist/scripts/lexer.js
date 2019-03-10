/* lexer.ts
Brandon Litwin
CMPT 432 - Compilers
Project 1
*/
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
                    T_MULTILINE_SPACE: new RegExp('\\n'),
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
                var lextext = "Lexing program 1...\n";
                for (currentTokenIndex; currentTokenIndex < tokens.length; currentTokenIndex++) {
                    var tokenFound = false;
                    var currentChar = tokens.charAt(currentTokenIndex);
                    // Warning if EOP not found at last token
                    if ((currentTokenIndex == tokens.length - 1) && currentChar != '$') {
                        tokens += "$";
                        warningText += "Warning: No EOP Token [$] Found in program " + programCount + ". Added to the end of program.\n";
                    }
                    currentToken = currentToken + currentChar;
                    currentToken = currentToken.trim();
                    // First, check for quote because a string of chars must be treated differently
                    if (Symbols['T_QUOTE'].test(currentChar) && !inString && !lexErrorFound) {
                        inString = true;
                        startStringIndex = currentTokenIndex - lastEndLineIndex;
                        lextext += "Found Token T_QUOTE [ " + currentChar + " ] " + " at line " + lineNumber + " index " + startStringIndex + "\n";
                        var token = new TSC.Token("T_QUOTE", currentToken, lineNumber, (currentTokenIndex - lastEndLineIndex));
                        validLexedTokens.push(token);
                        currentTokenIndex++;
                        currentChar = tokens.charAt(currentTokenIndex);
                        // Check for unterminated string
                        while (!Symbols['T_QUOTE'].test(currentChar) && currentTokenIndex < tokens.length) {
                            currentChar = tokens.charAt(currentTokenIndex);
                            currentTokenIndex++;
                        }
                        // In case there is no EOP token
                        if (!Symbols['T_QUOTE'].test(currentChar)) {
                            lexErrorCount++;
                            lexErrorFound = true;
                            if (verboseOn) {
                                lextext += "Error: Unterminated String beginning on line " + lineNumber + " index " + startStringIndex + "\n";
                                lextext += "Compilation of program " + programCount + " stopped due to a Lexer error\n";
                                errorText = "Compilation failed! " + lexErrorCount + " Lex errors found!\n";
                            }
                            else {
                                errorText += "Error: Unterminated String beginning on line " + lineNumber + " index " + startStringIndex + "\n";
                                errorText += "Compilation of program " + programCount + " stopped due to a Lexer error\n";
                                errorText += "Compilation failed! " + lexErrorCount + " Lex errors found!\n";
                            }
                        }
                        else {
                            // Found an end quote so there is no error
                            currentTokenIndex = startStringIndex + lastEndLineIndex + 1;
                            //currentToken = "";
                            currentChar = tokens.charAt(currentTokenIndex);
                            currentToken = currentChar;
                            //inString = false;
                        }
                    }
                    else if ((Symbols['T_QUOTE'].test(currentToken) && inString)) {
                        inString = false;
                    }
                    // Check for keyword
                    for (var regex in Keywords) {
                        if (Keywords[regex].test(currentToken) && !inString) {
                            // Separate the keyword from the rest of the token being reviewed
                            var keywordStart = currentToken.search(Keywords[regex]) + lastTokenIndex;
                            var keywordStartFromCurrent = keywordStart - lastTokenIndex;
                            // If found keyword, print all last IDs
                            if (lastTokenTypeFound == "ID") {
                                while (lastTokenIndex < keywordStart) {
                                    if (!lexErrorFound)
                                        lextext += "Found Token T_ID [ " + tokens.charAt(lastTokenIndex) + " ] " + " at line " + lineNumber + " index " + (lastTokenIndex - lastEndLineIndex) + "\n";
                                    var token = new TSC.Token("T_ID", currentToken, lineNumber, (lastTokenIndex - lastEndLineIndex));
                                    validLexedTokens.push(token);
                                    lastTokenIndex++;
                                }
                                currentToken = currentToken.substring(keywordStartFromCurrent);
                            }
                            if (!lexErrorFound) {
                                lextext += "Found Token " + regex + " [ " + currentToken + " ] " + " at line " + lineNumber + " index " + (keywordStart - lastEndLineIndex) + "\n";
                                var token = new TSC.Token(regex, currentToken, lineNumber, (keywordStart - lastEndLineIndex));
                                validLexedTokens.push(token);
                            }
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
                            if (inString) {
                                lastTokenTypeFound = "Char";
                                if (!lexErrorFound)
                                    lextext += "Found Token T_Char [ " + currentChar + " ] " + " at line " + lineNumber + " index " + (currentTokenIndex - lastEndLineIndex) + "\n";
                                var token = new TSC.Token("T_Char", currentChar, lineNumber, (currentTokenIndex - lastEndLineIndex));
                                validLexedTokens.push(token);
                            }
                            else
                                lastTokenTypeFound = "ID";
                        }
                        else {
                            // If in string and not an ID, space, quote, or comment, found an invalid char
                            currentToken = currentChar + tokens.charAt(currentTokenIndex + 1);
                            if (inString && !Symbols['T_SPACE'].test(currentChar) && !Symbols['T_QUOTE'].test(currentChar)
                                && !lexErrorFound && !Symbols['T_BEGIN_COMMENT'].test(currentToken) && !Symbols['T_END_COMMENT'].test(currentToken)) {
                                lexErrorCount++;
                                lexErrorFound = true;
                                if (verboseOn) {
                                    lextext += "Found Invalid Character in String [ " + currentChar + " ] " + " at line " + lineNumber + " index " + (currentTokenIndex - lastEndLineIndex) + "\n";
                                    lextext += "Compilation of program " + programCount + " stopped due to a Lexer error\n";
                                    errorText = "Compilation failed! " + lexErrorCount + " Lex errors found!\n";
                                }
                                else {
                                    errorText += "Found Invalid Character in String [ " + currentChar + " ] " + " at line " + lineNumber + " index " + (currentTokenIndex - lastEndLineIndex) + "\n";
                                    errorText += "Compilation of program " + programCount + " stopped due to a Lexer error\n";
                                    errorText += "Compilation failed! " + lexErrorCount + " Lex errors found!\n";
                                }
                            }
                            // Not id, check for symbol
                            for (var regex in Symbols) {
                                if (Symbols[regex].test(currentChar)) {
                                    // If found symbol, print all last IDs
                                    if (lastTokenTypeFound == "ID") {
                                        var keywordFound = false;
                                        while (lastTokenIndex < currentTokenIndex) {
                                            // Check if the current list of IDs contains a keyword
                                            var currentTokens = tokens.substring(lastTokenIndex, currentTokenIndex);
                                            for (var K_regex in Keywords) {
                                                if (Keywords[K_regex].test(currentTokens) && !lexErrorFound) {
                                                    lextext += "Found Token " + K_regex + " [ " + currentTokens + " ] " + " at line " + lineNumber + " index " + (lastTokenIndex - lastEndLineIndex) + "\n";
                                                    var token = new TSC.Token(K_regex, currentTokens, lineNumber, (lastTokenIndex - lastEndLineIndex));
                                                    validLexedTokens.push(token);
                                                    keywordFound = true;
                                                }
                                            }
                                            if (!lexErrorFound && !keywordFound) {
                                                lextext += "Found Token T_ID [ " + tokens.charAt(lastTokenIndex) + " ] " + " at line " + lineNumber + " index " + (lastTokenIndex - lastEndLineIndex) + "\n";
                                                var token = new TSC.Token("T_ID", tokens.charAt(lastTokenIndex), lineNumber, (lastTokenIndex - lastEndLineIndex));
                                                validLexedTokens.push(token);
                                            }
                                            lastTokenIndex++;
                                        }
                                    }
                                    // Check for == case
                                    if (Symbols[regex] == Symbols['T_ASSIGNMENT_OP']) {
                                        lastTokenIndex = currentTokenIndex;
                                        currentTokenIndex++;
                                        currentToken = currentChar + tokens.charAt(currentTokenIndex);
                                        if (Symbols['T_EQUALS'].test(currentToken)) {
                                            if (!lexErrorFound) {
                                                lextext += "Found Token T_EQUALS [ " + currentToken + " ] " + " at line " + lineNumber + " index " + (lastTokenIndex - lastEndLineIndex) + "\n";
                                                var token = new TSC.Token("T_EQUALS", currentToken, lineNumber, (lastTokenIndex - lastEndLineIndex));
                                                validLexedTokens.push(token);
                                            }
                                            lastTokenIndex = currentTokenIndex;
                                            tokenFound = true;
                                            currentToken = "";
                                            lastTokenTypeFound = "Symbol";
                                        }
                                        else {
                                            currentTokenIndex = lastTokenIndex;
                                        }
                                    }
                                    // Now print the symbol
                                    if (!tokenFound) {
                                        // Symbols inside strings are invalid, except spaces and quotes
                                        if (Symbols['T_QUOTE'].test(currentChar) && inString) {
                                            inString = false;
                                            lastTokenIndex = currentTokenIndex;
                                            tokenFound = true;
                                            currentToken = "";
                                            lastTokenTypeFound = "Symbol";
                                            if (!lexErrorFound) {
                                                lextext += "Found Token " + regex + " [ " + currentChar + " ] " + " at line " + lineNumber + " index " + (currentTokenIndex - lastEndLineIndex) + "\n";
                                                var token = new TSC.Token(regex, currentChar, lineNumber, (currentTokenIndex - lastEndLineIndex));
                                                validLexedTokens.push(token);
                                            }
                                        }
                                        else if (Symbols['T_MULTILINE_SPACE'].test(currentChar) && !lexErrorFound) {
                                            // Found multiline space inside string, which isn't allowed.
                                            if (inString) {
                                                lexErrorCount++;
                                                lexErrorFound = true;
                                                if (verboseOn) {
                                                    lextext += "Found Multiline Space in String at line " + lineNumber + " index " + (currentTokenIndex - lastEndLineIndex) + "\n";
                                                    lextext += "Compilation of program " + programCount + " stopped due to a Lexer error\n";
                                                    errorText = "Compilation failed! " + lexErrorCount + " Lex errors found!\n";
                                                }
                                                else {
                                                    errorText += "Found Multiline Space in String at line " + lineNumber + " index " + (currentTokenIndex - lastEndLineIndex) + "\n";
                                                    errorText += "Compilation of program " + programCount + " stopped due to a Lexer error\n";
                                                    errorText += "Compilation failed! " + lexErrorCount + " Lex errors found!\n";
                                                }
                                            }
                                            else {
                                                // If it's a multiline space outside a string, increase line number
                                                lastTokenIndex = currentTokenIndex;
                                                tokenFound = true;
                                                currentToken = "";
                                                lastTokenTypeFound = "Symbol";
                                                lineNumber++;
                                                lastEndLineIndex = currentTokenIndex + 1;
                                            }
                                        }
                                        else {
                                            // If none of the above, must be valid symbol outside string
                                            if (!Symbols['T_SPACE'].test(currentChar) && !inString && !lexErrorFound)
                                                lextext += "Found Token " + regex + " [ " + currentChar + " ] " + " at line " + lineNumber + " index " + (currentTokenIndex - lastEndLineIndex) + "\n";
                                            else if (inString && !lexErrorFound) {
                                                lextext += "Found Token " + regex + " [ " + currentChar + " ] " + " at line " + lineNumber + " index " + (currentTokenIndex - lastEndLineIndex) + "\n";
                                            }
                                            if (!Symbols['T_SPACE'].test(currentChar)) {
                                                var token = new TSC.Token(regex, currentChar, lineNumber, (currentTokenIndex - lastEndLineIndex));
                                                validLexedTokens.push(token);
                                            }
                                            lastTokenIndex = currentTokenIndex;
                                            tokenFound = true;
                                            currentToken = "";
                                            lastTokenTypeFound = "Symbol";
                                        }
                                    }
                                    // If EOP is found, assume program is finished
                                    if (Symbols[regex] == Symbols['T_EOP'] && !inString) {
                                        if (!lexErrorFound)
                                            lextext += "Finished lexing program " + programCount + "\n";
                                        lexErrorFound = false;
                                        inString = false;
                                        if (!EOPFound)
                                            programCount++;
                                        if (currentTokenIndex < tokens.length - 1) {
                                            lextext += "Lexing program " + programCount + "...\n";
                                        }
                                    }
                                }
                            }
                            if (!tokenFound) {
                                // Not a symbol, check if it's a digit
                                if (T_DIGIT.test(currentChar)) {
                                    //If found keyword, print all last IDs
                                    if (lastTokenTypeFound == "ID") {
                                        var keywordFound = false;
                                        while (lastTokenIndex < currentTokenIndex) {
                                            // Check if the current list of ids contains a keyword
                                            var currentTokens = tokens.substring(lastTokenIndex, currentTokenIndex);
                                            for (var K_regex in Keywords) {
                                                if (Keywords[K_regex].test(currentTokens) && !lexErrorFound) {
                                                    lextext += "Found Token " + K_regex + " [ " + currentTokens + " ] " + " line " + lineNumber + " index " + (lastTokenIndex - lastEndLineIndex) + "\n";
                                                    keywordFound = true;
                                                    var token = new TSC.Token(K_regex, currentTokens, lineNumber, (lastTokenIndex - lastEndLineIndex));
                                                    validLexedTokens.push(token);
                                                }
                                            }
                                            if (!lexErrorFound && !keywordFound) {
                                                lextext += "Found Token T_ID [ " + tokens.charAt(lastTokenIndex) + " ] " + " at line " + lineNumber + " index " + (lastTokenIndex - lastEndLineIndex) + "\n";
                                                var token = new TSC.Token("T_ID", tokens.charAt(lastTokenIndex), lineNumber, (lastTokenIndex - lastEndLineIndex));
                                                validLexedTokens.push(token);
                                            }
                                            lastTokenIndex++;
                                        }
                                    }
                                    // Now print the digit
                                    if (!lexErrorFound) {
                                        lextext += "Found Token T_DIGIT [ " + currentChar + " ] " + " at line " + lineNumber + " index " + (currentTokenIndex - lastEndLineIndex) + "\n";
                                        var token = new TSC.Token("T_DIGIT", currentChar, lineNumber, (currentTokenIndex - lastEndLineIndex));
                                        validLexedTokens.push(token);
                                    }
                                    lastTokenIndex = currentTokenIndex;
                                    tokenFound = true;
                                    currentToken = "";
                                    lastTokenTypeFound = "Digit";
                                }
                                else {
                                    // check for !=
                                    currentToken = currentChar + tokens.charAt(currentTokenIndex + 1);
                                    if (Symbols['T_NOT_EQUAL'].test(currentToken)) {
                                        if (!lexErrorFound) {
                                            lextext += "Found Token T_NOT_EQUAL [ " + currentToken + " ] " + " at line " + lineNumber + " index " + (currentTokenIndex - lastEndLineIndex) + "\n";
                                            var token = new TSC.Token("T_NOT_EQUAL", currentToken, lineNumber, (currentTokenIndex - lastEndLineIndex));
                                            validLexedTokens.push(token);
                                        }
                                        lastTokenIndex = currentTokenIndex;
                                        currentTokenIndex++;
                                        tokenFound = true;
                                        currentToken = "";
                                        lastTokenTypeFound = "Symbol";
                                    }
                                    else {
                                        // Check for comments
                                        currentToken = currentChar + tokens.charAt(currentTokenIndex + 1);
                                        if (Symbols['T_BEGIN_COMMENT'].test(currentToken)) {
                                            // If you find the start comment token, keep looking for the end comment token
                                            var startCommentIndex = currentTokenIndex - lastEndLineIndex;
                                            while (!Symbols['T_END_COMMENT'].test(currentToken) && currentTokenIndex < tokens.length - 1 && !EOPFound) {
                                                currentChar = tokens.charAt(currentTokenIndex);
                                                currentToken = currentChar + tokens.charAt(currentTokenIndex + 1);
                                                if (Symbols['T_EOP'].test(currentToken)) {
                                                    lexErrorCount++;
                                                    lexErrorFound = true;
                                                    EOPFound = true;
                                                    if (verboseOn) {
                                                        lextext += "Error: Missing End Comment [*/] for Comment beginning on line " + lineNumber + " index " + startCommentIndex + "\n";
                                                        lextext += "Compilation of program " + programCount + " stopped due to a Lexer error\n";
                                                        errorText = "Compilation failed! " + lexErrorCount + " Lex errors found!\n";
                                                    }
                                                    else {
                                                        errorText += "Error: Missing End Comment [*/] for Comment beginning on line " + lineNumber + " index " + startCommentIndex + "\n";
                                                        errorText += "Compilation of program " + programCount + " stopped due to a Lexer error\n";
                                                        errorText += "Compilation failed! " + lexErrorCount + " Lex errors found!\n";
                                                    }
                                                }
                                                else
                                                    currentTokenIndex++;
                                            }
                                            // In case there is no EOP token
                                            if (currentTokenIndex == tokens.length - 1) {
                                                lexErrorCount++;
                                                lexErrorFound = true;
                                                if (verboseOn) {
                                                    lextext += "Error: Missing End Comment [*/] for Comment beginning on line " + lineNumber + " index" + startCommentIndex + "\n";
                                                    lextext += "Compilation of program " + programCount + " stopped due to a Lexer error\n";
                                                    errorText = "Compilation failed! " + lexErrorCount + " Lex errors found!\n";
                                                }
                                                else {
                                                    errorText += "Error: Missing End Comment [*/] for Comment beginning on line " + lineNumber + " index" + startCommentIndex + "\n";
                                                    errorText += "Compilation of program " + programCount + " stopped due to a Lexer error\n";
                                                    errorText += "Compilation failed! " + lexErrorCount + " Lex errors found!\n";
                                                }
                                            }
                                        }
                                        currentToken = currentChar + tokens.charAt(currentTokenIndex);
                                        if (Symbols['T_END_COMMENT'].test(currentToken)) {
                                            currentToken = "";
                                        }
                                        else {
                                            // No other errors and no valid tokens found yet. This must be an invalid token.
                                            if (!lexErrorFound) {
                                                lexErrorFound = true;
                                                lexErrorCount++;
                                                if (verboseOn) {
                                                    lextext += "Invalid Token [ " + currentChar + " ] " + " at line " + lineNumber + " index " + (currentTokenIndex - lastEndLineIndex) + "\n";
                                                    lextext += "Compilation of program " + programCount + " stopped due to a Lexer error\n";
                                                    errorText = "Compilation failed! " + lexErrorCount + " Lex errors found!\n";
                                                }
                                                else {
                                                    errorText += "Invalid Token [ " + currentChar + " ] " + " at line " + lineNumber + " index " + (currentTokenIndex - lastEndLineIndex) + "\n";
                                                    errorText += "Compilation of program " + programCount + " stopped due to a Lexer error\n";
                                                    errorText += "Compilation failed! " + lexErrorCount + " Lex errors found!\n";
                                                }
                                            }
                                        }
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
