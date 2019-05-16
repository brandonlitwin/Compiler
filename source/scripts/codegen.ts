/* codegen.ts
Brandon Litwin
CMPT 432 - Compilers
Project 4
*/

module TSC {
    export class CodeGenerator {
        static generatedCode: string;
        static codetext: string;
        static scopeLevel: number = -1;
        static codegenErrorCount: number = 0;
        static tempCounter: number = 0;
        static staticVar: Object = {};
        static staticVars: Array<Object> = [];
        static codeCount: number = 0;
        public static generate(ast, symbols) {
            this.generatedCode = "";
            this.staticVars = [];
            this.tempCounter = 0;
            errorText = "";
            warningText = "";
            this.codetext = "Generating code for program " + programCount + "...\n";
            this.addCode("A9");
            this.addCode("00");
            this.traverseTree(ast.root);
            this.addCode("00");
            this.backpatch();
            return [this.generatedCode, this.codetext];
        }

        public static traverseTree(node) {
            if (node.value.includes("Block")) {
                this.scopeLevel++;
                for(var i = 0; i < node.children.length; i++){
                    if (this.codegenErrorCount == 0) {
                        this.traverseTree(node.children[i]);
                    }
                    
                }
                this.scopeLevel--;
                return;

            } else if (node.value == "VarDecl") {
                this.codetext += "Generating OP codes for a variable declaration in scope " + this.scopeLevel + "\n";
                this.staticVar = {};
                this.addCode("8D");
                var tempVar = "T";
                tempVar += this.tempCounter.toString();
                this.addCode(tempVar);
                this.addCode("00");
                this.staticVar["Temp"] = tempVar + ",00";
                this.staticVar["Variable"] = node.children[1].value;
                this.staticVar["Address"] = "";
                this.staticVar["Scope"] = this.scopeLevel;
                this.tempCounter++;
                this.staticVars.push(this.staticVar);

            } else if (node.value == "AssignmentStatement") {
                this.codetext += "Generating OP codes for an assignment statement in scope " + this.scopeLevel + "\n";
                var variableAssigned = node.children[0].value;
                var valueAssigned = node.children[1].value;
                var assigned = false;
                this.addCode("A9");
                this.addCode("0" + valueAssigned.toString());
                this.addCode("8D");
                // Find variable in list of static vars
                // Checks vars from innermost scope first
                for (var i = this.staticVars.length-1; i >= 0; i--) {
                    if (this.staticVars[i]["Variable"] == variableAssigned && this.staticVars[i]["Scope"] <= this.scopeLevel && !assigned) {
                        this.addCode(this.staticVars[i]["Temp"].split(',')[0]);
                        this.addCode(this.staticVars[i]["Temp"].split(',')[1]);
                        assigned = true;
                    }
                }

            } else if (node.value == "PrintStatement") {
                // Check for the printed var's type in symbol table, making sure it matches the current scope or previous scope
                var variablePrinted = node.children[0].value;
                var printed = false;
                this.codetext += "Generating OP codes for a print statement in scope " + this.scopeLevel + "\n";
                this.addCode("AC");
                // Checks vars from innermost scope first
                for (var i = this.staticVars.length-1; i >= 0; i--) {
                    if (this.staticVars[i]["Variable"] == variablePrinted && this.staticVars[i]["Scope"] <= this.scopeLevel && !printed) {
                        printed = true;
                        this.addCode(this.staticVars[i]["Temp"].split(',')[0]);
                        this.addCode(this.staticVars[i]["Temp"].split(',')[1]);
                    }
                }
                this.addCode("A2");
                this.addCode("01");
                this.addCode("FF");

            }

        }

        public static addCode(code) {
            this.generatedCode += code;
            this.generatedCode += " ";
            this.codetext += "Generating " + code + "\n";
            this.codeCount++;
        }

        public static backpatch() {
            for (var i = 0; i < this.staticVars.length; i++) {
                // Convert all temp addresses to memory locations
                if (this.staticVars[i]["Address"] == "") {
                    this.staticVars[i]["Address"] = this.codeCount.toString(16).toUpperCase();
                    this.codeCount++;
                }
            }
            for (var i = 0; i < this.generatedCode.length; i++) {
                // Replace each temp address in the code
                if (this.generatedCode[i] == "T") {
                    for (var j = 0; j < this.staticVars.length; j++) {
                        var currentCode = this.generatedCode[i] + this.generatedCode[i+1];
                        if (this.staticVars[j]["Temp"].split(',')[0] == currentCode) {
                            var convertedCode = this.staticVars[j]["Address"];
                            this.generatedCode = this.generatedCode.replace(currentCode, convertedCode);
                        }
                    }
                }
                
            }
          
        }
    }
}