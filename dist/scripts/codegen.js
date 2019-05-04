/* codegen.ts
Brandon Litwin
CMPT 432 - Compilers
Project 4
*/
var TSC;
(function (TSC) {
    var CodeGenerator = /** @class */ (function () {
        function CodeGenerator() {
        }
        CodeGenerator.generate = function (ast, symbols) {
            this.generatedCode = "";
            errorText = "";
            warningText = "";
            this.codetext = "Generating code for program " + programCount + "...\n";
            this.addCode("A9");
            this.addCode("00");
            return [this.generatedCode, this.codetext];
        };
        CodeGenerator.addCode = function (code) {
            this.generatedCode += code;
            this.generatedCode += " ";
            this.codetext += "Generating " + code + "\n";
        };
        return CodeGenerator;
    }());
    TSC.CodeGenerator = CodeGenerator;
})(TSC || (TSC = {}));
