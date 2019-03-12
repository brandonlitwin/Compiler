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
        public static parse(tokenIndex, treantCST) {
            this.currentParseTokenIndex = tokenIndex;
            errorText = "";
            this.parsetext = "Parsing program " + programCount + "...\n";
            currentParseToken = validLexedTokens[this.currentParseTokenIndex];
            console.log(validLexedTokens);
            console.log(currentParseToken);

            if(this.parseProgram() && errorText == "") {
                //this.parsedAProgram = true;
                this.parsetext += "Parse of program " + programCount + " completed with no errors!\n";
            } else {
                errorText = "Found " + this.parseErrorCount + " parse errors";
            }

            return [this.parsetext, this.currentParseTokenIndex, this.cst];

        }
        public static parseProgram() {
            this.cst = new Tree();
            this.cst.addNode("Program"+programCount);
            if (this.parseBlock(false)) {
                if(!this.matchToken("T_EOP", false)) {
                    return false;
                } else {
                    this.cst.moveUp();
                    return true;
                }
            } else {
                return false;
            }
           
        }
        public static parseBlock(inStatementOrExpr) {
            this.cst.addNode("Block");
            if(!this.matchToken("T_L_BRACE", inStatementOrExpr)) {
                return false;
            } else {
                if (this.parseStatementList()) {
                    if (this.matchToken("T_R_BRACE", inStatementOrExpr)) {
                        this.cst.moveUp();
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
            this.cst.addNode("StatementList");
            if(this.parseStatement()) {
                if (this.parseStatementList()) {
                    this.cst.moveUp();
                    return true;
                }
            } else {
                // an empty statement is also valid
                if (!parseErrorFound) {
                    this.cst.moveUp();
                    return true;
                } else {
                    return false;
                }
                
            }
        }
        public static parseStatement() {
            this.cst.addNode("Statement");
            if (this.parsePrintStatement() || this.parseAssignmentStatement() || this.parseVarDecl() ||
                this.parseWhileStatement() || this.parseIfStatement() || this.parseBlock(true)) {
                    this.cst.moveUp();
                    return true;
             } else {
                 return false;
             }
        }
        public static parsePrintStatement() {
            this.cst.addNode("PrintStatement");
            if (this.matchToken("T_PRINT", true)) 
                if (this.matchToken("T_L_PAREN", true)) 
                    if (this.parseExpr()) 
                        if (this.matchToken("T_R_PAREN", true)) {
                            this.cst.moveUp();
                            return true;
                        }

            return false;
        }
        public static parseAssignmentStatement() {
            this.cst.addNode("AssignmentStatement");
            if (this.matchToken("T_ID", true)) 
                if (this.matchToken("T_ASSIGNMENT_OP", true)) 
                    if (this.parseExpr()) {
                        this.parsetext += "Parsed Assignment Statement at line " + (currentParseToken.lineNumber-1) + " index " + currentParseToken.index + "\n"; 
                        this.cst.moveUp();
                        return true;
                    } 

            return false

        }
        public static parseVarDecl() {
            //this.cst.addNode("VarDecl");
            // parse type
            if (this.matchToken("T_INT", true) || this.matchToken("T_BOOLEAN", true) || this.matchToken("T_STRING", true)) 
                if (this.matchToken("T_ID", true)) {
                    this.cst.moveUp();
                    return true;
                }

            return false
        }
        public static parseWhileStatement() {
            //this.cst.addNode("WhileStatement");
            if (this.matchToken("T_WHILE", true)) 
                if (this.parseBooleanExpr()) {
                    if (this.parseBlock(true)) {
                        this.cst.moveUp();
                        return true;
                    }
                }
                 
            return false;
        }
        public static parseIfStatement() {
            //this.cst.addNode("IfStatement");
            if (this.matchToken("T_IF", true)) 
                if (this.parseBooleanExpr()) 
                    if(this.parseBlock(true)) {
                        this.cst.moveUp();
                        return true;
                    }
               
            return false;
        }
        public static parseExpr() {
            this.cst.addNode("Expression");
            if (this.parseIntExpr() || this.parseBooleanExpr() || this.parseStringExpr() || this.matchToken("T_ID", false)) {
                this.cst.moveUp();
                return true;
            } else {
                return false;
            }
        }
        public static parseBooleanExpr() {
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
            } else {
                if (this.matchToken("T_TRUE", true) || this.matchToken("T_FALSE", true)) {
                    this.cst.moveUp();
                    return true;
                } 
                return false;
            }
        }
        public static parseIntExpr() {
            //this.cst.addNode("IntExpression");
            if (this.matchToken("T_DIGIT", true)) {
                if (this.matchToken("T_ADDITION_OP", true)) {
                    if (this.parseExpr()) {
                        this.cst.moveUp();
                        return true;
                    }
                     else 
                        return false;
                    

                } else {
                    // digit is still a valid expression
                    this.cst.moveUp();
                    return true;
                }

            } else 
                return false;

        }
        public static parseStringExpr() {
            this.cst.addNode("StringExpression");
            if (this.matchToken("T_QUOTE", true)) 
                if (this.parseCharList()) 
                    if (this.matchToken("T_QUOTE", true)) {
                        this.cst.moveUp();
                        return true;
                    }
            
            return false;
        }
        public static parseCharList() {
            this.cst.addNode("CharList");
            if (this.matchToken("T_Char", true)) {
                if (this.parseCharList()) {
                    this.cst.moveUp();
                    return true;
                }
            } else if (this.matchToken("T_SPACE", true)) {
                if (this.parseCharList()) {
                    this.cst.moveUp();
                    return true;
                }
            }
            else 
                // an empty char is also valid
                return true;
        }
        public static matchToken(token, inStatementOrExpr) {
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