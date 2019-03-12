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
        //static parsedAProgram: boolean = false;
        Parser.parse = function (tokenIndex, treantCST) {
            this.currentParseTokenIndex = tokenIndex;
            errorText = "";
            this.parsetext = "Parsing program " + programCount + "...\n";
            currentParseToken = validLexedTokens[this.currentParseTokenIndex];
            console.log(validLexedTokens);
            console.log(currentParseToken);
            if (this.parseProgram() && errorText == "") {
                //this.parsedAProgram = true;
                this.parsetext += "Parse of program " + programCount + " completed with no errors!\n";
            }
            else {
                errorText = "Found " + this.parseErrorCount + " parse errors";
            }
            return [this.parsetext, this.currentParseTokenIndex, this.cst];
        };
        Parser.parseProgram = function () {
            this.cst = new TSC.Tree();
            this.cst.addNode("Program" + programCount);
            if (this.parseBlock(false)) {
                if (!this.matchToken("T_EOP", false)) {
                    return false;
                }
                else {
                    this.cst.moveUp();
                    return true;
                }
            }
            else {
                return false;
            }
        };
        Parser.parseBlock = function (inStatementOrExpr) {
            this.cst.addNode("Block");
            if (!this.matchToken("T_L_BRACE", inStatementOrExpr)) {
                return false;
            }
            else {
                if (this.parseStatementList()) {
                    if (this.matchToken("T_R_BRACE", inStatementOrExpr)) {
                        this.cst.moveUp();
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
            this.cst.addNode("StatementList");
            if (this.parseStatement()) {
                if (this.parseStatementList()) {
                    this.cst.moveUp();
                    return true;
                }
            }
            else {
                // an empty statement is also valid
                if (!parseErrorFound) {
                    this.cst.moveUp();
                    return true;
                }
                else {
                    return false;
                }
            }
        };
        Parser.parseStatement = function () {
            this.cst.addNode("Statement");
            if (this.parsePrintStatement() || this.parseAssignmentStatement() || this.parseVarDecl() ||
                this.parseWhileStatement() || this.parseIfStatement() || this.parseBlock(true)) {
                this.cst.moveUp();
                return true;
            }
            else {
                return false;
            }
        };
        Parser.parsePrintStatement = function () {
            this.cst.addNode("PrintStatement");
            if (this.matchToken("T_PRINT", true))
                if (this.matchToken("T_L_PAREN", true))
                    if (this.parseExpr())
                        if (this.matchToken("T_R_PAREN", true)) {
                            this.cst.moveUp();
                            return true;
                        }
            return false;
        };
        Parser.parseAssignmentStatement = function () {
            this.cst.addNode("AssignmentStatement");
            if (this.matchToken("T_ID", true))
                if (this.matchToken("T_ASSIGNMENT_OP", true))
                    if (this.parseExpr()) {
                        this.parsetext += "Parsed Assignment Statement at line " + (currentParseToken.lineNumber - 1) + " index " + currentParseToken.index + "\n";
                        this.cst.moveUp();
                        return true;
                    }
            return false;
        };
        Parser.parseVarDecl = function () {
            //this.cst.addNode("VarDecl");
            // parse type
            if (this.matchToken("T_INT", true) || this.matchToken("T_BOOLEAN", true) || this.matchToken("T_STRING", true))
                if (this.matchToken("T_ID", true)) {
                    this.cst.moveUp();
                    return true;
                }
            return false;
        };
        Parser.parseWhileStatement = function () {
            //this.cst.addNode("WhileStatement");
            if (this.matchToken("T_WHILE", true))
                if (this.parseBooleanExpr()) {
                    if (this.parseBlock(true)) {
                        this.cst.moveUp();
                        return true;
                    }
                }
            return false;
        };
        Parser.parseIfStatement = function () {
            //this.cst.addNode("IfStatement");
            if (this.matchToken("T_IF", true))
                if (this.parseBooleanExpr())
                    if (this.parseBlock(true)) {
                        this.cst.moveUp();
                        return true;
                    }
            return false;
        };
        Parser.parseExpr = function () {
            this.cst.addNode("Expression");
            if (this.parseIntExpr() || this.parseBooleanExpr() || this.parseStringExpr() || this.matchToken("T_ID", false)) {
                this.cst.moveUp();
                return true;
            }
            else {
                return false;
            }
        };
        Parser.parseBooleanExpr = function () {
            //this.cst.addNode("BooleanExpression");
            if (this.matchToken("T_L_PAREN", true)) {
                if (this.parseExpr())
                    if (this.matchToken("T_EQUALS", true) || this.matchToken("T_NOT_EQUAL", true))
                        if (this.parseExpr())
                            if (this.matchToken("T_R_PAREN", true)) {
                                this.parsetext += "Parsed Boolean Expression at line " + (currentParseToken.lineNumber) + " index " + currentParseToken.index + "\n";
                                this.cst.moveUp();
                                return true;
                            }
                return false;
            }
            else {
                if (this.matchToken("T_TRUE", true) || this.matchToken("T_FALSE", true)) {
                    this.cst.moveUp();
                    return true;
                }
                return false;
            }
        };
        Parser.parseIntExpr = function () {
            //this.cst.addNode("IntExpression");
            if (this.matchToken("T_DIGIT", true)) {
                if (this.matchToken("T_ADDITION_OP", true)) {
                    if (this.parseExpr()) {
                        this.cst.moveUp();
                        return true;
                    }
                    else
                        return false;
                }
                else {
                    // digit is still a valid expression
                    this.cst.moveUp();
                    return true;
                }
            }
            else
                return false;
        };
        Parser.parseStringExpr = function () {
            this.cst.addNode("StringExpression");
            if (this.matchToken("T_QUOTE", true))
                if (this.parseCharList())
                    if (this.matchToken("T_QUOTE", true)) {
                        this.cst.moveUp();
                        return true;
                    }
            return false;
        };
        Parser.parseCharList = function () {
            this.cst.addNode("CharList");
            if (this.matchToken("T_Char", true)) {
                if (this.parseCharList()) {
                    this.cst.moveUp();
                    return true;
                }
            }
            else if (this.matchToken("T_SPACE", true)) {
                if (this.parseCharList()) {
                    this.cst.moveUp();
                    return true;
                }
            }
            else
                // an empty char is also valid
                return true;
        };
        Parser.matchToken = function (token, inStatementOrExpr) {
            //console.log("token to match is " + token + " and current token is " + currentParseToken.type);
            if (token == "T_Char")
                this.cst.addNode("Char");
            if (currentParseToken.type == token) {
                this.parsetext += "Expected " + token + " and found " + currentParseToken.type + " [" + currentParseToken.value + "] at line " + currentParseToken.lineNumber + " index " + currentParseToken.index + "\n";
                this.cst.addNode(currentParseToken);
                this.currentParseTokenIndex++;
                if (this.currentParseTokenIndex < validLexedTokens.length)
                    currentParseToken = validLexedTokens[this.currentParseTokenIndex];
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
        Parser.currentParseTokenIndex = 0;
        Parser.cst = new TSC.Tree();
        return Parser;
    }());
    TSC.Parser = Parser;
})(TSC || (TSC = {}));
