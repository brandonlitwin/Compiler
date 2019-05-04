/* codegen.ts
Brandon Litwin
CMPT 432 - Compilers
Project 4
*/

module TSC {
    export class CodeGenerator {
        static generatedCode: string;
        static codetext: string;
        public static generate(ast, symbols) {
            this.generatedCode = "";
            errorText = "";
            warningText = "";
            this.codetext = "Generating code for program " + programCount + "...\n";
            this.addCode("A9");
            this.addCode("00");
            return [this.generatedCode, this.codetext];
        }

        public static addCode(code) {
            this.generatedCode += code;
            this.generatedCode += " ";
            this.codetext += "Generating " + code + "\n";
        }
    }
}