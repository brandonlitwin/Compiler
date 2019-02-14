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
                    T_L_BRACE: new RegExp('{'),
                    T_R_BRACE: new RegExp('}'),
                    T_ID: new RegExp('[a-z]'),
                    T_ASSIGNMENT_OP: new RegExp('='),
                    T_EOP: new RegExp('\\$'),
                    T_SPACE: new RegExp('\\s'),
                    T_DIGIT: new RegExp('[0-9]'),
                    T_ADDITION_OP: new RegExp('\\+'),
                    T_L_PAREN: new RegExp('\\('),
                    T_R_PAREN: new RegExp('\\)'),
                    T_PRINT: new RegExp('print'),
                    T_WHILE: new RegExp('while'),
                    T_IF: new RegExp('if'),
                    T_INT: new RegExp('int'),
                    T_STRING: new RegExp('string'),
                    T_BOOLEAN: new RegExp('boolean'),
                    T_TRUE: new RegExp('true'),
                    T_FALSE: new RegExp('false'),
                    T_EQUALS: new RegExp('=='),
                    T_NOT_EQUAL: new RegExp('!='),
                    T_QUOTE: new RegExp('\\"'),
                    T_BEGIN_COMMENT: new RegExp('\\/\\*'),
                    T_END_COMMENT: new RegExp('\\*\\/')
                };
                var lextext = "Lexing program 1...\n";
                for (var i = 0; i < tokens.length; i++) {
                    var tokenFound = false;
                    for (var regex in allRegex) {
                        if (!lexErrorFound) {
                            var currentChar = tokens.charAt(i);
                            if (allRegex[regex].test(currentChar)) {
                                // Check for ==
                                if (currentChar.concat(tokens.charAt(i + 1)) == "==") {
                                    lextext += "Found Token T_EQUALS [ == ] at index " + i + "\n";
                                    i++;
                                }
                                else {
                                    lextext += "Found Token " + regex + " [ " + currentChar + " ] " + " at index " + i + "\n";
                                }
                                tokenFound = true;
                            }
                            else {
                                if (regex == "T_END_COMMENT" && tokenFound == false) {
                                    // Check for !=, because just ! is invalid
                                    if (currentChar.concat(tokens.charAt(i + 1)) == "!=") {
                                        lextext += "Found Token T_NOT_EQUAL [ != ] at index " + i + "\n";
                                        i++;
                                    }
                                    else {
                                        lextext += "Error: Found Invalid Token " + tokens.charAt(i) + " at index " + i + " \n";
                                        lexErrorFound = true;
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
