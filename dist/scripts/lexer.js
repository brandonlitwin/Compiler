/* lexer.ts  */
var TSC;
(function (TSC) {
    var Lexer = (function () {
        function Lexer() {
        }
        Lexer.lex = function () {
            {
                // Grab the "raw" source code.
                var sourceCode = document.getElementById("taSourceCode").value;
            }
        };
        return Lexer;
    })();
    TSC.Lexer = Lexer;
})(TSC || (TSC = {}));
