var _Lexer = TSC.Lexer;
// Global variables
var tokens = "";
var tokenIndex = 0;
var currentToken = "";
var errorCount = 0;
var EOF = "$";
var lexErrorFound = false;
var lastTokenIndex = 0;
var lastTokenTypeFound = "";
var lastToken = "";
var lexErrorCount = 0;
var currentTokenIndex = 0;
var programCount = 1;
var morePrograms = true;
var errorText = "";
var currentSearchString = "";
