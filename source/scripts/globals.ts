/*
Brandon Litwin
CMPT 432 - Compilers
*/
var _Lexer = TSC.Lexer;
var _Parser = TSC.Parser;

// Global variables
    var tokens = "";
    var tokenIndex = 0;
    var currentToken = "";
    var errorCount = 0;
    var EOF = "$";
    var lexErrorFound = false;
    var parseErrorFound = false;
    var lastTokenIndex = 0;
    var lastTokenTypeFound = "";
    var lastToken = "";
    var lexErrorCount = 0;
    //var currentTokenIndex = 0;
    var programCount = 0;
    var morePrograms = true;
    var errorText = "";
    var warningText = "";
    var verboseOn = true;
    var inString = false;
    var startStringIndex = 0;
    var EOPFound = false;
    var lineNumber = 1;
    var lastEndLineIndex = 0;
    var validLexedTokens = [];
    var currentParseToken;
    //var currentParseTokenIndex = 0;
