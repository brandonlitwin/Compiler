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
            for (var i = 0; i < validLexedTokens.length; i++) {
                this.parsetext += validLexedTokens[i].type + " " + typeof validLexedTokens[i] + "\n";
            }
            currentParseToken = validLexedTokens[currentParseTokenIndex];
            if (this.parseProgram() && errorText == "") {
                this.parsetext += "Parse completed with no errors!";
            }
            else {
                if (!morePrograms) {
                    this.parsetext += "Found " + this.parseErrorCount + " parse errors";
                }
            }
            return this.parsetext;
        };
        Parser.parseProgram = function () {
            this.parseBlock();
            if (!this.matchToken("T_EOP")) {
                errorText = "Parse Error: No End of Program ($) found";
                return false;
            }
            else {
                this.parsetext += "Found End of Program at line " + currentParseToken.line + " index " + currentParseToken.index;
                return true;
            }
        };
        Parser.parseBlock = function () {
            if (!this.matchToken("T_L_BRACE")) {
                errorText = "Parse Error: Expected { at beginning of program block (line " + currentParseToken.line + " index " + currentParseToken.index;
            }
            else {
                this.parsetext += "Parsed Token " + validLexedTokens[currentParseTokenIndex] + " at line " + currentParseToken.line + " index " + currentParseToken.index;
            }
            this.parseStatementList();
            if (!this.matchToken("T_R_BRACE")) {
                errorText = "Parse Error: Expected } at end of program block";
            }
        };
        Parser.parseStatementList = function () {
            if (this.parseStatement()) {
                return true;
            }
            else {
                // an empty statement is also valid
                this.parsetext += "Parsed empty statement at line " + currentParseTokenIndex;
                return true;
            }
        };
        Parser.parseStatement = function () {
            if (this.parsePrintStatement() || this.parseAssignmentStatement() || this.parseVarDecl() ||
                this.parseWhileStatement() || this.parseIfStatement() || this.parseBlock()) {
                return true;
            }
            else {
                return false;
            }
        };
        Parser.matchToken = function (token) {
            if (currentParseToken.type == token) {
                currentParseTokenIndex++;
                return true;
            }
            else {
                return false;
            }
        };
        Parser.parseErrorCount = 0;
        return Parser;
    }());
    TSC.Parser = Parser;
})(TSC || (TSC = {}));
