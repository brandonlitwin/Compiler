/* semanticsAnalyzer.ts
Brandon Litwin
CMPT 432 - Compilers
Project 3
*/
var TSC;
(function (TSC) {
    var SemanticsAnalyzer = /** @class */ (function () {
        function SemanticsAnalyzer() {
        }
        SemanticsAnalyzer.analyze = function (ast) {
            this.semanticErrorCount = 0;
            this.semanticWarningCount = 0;
            errorText = "";
            warningText = "";
            this.ast = ast;
            console.log(ast);
            this.semantictext = "Semantics Analysis of program " + programCount + "...\n";
            this.traverseTree(ast.root);
            for (var i = 0; i < this.symbols.length; i++) {
                var currentSymbol = this.symbols[i];
                if (currentSymbol["initialized"] == false && currentSymbol["program"] == programCount) {
                    warningText += "Semantics Warning: Variable " + currentSymbol["name"] + " has been declared but not initialized on line " + currentSymbol["lineNumber"] + " index " + currentSymbol["index"] + "\n";
                    this.semanticWarningCount++;
                }
            }
            if (errorText == "") {
                this.semantictext += "Semantics Analysis of program " + programCount + " completed with no errors!\n";
            }
            else {
                console.log(errorText + " is the error");
                errorText += "Found " + this.semanticErrorCount + " semantics errors\n";
            }
            if (warningText != "") {
                warningText += "Found " + this.semanticWarningCount + " semantics warnings\n";
            }
            return [this.semantictext, this.symbols];
        };
        SemanticsAnalyzer.traverseTree = function (node) {
            this.symbol = {};
            console.log("traversing to node " + node.value);
            if (node.value.includes("Block")) {
                this.scopeLevel++;
                for (var i = 0; i < node.children.length; i++) {
                    this.traverseTree(node.children[i]);
                }
                console.log("finished traversing block");
                return;
            }
            else if (node.value == "VarDecl") {
                this.symbol["type"] = node.children[0].value;
                this.symbol["name"] = node.children[1].value;
                this.symbol["scope"] = this.scopeLevel;
                this.symbol["lineNumber"] = node.children[1].lineNumber;
                this.symbol["index"] = node.children[1].index;
                this.symbol["initialized"] = false;
                this.symbol["program"] = programCount;
                console.log(this.symbol);
                console.log(this.symbols);
                this.symbols.push(this.symbol);
                this.semantictext += "Variable " + this.symbol["name"] + " has been declared on line " + this.symbol["lineNumber"] + " index " + this.symbol["index"] + "\n";
            }
            else if (node.value == "AssignmentStatement") {
                var variableAssigned = node.children[0];
                var valueAssigned = node.children[1];
                var varNotFound = true;
                // Checking for assigned variable in list of symbols
                for (var i = 0; i < this.symbols.length; i++) {
                    if (variableAssigned.value == this.symbols[i]["name"]) {
                        this.symbols[i]["initialized"] = true;
                        varNotFound = false;
                    }
                }
                if (varNotFound == false) {
                    if (valueAssigned != null) {
                        this.semantictext += "Variable " + variableAssigned.value + " has been initialized on line " + valueAssigned.lineNumber + " index " + valueAssigned.index + "\n";
                    } /*else {
                        errorText = "Semantics Error: Variable " + variableAssigned.value + " on line " + variableAssigned.lineNumber + " index " + valueAssigned.index + " has been declared but not initialized\n";
                        this.semanticErrorCount++;
                    }*/
                }
                else {
                    errorText = "Semantics Error: Use of Undeclared Variable " + variableAssigned.value + " on line " + variableAssigned.lineNumber + " index " + variableAssigned.index + "\n";
                    this.semanticErrorCount++;
                }
            }
            else if (node.value == "PrintStatement") {
                var variableUsed = node.children[0];
                this.checkUsedNotInitialized(variableUsed);
            }
            else if (node.value == "IfStatement") {
                var variableUsed = node.children[0].children[0];
                this.checkUsedNotInitialized(variableUsed);
                // Check inner block
                for (var i = 0; i < node.children.length; i++) {
                    this.traverseTree(node.children[i]);
                }
            }
            else if (node.value == "WhileStatement") {
                var variableUsed = node.children[0].children[0];
                this.checkUsedNotInitialized(variableUsed);
                // Check inner block
                for (var i = 0; i < node.children.length; i++) {
                    this.traverseTree(node.children[i]);
                }
            }
        };
        SemanticsAnalyzer.checkUsedNotInitialized = function (variable) {
            console.log("in this bitch");
            for (var i = 0; i < this.symbols.length; i++) {
                var currentSymbol = this.symbols[i];
                if (currentSymbol["name"] == variable.value && currentSymbol["program"] == programCount) {
                    if (currentSymbol["initialized"] == true) {
                        this.semantictext += "Variable " + variable.value + " has been used on line " + variable.lineNumber + " index " + variable.index + "\n";
                    }
                    else {
                        warningText += "Semantics Warning: Variable " + variable.value + " has been used before being initialized on line " + variable.lineNumber + " index " + variable.index + "\n";
                        this.semanticWarningCount++;
                    }
                }
            }
        };
        SemanticsAnalyzer.scopeLevel = -1;
        SemanticsAnalyzer.symbol = {};
        SemanticsAnalyzer.symbols = [];
        SemanticsAnalyzer.varDeclaredNotInitialized = false;
        return SemanticsAnalyzer;
    }());
    TSC.SemanticsAnalyzer = SemanticsAnalyzer;
})(TSC || (TSC = {}));
