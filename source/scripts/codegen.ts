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
        public static generate(ast, symbols) {
            this.generatedCode = "";
            errorText = "";
            warningText = "";
            this.codetext = "Generating code for program " + programCount + "...\n";
            this.addCode("A9");
            this.addCode("00");
            this.traverseTree(ast.root);
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
                this.staticVar = {};
                this.addCode("8D");
                var tempVar = "T";
                tempVar += this.tempCounter.toString();
                this.addCode(tempVar);
                this.addCode("XX");
                this.staticVar["Temp"] = tempVar + "XX";
                this.staticVar["Variable"] = node.children[1].value;
                this.staticVar["Address"] = this.tempCounter;
                this.tempCounter++;
                this.staticVars.push(this.staticVar);

            } else if (node.value == "AssignmentStatement") {
                var variableAssigned = node.children[0].value;

            } else if (node.value == "PrintStatement") {
                // Check for the printed var's type in symbol table, making sure it matches the current scope

            }

        }

        public static addCode(code) {
            this.generatedCode += code;
            this.generatedCode += " ";
            this.codetext += "Generating " + code + "\n";
        }
    }
}