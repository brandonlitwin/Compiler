/* parser.ts
Brandon Litwin
CMPT 432 - Compilers
Project 2 
*/

module TSC {
    export class Parser {
        static parsetext: string;
        static parseErrorCount: number = 0;
        static currentParseTokenIndex: number = 0;
        static cst: Tree = new Tree();
        //static parsedAProgram: boolean = false;
        public static parse(tokenIndex) {
            this.currentParseTokenIndex = tokenIndex;
            errorText = "";
            this.parsetext = "Parsing program " + programCount + "...\n";
            currentParseToken = validLexedTokens[this.currentParseTokenIndex];
            console.log(validLexedTokens);
            console.log(currentParseToken);

            if(this.parseProgram() && errorText == "") {
                console.log("finished parse");
                //this.parsedAProgram = true;
                this.parsetext += "Parse of program " + programCount + " completed with no errors!\n";
            } else {
                errorText += "Found " + this.parseErrorCount + " parse errors";
                console.log(errorText);
            }

            return [this.parsetext, this.currentParseTokenIndex];

        }
        public static parseProgram() {
            if (this.parseBlock(false)) {
                if(!this.matchToken("T_EOP", false)) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
           
        }
        public static parseBlock(inStatementOrExpr) {
            console.log("block");
            if(!this.matchToken("T_L_BRACE", inStatementOrExpr)) {
                return false;
            } else {
                if (this.parseStatementList()) {
                    console.log("parsed that statement list")
                    if (this.matchToken("T_R_BRACE", inStatementOrExpr)) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        }
        public static parseStatementList() {
            console.log("statement list");
            if(this.parseStatement()) {
                console.log("parsed statement in statement list")
                if (this.parseStatementList())
                    return true;
            } else {
                // an empty statement is also valid
                if (!parseErrorFound) {
                    return true;
                } else {
                    return false;
                }
                
            }
        }
        public static parseStatement() {
            if (this.parsePrintStatement() || this.parseAssignmentStatement() || this.parseVarDecl() ||
                this.parseWhileStatement() || this.parseIfStatement() || this.parseBlock(true)) {
                    return true;
             } else {
                 return false;
             }
        }
        public static parsePrintStatement() {
            if (this.matchToken("T_PRINT", true)) 
                if (this.matchToken("T_L_PAREN", true)) 
                    if (this.parseExpr()) 
                        if (this.matchToken("T_R_PAREN", true)) 
                            return true;

            return false;
        }
        public static parseAssignmentStatement() {
            if (this.matchToken("T_ID", true)) 
                if (this.matchToken("T_ASSIGNMENT_OP", true)) 
                    if (this.parseExpr()) {
                        this.parsetext += "Parsed Assignment Statement at line " + (currentParseToken.lineNumber-1) + " index " + currentParseToken.index + "\n"; 
                        return true;
                    } 

            return false

        }
        public static parseVarDecl() {
            // parse type
            if (this.matchToken("T_INT", true) || this.matchToken("T_BOOLEAN", true) || this.matchToken("T_STRING", true)) 
                console.log("looking for id in var dec");
                if (this.matchToken("T_ID", true)) 
                    return true;

            return false
        }
        public static parseWhileStatement() {
            if (this.matchToken("T_WHILE", true)) 
                if (this.parseBooleanExpr()) 
                    return this.parseBlock(true);
                 
            return false;
        }
        public static parseIfStatement() {
            if (this.matchToken("T_IF", true)) 
                if (this.parseBooleanExpr()) 
                    return this.parseBlock(true);
               
            return false;
        }
        public static parseExpr() {
            if (this.parseIntExpr() || this.parseBooleanExpr() || this.parseStringExpr() || this.matchToken("T_ID", false)) {
                return true;
            } else {
                return false;
            }
        }
        public static parseBooleanExpr() {
            if (this.matchToken("T_L_PAREN", true)) {
                if (this.parseExpr()) 
                    if (this.matchToken("T_EQUALS", true) || this.matchToken("T_NOT_EQUAL", true)) 
                        if (this.parseExpr()) 
                            if (this.matchToken("T_R_PAREN", true)) {
                                this.parsetext += "Parsed Boolean Expression at line " + (currentParseToken.lineNumber) + " index " + currentParseToken.index + "\n";
                                return true;
                            }
                return false;
            } else {
                if (this.matchToken("T_TRUE", true) || this.matchToken("T_FALSE", true)) {
                    return true;
                } 
                return false;
            }
        }
        public static parseIntExpr() {
            if (this.matchToken("T_DIGIT", true)) {
                if (this.matchToken("T_ADDITION_OP", true)) {
                    if (this.parseExpr())
                        return true;
                     else 
                        return false;
                    

                } else 
                    // digit is still a valid expression
                    return true;

            } else 
                return false;

        }
        public static parseStringExpr() {
            if (this.matchToken("T_QUOTE", true)) 
                if (this.parseCharList()) 
                    if (this.matchToken("T_QUOTE", true)) 
                        return true;
            
            return false;
        }
        public static parseCharList() {
            if (this.matchToken("T_Char", true)) {
                if (this.parseCharList()) 
                    return true;
            } else if (this.matchToken("T_SPACE", true)) {
                if (this.parseCharList()) {
                    return true;
                }
            }
            else 
                // an empty char is also valid
                return true;
        }
        public static matchToken(token, inStatementOrExpr) {
            console.log("token to match is " + token + " and current token is " + currentParseToken.type);
            if (currentParseToken.type == token) {
                this.parsetext += "Expected " + token + " and found " + currentParseToken.type + " [" + currentParseToken.value + "] at line " + currentParseToken.lineNumber + " index " + currentParseToken.index + "\n";
                this.currentParseTokenIndex++;
                if (this.currentParseTokenIndex < validLexedTokens.length)
                    currentParseToken = validLexedTokens[this.currentParseTokenIndex];
                return true;
            } else {
                if (!parseErrorFound && !inStatementOrExpr) {
                    errorText = "Parse Error: Expected " + token + " and found " + currentParseToken.type + " at line " + currentParseToken.lineNumber + " index " + currentParseToken.index + "\n";
                    parseErrorFound = true;
                    this.parseErrorCount++;
                }
                    
                return false;
            }
        } 
            
    }
}