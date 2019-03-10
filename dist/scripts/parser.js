/* parser.ts
Brandon Litwin
CMPT 432 - Compilers
Project 2
*/
var TSC;
(function (TSC) {
    var Parser = /** @class */ (function () {
        function Parser() {
        }
        Parser.parse = function () {
            errorText = "";
            this.parsetext = "Parsing program 1...\n";
            currentParseToken = validLexedTokens[currentParseTokenIndex];
            if (this.parseProgram() && errorText == "") {
                this.parsetext += "Parse completed with no errors!";
            }
            else {
                errorText += "Found " + this.parseErrorCount + " parse errors";
            }
            return this.parsetext;
        };
        Parser.parseProgram = function () {
            if (this.parseBlock(false)) {
                if (!this.matchToken("T_EOP", false)) {
                    return false;
                }
                else {
                    return true;
                }
            }
            else {
                return false;
            }
        };
        Parser.parseBlock = function (inStatementOrExpr) {
            console.log("block");
            if (!this.matchToken("T_L_BRACE", inStatementOrExpr)) {
                return false;
            }
            else {
                if (this.parseStatementList()) {
                    console.log("parsed that statement list");
                    if (this.matchToken("T_R_BRACE", inStatementOrExpr)) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }
        };
        Parser.parseStatementList = function () {
            console.log("statement list");
            if (this.parseStatement()) {
                console.log("parsed statement in statement list");
                if (this.parseStatementList())
                    return true;
            }
            else {
                // an empty statement is also valid
                if (!parseErrorFound) {
                    return true;
                }
                else {
                    return false;
                }
            }
        };
        Parser.parseStatement = function () {
            if (this.parsePrintStatement() || this.parseAssignmentStatement() || this.parseVarDecl() ||
                this.parseWhileStatement() || this.parseIfStatement() || this.parseBlock(true)) {
                return true;
            }
            else {
                return false;
            }
        };
        Parser.parsePrintStatement = function () {
            if (this.matchToken("T_PRINT", true))
                if (this.matchToken("T_L_PAREN", true))
                    if (this.parseExpr())
                        if (this.matchToken("T_R_PAREN", true))
                            return true;
            return false;
        };
        Parser.parseAssignmentStatement = function () {
            if (this.matchToken("T_ID", true))
                if (this.matchToken("T_ASSIGNMENT_OP", true))
                    if (this.parseExpr()) {
                        this.parsetext += "Parsed Assignment Statement at line " + (currentParseToken.lineNumber - 1) + " index " + currentParseToken.index + "\n";
                        return true;
                    }
            return false;
        };
        Parser.parseVarDecl = function () {
            // parse type
            if (this.matchToken("T_INT", true) || this.matchToken("T_BOOLEAN", true) || this.matchToken("T_STRING", true))
                console.log("looking for id in var dec");
            if (this.matchToken("T_ID", true))
                return true;
            return false;
        };
        Parser.parseWhileStatement = function () {
            if (this.matchToken("T_WHILE", true))
                if (this.parseBooleanExpr())
                    return this.parseBlock(true);
            return false;
        };
        Parser.parseIfStatement = function () {
            if (this.matchToken("T_IF", true))
                if (this.parseBooleanExpr())
                    return this.parseBlock(true);
            return false;
        };
        Parser.parseExpr = function () {
            if (this.parseIntExpr() || this.parseBooleanExpr() || this.parseStringExpr() || this.matchToken("T_ID", false)) {
                return true;
            }
            else {
                return false;
            }
        };
        Parser.parseBooleanExpr = function () {
            if (this.matchToken("T_L_PAREN", true)) {
                if (this.parseExpr())
                    if (this.matchToken("T_EQUALS", true) || this.matchToken("T_NOT_EQUAL", true))
                        if (this.parseExpr())
                            if (this.matchToken("T_R_PAREN", true)) {
                                this.parsetext += "Parsed Boolean Expression at line " + (currentParseToken.lineNumber) + " index " + currentParseToken.index + "\n";
                                return true;
                            }
                return false;
            }
            else {
                if (this.matchToken("T_TRUE", true) || this.matchToken("T_FALSE", true)) {
                    return true;
                }
                return false;
            }
        };
        Parser.parseIntExpr = function () {
            if (this.matchToken("T_DIGIT", true)) {
                if (this.matchToken("T_ADDITION_OP", true)) {
                    if (this.parseExpr())
                        return true;
                    else
                        return false;
                }
                else
                    // digit is still a valid expression
                    return true;
            }
            else
                return false;
        };
        Parser.parseStringExpr = function () {
            if (this.matchToken("T_QUOTE", true))
                if (this.parseCharList())
                    if (this.matchToken("T_QUOTE", true))
                        return true;
            return false;
        };
        Parser.parseCharList = function () {
            if (this.matchToken("T_Char", true)) {
                if (this.parseCharList())
                    return true;
            }
            else if (this.matchToken("T_SPACE", true)) {
                if (this.parseCharList()) {
                    return true;
                }
            }
            else
                // an empty char is also valid
                return true;
        };
        Parser.matchToken = function (token, inStatementOrExpr) {
            console.log("token to match is " + token + " and current token is " + currentParseToken.type);
            if (currentParseToken.type == token) {
                this.parsetext += "Expected " + token + " and found " + currentParseToken.type + " [" + currentParseToken.value + "] at line " + currentParseToken.lineNumber + " index " + currentParseToken.index + "\n";
                currentParseTokenIndex++;
                if (currentParseTokenIndex < validLexedTokens.length)
                    currentParseToken = validLexedTokens[currentParseTokenIndex];
                return true;
            }
            else {
                if (!parseErrorFound && !inStatementOrExpr) {
                    errorText = "Parse Error: Expected " + token + " and found " + currentParseToken.type + " at line " + currentParseToken.lineNumber + " index " + currentParseToken.index + "\n";
                    parseErrorFound = true;
                    this.parseErrorCount++;
                }
                return false;
            }
        };
        Parser.parseErrorCount = 0;
        return Parser;
    }());
    TSC.Parser = Parser;
})(TSC || (TSC = {}));
