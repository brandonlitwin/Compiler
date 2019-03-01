/* token.ts
Brandon Litwin
CMPT 432 - Compilers
Project 1

This is the token object
*/
var TSC;
(function (TSC) {
    var Token = /** @class */ (function () {
        function Token(type, value, lineNumber, index) {
            this.type = type;
            this.value = value;
            this.lineNumber = lineNumber;
            this.index = index;
        }
        return Token;
    }());
    TSC.Token = Token;
})(TSC || (TSC = {}));
