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
            if (warningText != "") {
                warningText += "Found " + this.semanticWarningCount + " semantics warnings\n";
            }
            return [this.semantictext, this.symbols];
        };
        SemanticsAnalyzer.traverseTree = function (node) {
            this.symbol = {};
            if (node.value.includes("Block")) {
                this.scopeLevel++;
                for (var i = 0; i < node.children.length; i++) {
                    if (this.semanticErrorCount == 0) {
                        this.traverseTree(node.children[i]);
                    }
                }
                this.scopeLevel--;
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
                this.symbols.push(this.symbol);
            }
            else if (node.value == "AssignmentStatement") {
                var variableAssigned = node.children[0];
                var valueAssigned = node.children[1];
                this.checkUsedNotDeclared(variableAssigned);
                // Checking for assigned variable in list of symbols and marking them as initialized
                for (var i = 0; i < this.symbols.length; i++) {
                    if (variableAssigned.value == this.symbols[i]["name"] && valueAssigned != null) {
                        this.semantictext += "Variable " + variableAssigned.value + " on line " + valueAssigned.lineNumber + " index " + valueAssigned.index + " has been initialize\n";
                        this.symbols[i]["initialized"] = true;
                    }
                }
                this.typeCheck(variableAssigned, valueAssigned);
            }
            else if (node.value == "PrintStatement") {
                var variableUsed = node.children[0];
                // Only check on vars, not strings
                if (!variableUsed.value.includes('"')) {
                    this.checkUsedNotDeclared(variableUsed);
                    this.checkUsedNotInitialized(variableUsed);
                }
            }
            else if (node.value == "IfStatement") {
                var variableUsed = node.children[0].children[0];
                this.checkUsedNotDeclared(variableUsed);
                this.checkUsedNotInitialized(variableUsed);
                // Check inner block
                for (var i = 0; i < node.children.length; i++) {
                    this.traverseTree(node.children[i]);
                }
            }
            else if (node.value == "WhileStatement") {
                var variableUsed = node.children[0].children[0];
                this.checkUsedNotDeclared(variableUsed);
                this.checkUsedNotInitialized(variableUsed);
                // Check inner block
                for (var i = 0; i < node.children.length; i++) {
                    this.traverseTree(node.children[i]);
                }
            }
            else if (node.value == "T_EQUALS") {
                var variable = node.children[0];
                var value = node.children[1];
                this.typeCheckInExpression(variable, value);
            }
        };
        SemanticsAnalyzer.checkUsedNotInitialized = function (variable) {
            for (var i = 0; i < this.symbols.length; i++) {
                var currentSymbol = this.symbols[i];
                if (currentSymbol["name"] == variable.value && currentSymbol["program"] == programCount) {
                    if (currentSymbol["initialized"] == true) {
                        this.semantictext += "Variable " + variable.value + " on line " + variable.lineNumber + " index " + variable.index + " has been used\n";
                    }
                    else {
                        warningText += "Semantics Warning: Variable " + variable.value + " has been used before being initialized on line " + variable.lineNumber + " index " + variable.index + "\n";
                        this.semanticWarningCount++;
                    }
                }
            }
        };
        SemanticsAnalyzer.checkUsedNotDeclared = function (variable) {
            // Checking for assigned variable in list of symbols
            var varNotFound = true;
            for (var i = 0; i < this.symbols.length; i++) {
                var currentSymbol = this.symbols[i];
                if (variable.value == currentSymbol["name"] && currentSymbol["program"] == programCount && this.scopeLevel >= currentSymbol["scope"]) {
                    varNotFound = false;
                }
            }
            if (varNotFound == true) {
                errorText = "Semantics Error: Use of Undeclared Variable " + variable.value + " on line " + variable.lineNumber + " index " + variable.index + "\n";
                this.semanticErrorCount++;
            }
            else {
                this.semantictext += "Variable " + variable.value + " on line " + variable.lineNumber + " index " + variable.index + " has been declared\n";
            }
        };
        SemanticsAnalyzer.typeCheck = function (variable, value) {
            var string = new RegExp('"[a-z]*"');
            var digit = new RegExp('[0-9]+');
            var typeAssigned;
            if (value.value == "true" || value.value == "false") {
                typeAssigned = "boolean";
            }
            else if (string.test(value.value)) {
                typeAssigned = "string";
            }
            else if (digit.test(value.value)) {
                typeAssigned = "int";
            }
            for (var i = 0; i < this.symbols.length; i++) {
                var currentSymbol = this.symbols[i];
                if (variable.value == currentSymbol["name"] && currentSymbol["program"] == programCount) {
                    // check if current symbol's type = type of value
                    if (currentSymbol["type"] == typeAssigned) {
                        this.semantictext += "Type Assigned [" + typeAssigned + "] matches declared type [" + currentSymbol["type"] + "] for variable " + variable.value + " on line " + variable.lineNumber + " index " + variable.index + "\n";
                    }
                    else {
                        errorText = "Semantics Error: Type Assigned [" + typeAssigned + "] does not match declared type [" + currentSymbol["type"] + "] for variable " + variable.value + " on line " + variable.lineNumber + " index " + variable.index + "\n";
                        this.semanticErrorCount++;
                    }
                }
            }
        };
        SemanticsAnalyzer.typeCheckInExpression = function (variable, value) {
            var string = new RegExp('"[a-z]*"');
            var digit = new RegExp('[0-9]+');
            var typeComparedTo;
            if (value.value == "true" || value.value == "false") {
                typeComparedTo = "boolean";
            }
            else if (string.test(value.value)) {
                typeComparedTo = "string";
            }
            else if (digit.test(value.value)) {
                typeComparedTo = "int";
            }
            for (var i = 0; i < this.symbols.length; i++) {
                var currentSymbol = this.symbols[i];
                if (variable.value == currentSymbol["name"] && currentSymbol["program"] == programCount) {
                    // check if current symbol's type = type of value
                    if (currentSymbol["type"] == typeComparedTo) {
                        this.semantictext += "Type being compared to [" + typeComparedTo + "] matches declared type [" + currentSymbol["type"] + "] for variable " + variable.value + " on line " + variable.lineNumber + " index " + variable.index + "\n";
                    }
                    else {
                        errorText = "Semantics Error: Type being compared to [" + typeComparedTo + "] does not match declared type [" + currentSymbol["type"] + "] for variable " + variable.value + " on line " + variable.lineNumber + " index " + variable.index + "\n";
                        this.semanticErrorCount++;
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
