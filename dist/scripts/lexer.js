/* lexer.ts  */
var TSC;
(function (TSC) {
    var Lexer = /** @class */ (function () {
        function Lexer() {
        }
        Lexer.lex = function () {
            {
                // Creating all the RegEx for the grammar
                var allRegex = [];
                allRegex = [new RegExp('{'),
                    new RegExp('}'),
                    new RegExp('[a-z]'),
                    new RegExp('='),
                    new RegExp('\\$'),
                    new RegExp('\\s'),
                    new RegExp('[0-9]'),
                    new RegExp('\\+'),
                    new RegExp('\\('),
                    new RegExp('\\)'),
                    new RegExp('print'),
                    new RegExp('while'),
                    new RegExp('if'),
                    new RegExp('int'),
                    new RegExp('string'),
                    new RegExp('boolean'),
                    new RegExp('true'),
                    new RegExp('false'),
                    new RegExp('=='),
                    new RegExp('!'),
                    new RegExp('\\"'),
                    new RegExp('\\/\\*'),
                    new RegExp('\\*\\/'),
                ];
                var lextext = "Lexing program 1...\n";
                for (var i = 0; i < tokens.length; i++) {
                    var tokenFound = false;
                    for (var j = 0; j < allRegex.length; j++) {
                        if (!lexErrorFound) {
                            if (allRegex[j].test(tokens.charAt(i))) {
                                // Check for !=, because just ! is invalid
                                if (allRegex[j] == "/!/") {
                                    if (tokens.charAt(i + 1) == '=') {
                                        lextext += "Found Token != at index " + i + "\n";
                                        i++;
                                    }
                                    else {
                                        lextext += "Error: Found Invalid Token " + tokens.charAt(i) + " at index " + i + " \n";
                                        lexErrorFound = true;
                                    }
                                }
                                else {
                                    lextext += "Found Token " + tokens.charAt(i) + " at index " + i + "\n";
                                }
                                tokenFound = true;
                            }
                            else {
                                if (j == allRegex.length - 1 && tokenFound == false) {
                                    lextext += "Error: Found Invalid Token " + tokens.charAt(i) + " at index " + i + " \n";
                                    lexErrorFound = true;
                                }
                            }
                        }
                    }
                }
                return lextext;
                /*var array;
                for (var j = 0; j < allRegex.length; j++) {
                    while ((array = allRegex[j].exec(tokens)) != null) {
                        console.log("Found Token " + array[0] + allRegex[j].lastIndex + "\n");
                        console.log(array);
                        console.log(array['index']);
                        //foundArray.push(array[0]);
                        foundArray[array['index']] = array[0];
                        //console.log(foundArray);
                    }
                    if (!allRegex[j].test(tokens)) {
                        lextext += "Error: Found Invalid Token " + tokens + "\n";
                    }
                    
                    
                }
                console.log("Final array is " );
                console.log(foundArray);
                for (var i = 0; i < foundArray.length; i++) {
                    if (foundArray != undefined)
                        lextext += "Found Token " + foundArray[i] + " at index " + i + "\n";
                }
                return lextext;*/
            }
        };
        return Lexer;
    }());
    TSC.Lexer = Lexer;
})(TSC || (TSC = {}));
