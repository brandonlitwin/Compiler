/* lexer.ts  */
var TSC;
(function (TSC) {
    var Lexer = /** @class */ (function () {
        function Lexer() {
        }
        Lexer.lex = function () {
            {
                // Creating all the RegEx for the grammar
                var allRegex = {
                    Keywords: Keywords,
                    Symbols: Symbols,
                    T_ID: T_ID,
                    T_DIGIT: T_DIGIT
                };
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
                    T_ASSIGNMENT_OP: new RegExp('='),
                    T_QUOTE: new RegExp('\\"'),
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
                for (var currentTokenIndex = 0; currentTokenIndex < tokens.length; currentTokenIndex++) {
                    var tokenFound = false;
                    var currentChar = tokens.charAt(currentTokenIndex);
                    currentToken = currentToken + currentChar;
                    // Check for keyword
                    for (var regex in Keywords) {
                        if (Keywords[regex].test(currentToken)) {
                            lextext += "Found Token " + regex + " [ " + currentToken + " ] " + " at index " + currentTokenIndex + "\n";
                            lastTokenIndex = currentTokenIndex;
                            tokenFound = true;
                            currentToken = "";
                            lastTokenTypeFound = "Keyword";
                        }
                    }
                    if (!tokenFound) {
                        // Not keyword, check for id
                        if (T_ID.test(currentToken)) {
                            lextext += "Found Token T_ID [ " + currentToken + " ] " + " at index " + currentTokenIndex + "\n";
                            lastTokenIndex = currentTokenIndex;
                            tokenFound = true;
                            currentToken = "";
                            lastTokenTypeFound = "ID";
                        }
                        else {
                            // Not id, check for symbol
                            for (var regex in Symbols) {
                                if (Symbols[regex].test(currentToken)) {
                                    lastTokenIndex = currentTokenIndex;
                                    // Check for == case
                                    if (Symbols[regex] == Symbols['T_ASSIGNMENT_OP']) {
                                        currentTokenIndex++;
                                        currentChar = tokens.charAt(currentTokenIndex);
                                        var lastToken = currentToken;
                                        currentToken = currentToken + currentChar;
                                        if (Symbols['T_EQUALS'].test(currentToken)) {
                                            lextext += "Found Token T_EQUALS [ " + currentToken + " ] " + " at index " + lastTokenIndex + "\n";
                                            lastTokenIndex = currentTokenIndex;
                                            tokenFound = true;
                                            currentToken = "";
                                            lastTokenTypeFound = "Symbol";
                                        }
                                        else {
                                            currentTokenIndex = lastTokenIndex;
                                            currentToken = lastToken;
                                        }
                                    }
                                    if (!tokenFound) {
                                        lextext += "Found Token " + regex + " [ " + currentToken + " ] " + " at index " + currentTokenIndex + "\n";
                                        lastTokenIndex = currentTokenIndex;
                                        tokenFound = true;
                                        currentToken = "";
                                        lastTokenTypeFound = "Symbol";
                                    }
                                }
                            }
                            if (!tokenFound) {
                                // Not symbol, check digit
                                if (T_DIGIT.test(currentToken)) {
                                    lextext += "Found Token T_DIGIT [ " + currentToken + " ] " + " at index " + currentTokenIndex + "\n";
                                    lastTokenIndex = currentTokenIndex;
                                    tokenFound = true;
                                    currentToken = "";
                                    lastTokenTypeFound = "Digit";
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
