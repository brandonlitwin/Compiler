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
        static ast: Tree = new Tree();
        static treantCST;
        static treantAST;
        public static parse(tokenIndex, treantCST, treantAST) {
            parseErrorFound = false;
            this.treantCST = treantCST;
            this.treantAST = treantAST;
            this.currentParseTokenIndex = tokenIndex;
            errorText = "";
            this.parsetext = "Parsing program " + programCount + "...\n";
            currentParseToken = validLexedTokens[this.currentParseTokenIndex];

            if(this.parseProgram() && errorText == "") {
                this.parsetext += "Parse of program " + programCount + " completed with no errors!\n";
                this.treantCST = (this.cst.buildCST(this.treantCST['nodeStructure'], this.cst.root));
                this.treantAST = (this.ast.buildAST(this.treantAST['nodeStructure'], this.ast.root));
            } else {
                errorText += "Found " + this.parseErrorCount + " parse errors";
                // Error found, so we just move current parse token index to the EOP so it can move to the next program easily
                while (validLexedTokens[this.currentParseTokenIndex].type != "T_EOP") {
                    this.currentParseTokenIndex++;
                }
                this.currentParseTokenIndex++;
            }

            return [this.parsetext, this.currentParseTokenIndex, this.treantCST, this.treantAST];

        }
        public static parseProgram() {
            this.cst = new Tree();
            this.ast = new Tree();
            this.cst.addNode("Program"+programCount);

            if (this.parseBlock(false)) {
                if(!this.matchToken("T_EOP", false)) {
                    return false;
                } else {
                    if (this.cst.currNode.value.type == "T_EOP") {
                        // look for $, and move it to child of Program
                        this.cst.makeNodeChildOf(this.cst.currNode, "Program"+programCount);
                    }
                    return true;
                }
            } else {
                return false;
            }
           
        }
        public static parseBlock(inStatementOrExpr) {
            this.cst.addNode("Block");
            if (!inStatementOrExpr)
                this.ast.addNode("Block(Program"+programCount+")");
            if(!this.matchToken("T_L_BRACE", inStatementOrExpr)) {
                return false;
            } else {
                this.cst.moveUp();
                if (this.parseStatementList()) {
                    this.cst.moveUp();
                    if (this.matchToken("T_R_BRACE", inStatementOrExpr)) {
                        if (this.cst.currNode.value.type == "T_R_BRACE") {
                            // look for }, and move it to child of StatementList
                            this.cst.makeNodeChildOf(this.cst.currNode, "Block");      
                        }
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
                this.cst.moveUp();
                //this.cst.moveUp();
                if (this.parseStatementList()) {
                    this.cst.moveUp();
                    return true;
                }
            } else {
                // an empty statement is also valid
                if (!parseErrorFound) {
                    this.cst.addNode("\u03B5");
                    this.cst.moveUp();
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
            if (this.matchToken("T_PRINT", true)) {
                this.cst.moveUp(); 
                if (this.matchToken("T_L_PAREN", false)) 
                    //this.cst.moveUp();
                    if (this.parseExpr()) {
                        this.cst.moveUp();
                    }
                        if (this.cst.currNode.value == "Expression") 
                        // look for Expr, and move it to child of PrintStatement
                            this.cst.makeNodeChildOf(this.cst.currNode, "PrintStatement");     
                            if (this.matchToken("T_R_PAREN", false)) {
                                //this.cst.moveUp();
                                if (this.cst.currNode.value.type == "T_R_PAREN") {
                                    this.cst.makeNodeChildOf(this.cst.currNode, "PrintStatement");   
                                }
                                //this.cst.moveUp();
                                return true;
                            }
            }

            return false;
        }
        public static parseAssignmentStatement() {
            if (this.matchToken("T_ID", true)) {
                this.cst.addNode("AssignmentStatement");
                this.cst.addNode("Id"); 
                //this.cst.moveUp();
                //this.cst.addNode("AssignmentStatement");
                if (this.matchToken("T_ASSIGNMENT_OP", false)) 
                    if (this.parseExpr()) {
                        this.parsetext += "Parsed Assignment Statement at line " + currentParseToken.lineNumber + " index " + currentParseToken.index + "\n"; 
                        this.cst.moveUp();
                        return true;
                    } 
            }
            return false

        }
        public static parseVarDecl() {
            // parse type
            if (this.matchToken("T_INT", true) || this.matchToken("T_BOOLEAN", true) || this.matchToken("T_STRING", true)) {
                console.log("found var decl")
                this.cst.moveUp();
                this.cst.moveUp();
                this.cst.addNode("Id");
                if (this.matchToken("T_ID", false)) {
                    this.cst.moveUp();
                    return true;
                }
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
                //this.cst.moveUp();
                if (this.parseBooleanExpr()) 
                    //this.cst.moveUp();
                    if(this.parseBlock(true)) {
                        this.cst.moveUp();
                        return true;
                    }
               
            return false;
        }
        public static parseExpr() {
            //this.cst.moveUp();
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
                    if (this.matchToken("T_EQUALS", false) || this.matchToken("T_NOT_EQUAL", false)) 
                        if (this.parseExpr()) 
                            if (this.matchToken("T_R_PAREN", false)) {
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
                this.cst.moveUp();
                if (this.matchToken("T_ADDITION_OP", true)) {
                    if (this.parseExpr()) {
                        this.cst.moveUp();
                        if (this.cst.currNode.value == "Expression")
                            this.cst.makeNodeChildOf(this.cst.currNode, "IntExpr");
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
            //this.cst.addNode("StringExpression");
            if (this.matchToken("T_QUOTE", true)) 
                this.cst.moveUp();
                if (this.cst.currNode.value.type == "T_QUOTE")
                    this.cst.makeNodeChildOf(this.cst.currNode, "StringExpr");
                if (this.parseCharList()) 
                    //this.cst.moveUp();
                    if (this.matchToken("T_QUOTE", false)) {
                        //this.cst.moveUp();
                        if (this.cst.currNode.value.type == "T_QUOTE")
                            this.cst.makeNodeChildOf(this.cst.currNode, "Expression");
                        return true;
                    }
            
            return false;
        }
        public static parseCharList() {
            //this.cst.addNode("CharList");
            if (this.matchToken("T_Char", true)) {
                this.cst.moveUp();
                if (this.cst.currNode.value == "CharList")
                    this.cst.moveUp();
                    this.cst.makeNodeChildOf(this.cst.currNode, "CharList");
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
            console.log("Matching token");
            console.log(token);
            console.log(currentParseToken);
            if (currentParseToken.type == token) {
                if (currentParseToken.type == "T_Char") {
                    this.cst.addNode("CharList");
                    this.cst.addNode("Char");
                }
                else if (currentParseToken.type == "T_PRINT") {
                    this.cst.addNode("PrintStatement");
                    this.ast.addNode("PrintStatement");
                } else if (currentParseToken.type == "T_WHILE") {
                    this.cst.addNode("WhileStatement");
                    this.ast.addNode("WhileStatement");
                } else if (currentParseToken.type == "T_IF") {
                    this.cst.addNode("IfStatement");
                    this.ast.addNode("IfStatement");
                } else if (currentParseToken.type == "T_INT" || currentParseToken.type == "T_BOOLEAN" || currentParseToken.type == "T_STRING") {
                    this.cst.addNode("VarDecl");
                    this.cst.addNode("Type");
                    this.ast.addNode("VarDecl");
                } else if (currentParseToken.type == "L_PAREN") {
                    this.cst.addNode("BooleanExpr");
                } else if (currentParseToken.type == "T_ADDITION_OP") {
                    this.cst.addNode("IntOp");
                    this.ast.addNode("Addition");
                } else if (currentParseToken.type == "T_DIGIT") {
                    this.cst.addNode("IntExpr");
                    this.cst.addNode("Digit");
                } else if (currentParseToken.type == "T_QUOTE") {
                    this.cst.addNode("StringExpr");
                }
                this.parsetext += "Expected " + token + " and found " + currentParseToken.type + " [" + currentParseToken.value + "] at line " + currentParseToken.lineNumber + " index " + currentParseToken.index + "\n";
                this.cst.addNode(currentParseToken);
                if (currentParseToken.type == "T_DIGIT" || currentParseToken.type == "T_ID")
                    this.ast.addNode(currentParseToken);
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