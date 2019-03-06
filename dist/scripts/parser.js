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
            if (this.parseBlock()) {
                if (!this.matchToken("T_EOP")) {
                    errorText = "Parse Error: No End of Program ($) found";
                    parseErrorFound = true;
                    return false;
                }
                else {
                    this.parsetext += "Found End of Program at line " + currentParseToken.line + " index " + currentParseToken.index;
                    return true;
                }
            }
            else {
                return false;
            }
        };
        Parser.parseBlock = function () {
            if (!this.matchToken("T_L_BRACE")) {
                errorText = "Parse Error: Expected { at beginning of program block and found " + currentParseToken.value + "  at line " + currentParseToken.line + " index " + currentParseToken.index;
                parseErrorFound = true;
                return false;
            }
            else {
                this.parsetext += "Parsed Token " + currentParseToken.value + " at line " + currentParseToken.line + " index " + currentParseToken.index;
                if (this.parseStatementList()) {
                    this.parsetext += "Parsed valid statement list at line " + currentParseToken.line + " index " + currentParseToken.index;
                    if (this.matchToken("T_R_BRACE")) {
                        this.parsetext += "Parse Token " + currentParseToken.value + " at line " + currentParseToken.line + " index " + currentParseToken.index;
                        return true;
                    }
                    else {
                        errorText = "Parse Error: Expected } at end of program block and found " + currentParseToken.value + " at line " + currentParseToken.line + " index " + currentParseToken.index;
                        parseErrorFound = true;
                        return false;
                    }
                }
                else {
                    errorText = "Parse Error: Expected statement list and found " + currentParseToken.value + " at line " + currentParseToken.line + " index " + currentParseToken.index;
                    parseErrorFound = true;
                    return false;
                }
            }
        };
        Parser.parseStatementList = function () {
            if (this.parseStatement()) {
                this.parsetext += "Parsed valid statement " + currentParseToken.value + " at line " + currentParseToken.line + " index " + currentParseToken.index;
                if (this.parseStatementList())
                    return true;
            }
            else {
                // an empty statement is also valid
                if (!parseErrorFound) {
                    this.parsetext += "Parsed empty statement at line " + currentParseToken.line + " index " + currentParseToken.index;
                    return true;
                }
                else {
                    return false;
                }
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
        Parser.parsePrintStatement = function () {
            if (this.matchToken("T_PRINT")) {
                this.parsetext += "Parsed Print keyword at line " + currentParseToken.line + " index " + currentParseToken.index;
                if (this.matchToken("T_L_PAREN")) {
                    this.parsetext += "Parsed " + currentParseToken.value + " at line " + currentParseToken.line + " index " + currentParseToken.index;
                    if (this.parseExpr()) {
                        this.parsetext += "Parsed valid expression at line " + currentParseToken.line + " index " + currentParseToken.index;
                        if (this.matchToken("T_R_PAREN")) {
                            this.parsetext += "Parsed " + currentParseToken.value + " at line " + currentParseToken.line + " index " + currentParseToken.index;
                            return true;
                        }
                        else {
                            errorText = "Parse Error: Expected ) and found " + currentParseToken.value + " at line " + currentParseToken.line + " index " + currentParseToken.index;
                            parseErrorFound = true;
                            return false;
                        }
                    }
                    else {
                        errorText = "Parse Error: Expected expression and found " + currentParseToken.value + " at line " + currentParseToken.line + " index " + currentParseToken.index;
                        parseErrorFound = true;
                        return false;
                    }
                }
                else {
                    errorText = "Parse Error: Expected ( and found " + currentParseToken.value + " at line " + currentParseToken.line + " index " + currentParseToken.index;
                    parseErrorFound = true;
                    return false;
                }
            }
            else {
                return false;
            }
        };
        Parser.parseAssignmentStatement = function () {
            if (this.matchToken("T_ID")) {
                this.parsetext += "Parsed ID at line " + currentParseToken.line + " index " + currentParseToken.index;
                if (this.matchToken("T_ASSIGNMENT_OP")) {
                    this.parsetext += "Parsed Assignment Operator " + currentParseToken.value + " at line " + currentParseToken.line + " index " + currentParseToken.index;
                    if (this.parseExpr()) {
                        this.parsetext += "Parsed valid expression at line " + currentParseToken.line + " index " + currentParseToken.index;
                    }
                    else {
                        errorText = "Parse Error: Expected expression and found " + currentParseToken.value + " at line " + currentParseToken.line + " index " + currentParseToken.index;
                        parseErrorFound = true;
                        return false;
                    }
                }
                else {
                    errorText = "Parse Error: Expected Assignment Operator = and found " + currentParseToken.value + " at line " + currentParseToken.line + " index " + currentParseToken.index;
                    parseErrorFound = true;
                    return false;
                }
            }
            else {
                return false;
            }
        };
        Parser.parseVarDecl = function () {
            // parse type
            if (this.matchToken("T_INT") || this.matchToken("T_BOOLEAN") || this.matchToken("T_STRING")) {
                this.parsetext += "Parsed valid type declaration " + currentParseToken.value + " at line " + currentParseToken.line + " index " + currentParseToken.index;
                if (this.matchToken("T_ID")) {
                    this.parsetext += "Parsed variable declaration ID " + currentParseToken.value + " at line " + currentParseToken.line + " index " + currentParseToken.index;
                    return true;
                }
                else {
                    errorText = "Parse Error: Expected ID following type declaration and found " + currentParseToken.value + " at line " + currentParseToken.line + " index " + currentParseToken.index;
                    parseErrorFound = true;
                    return false;
                }
            }
            else {
                return false;
            }
        };
        Parser.parseWhileStatement = function () {
            if (this.matchToken("T_WHILE")) {
                this.parsetext += "Parsed while keyword at line " + currentParseToken.line + " index " + currentParseToken.index;
                if (this.parseBooleanExpr()) {
                    this.parsetext += "Parsed valid boolean expression " + currentParseToken.value + " at line " + currentParseToken.line + " index " + currentParseToken.index;
                    return this.parseBlock();
                }
                else {
                    errorText = "Parse Error: Expected boolean expression and found " + currentParseToken.value + " at line " + currentParseToken.line + " index " + currentParseToken.index;
                    return false;
                }
            }
            else {
                return false;
            }
        };
        Parser.parseIfStatement = function () {
            if (this.matchToken("T_IF")) {
                this.parsetext += "Parsed if keyword at line " + currentParseToken.line + " index " + currentParseToken.index;
                if (this.parseBooleanExpr()) {
                    this.parsetext += "Parsed valid boolean expression " + currentParseToken.value + " at line " + currentParseToken.line + " index " + currentParseToken.index;
                    return this.parseBlock();
                }
                else {
                    errorText = "Parse Error: Expected boolean expression and found " + currentParseToken.value + " at line " + currentParseToken.line + " index " + currentParseToken.index;
                    return false;
                }
            }
            else {
                return false;
            }
        };
        Parser.parseExpr = function () {
            if (this.parseIntExpr() || this.parseBooleanExpr() || this.parseStringExpr() || this.matchToken("T_ID")) {
                this.parsetext += "Parsed valid expression " + currentParseToken.value + " at line " + currentParseToken.line + " index " + currentParseToken.index;
                return true;
            }
            else {
                return false;
            }
        };
        Parser.parseBooleanExpr = function () {
            if (this.matchToken("L_PAREN")) {
                if (this.parseExpr()) {
                    if (this.matchToken("T_EQUALS") || this.matchToken("T_NOT_EQUAL")) {
                        if (this.parseExpr()) {
                            if (this.matchToken("R_PAREN")) {
                                this.parsetext += "Parsed " + currentParseToken.value + " at line " + currentParseToken.line + " index " + currentParseToken.index;
                                return true;
                            }
                            else {
                                errorText = "Parse Error: Expected ) at end of boolean expression and found " + currentParseToken.value + " at line " + currentParseToken.line + " index " + currentParseToken.index;
                                parseErrorFound = true;
                                return false;
                            }
                        }
                        else {
                            errorText = "Parse Error: Expected valid expression after boolean operator and found " + currentParseToken.value + " at line " + currentParseToken.line + " index " + currentParseToken.index;
                            parseErrorFound = true;
                            return false;
                        }
                    }
                    else {
                        errorText = "Parse Error: Expected valid boolean expression == or != and found " + currentParseToken.value + " at line " + currentParseToken.line + " index " + currentParseToken.index;
                        parseErrorFound = true;
                        return false;
                    }
                }
                else {
                    errorText = "Parse Error: Expected valid expression before boolean operator and found " + currentParseToken.value + " at line " + currentParseToken.line + " index " + currentParseToken.index;
                    parseErrorFound = true;
                    return false;
                }
            }
            else {
                if (this.matchToken("T_TRUE") || this.matchToken("T_FALSE")) {
                    this.parsetext += "Found valid boolean value " + currentParseToken.value + " at line " + currentParseToken.line + " index " + currentParseToken.index;
                    return true;
                }
                return false;
            }
        };
        Parser.parseIntExpr = function () {
            if (this.matchToken("T_DIGIT")) {
                this.parsetext += "Parsed digit " + currentParseToken.value + " at line " + currentParseToken.line + " index " + currentParseToken.index;
                if (this.matchToken("T_ADDITION_OP")) {
                    this.parsetext += "Parsed addition operator " + currentParseToken.value + " at line " + currentParseToken.line + " index " + currentParseToken.index;
                    if (this.parseExpr()) {
                        this.parsetext += "Parsed valid expression " + currentParseToken.value + " at line " + currentParseToken.line + " index " + currentParseToken.index;
                        return true;
                    }
                    else {
                        errorText = "Parse Error: Expected valid expression after addition operator and found " + currentParseToken.value + " at line " + currentParseToken.line + " index " + currentParseToken.index;
                        parseErrorFound = true;
                        return false;
                    }
                }
                else {
                    // digit is still a valid expression
                    return true;
                }
            }
            else {
                return false;
            }
        };
        Parser.parseStringExpr = function () {
            if (this.matchToken("T_QUOTE")) {
                this.parsetext += "Parsed quote at beginning of string at line " + currentParseToken.line + " index " + currentParseToken.index;
                if (this.parseCharList()) {
                    this.parsetext += "Parsed valid character list " + currentParseToken.value + " at line " + currentParseToken.line + " index " + currentParseToken.index;
                    if (this.matchToken("T_QUOTE")) {
                        this.parsetext += "Parsed quote at end of valid string expression at line " + currentParseToken.line + " index " + currentParseToken.index;
                        return true;
                    }
                    else {
                        errorText = "Parse Error: Expected quote at end of string expression and found " + currentParseToken.value + " at line " + currentParseToken.line + " index " + currentParseToken.index;
                        parseErrorFound = true;
                        return false;
                    }
                }
                else {
                    errorText = "Parse Error: Expected valid character list inside string and found " + currentParseToken.value + " at line " + currentParseToken.line + " index " + currentParseToken.index;
                    parseErrorFound = true;
                    return false;
                }
            }
            else {
                return false;
            }
        };
        Parser.parseCharList = function () {
            if (this.matchToken("T_CHAR")) {
                if (this.parseCharList()) {
                    return true;
                }
            }
            else if (this.matchToken("T_SPACE")) {
                this.parsetext += "Parsed space at line " + currentParseToken.line + " index " + currentParseToken.index;
                if (this.parseCharList()) {
                    return true;
                }
            }
            else {
                this.parsetext += "Parsed empty string at line " + currentParseToken.line + " index " + currentParseToken.index;
                return true;
            }
        };
        Parser.matchToken = function (token) {
            if (currentParseToken.type == token) {
                currentParseTokenIndex++;
                if (currentParseTokenIndex < validLexedTokens.length)
                    currentParseToken = validLexedTokens[currentParseTokenIndex];
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
