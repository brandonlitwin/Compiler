/* lexer.ts  */

module TSC
	{
	export class Lexer {
		public static lex() {
		    {
				// Creating all the RegEx for the grammar
				var Keywords = {
					T_PRINT: new RegExp('^print$'),
					T_WHILE: new RegExp('^while$'),
					T_IF: new RegExp('^if$'),
					T_INT: new RegExp('^int$'),
					T_STRING: new RegExp('^string$'),
					T_BOOLEAN: new RegExp('^boolean$'),
					T_TRUE: new RegExp('^true$'),
					T_FALSE: new RegExp('^false$')
				};
				var Symbols = {
					T_L_BRACE: new RegExp('^{$'), 
					T_R_BRACE: new RegExp('^}$'),
					T_EOP: new RegExp('^\\$$'),
					T_SPACE: new RegExp('^\\s$'),
					T_ADDITION_OP: new RegExp('^\\+$'),
					T_L_PAREN: new RegExp('^\\($'),
					T_R_PAREN: new RegExp('^\\)$'),
					T_EQUALS: new RegExp('^==$'),
					T_NOT_EQUAL: new RegExp('^!=$'),
					T_ASSIGNMENT_OP: new RegExp('^=$'),
					T_QUOTE: new RegExp('^\\"$'),
					T_BEGIN_COMMENT: new RegExp('^\\/\\*$'),
					T_END_COMMENT: new RegExp('^\\*\\/$'),
				};

				var T_ID = new RegExp('^[a-z]$');
				var T_DIGIT = new RegExp('^[0-9]$');

				// Lex hierarchy:
				// 1. Keyword
				// 2. ID
				// 3. Symbol
				// 4. Digit
				// 5. Char
				/* 
				Lexer TODO: Print out errors again. Make it work for multiple programs. Have lexer fix a missing $.
				*/

				var lextext = "Lexing program 1...\n";
				for (currentTokenIndex; currentTokenIndex < tokens.length; currentTokenIndex++) {
					var tokenFound = false;
					var currentChar = tokens.charAt(currentTokenIndex);
					if (currentToken == "")
						currentToken = currentChar;
					else 
						currentToken = currentToken + currentChar;
					// Check for keyword
					for (var regex in Keywords) {
						if (Keywords[regex].test(currentToken)) {
							lextext += "Found Token " + regex + " [ " + currentToken + " ] " + " at index " + currentTokenIndex +  "\n";
							lastTokenIndex = currentTokenIndex;
							tokenFound = true;
							currentToken = "";
							lastTokenTypeFound = "Keyword";
						} 	
									
					} 
					if (!tokenFound) {
						// Not keyword, check for id
						if (T_ID.test(currentChar)) {
							//lextext += "Found Token T_ID [ " + currentToken + " ] " + " at index " + currentTokenIndex +  "\n";
							if (lastTokenTypeFound != "ID") {
								lastTokenIndex = currentTokenIndex;
							}
							tokenFound = true;
							//currentToken = "";
							//lastToken = lastToken + currentToken;
							lastTokenTypeFound = "ID";
						} else {
							// Not id, check for symbol
							for (var regex in Symbols) {
								if (Symbols[regex].test(currentChar)) {
									//lastTokenIndex = currentTokenIndex;
									// If found symbol, print all last IDs
									if (lastTokenTypeFound == "ID") {
										while (lastTokenIndex < currentTokenIndex) {
											lextext += "Found Token T_ID [ " + tokens.charAt(lastTokenIndex) + " ] " + " at index " + lastTokenIndex +  "\n";
											lastTokenIndex++;
										}
										
									}
									// Check for == case
									if (Symbols[regex] == Symbols['T_ASSIGNMENT_OP']) {
										var lastChar = currentChar;
										lastTokenIndex = currentTokenIndex;
										currentTokenIndex++;
										currentToken = currentChar + tokens.charAt(currentTokenIndex);
										if (Symbols['T_EQUALS'].test(currentToken)) {
											lextext += "Found Token T_EQUALS [ " + currentToken + " ] " + " at index " + lastTokenIndex +  "\n";
											lastTokenIndex = currentTokenIndex;
											tokenFound = true;
											currentToken = "";
											lastTokenTypeFound = "Symbol";
										} else { 
											currentTokenIndex = lastTokenIndex;
											currentToken = lastToken;
										}
									}
									if (!tokenFound) {
										lextext += "Found Token " + regex + " [ " + currentChar + " ] " + " at index " + currentTokenIndex +  "\n";
										lastTokenIndex = currentTokenIndex;
										tokenFound = true;
										currentToken = "";
										lastTokenTypeFound = "Symbol";
									}
									if (Symbols[regex] == Symbols['T_EOP']) {
										lextext += "Finished program " + programCount + "\n";
										programCount++;
										if (currentTokenIndex < tokens.length - 1)
											lextext += "Lexing program " + programCount + "...\n";
									}
									
								} 
							}
							if (!tokenFound) {
								// Not symbol, check digit
								if (T_DIGIT.test(currentChar)) {
									lextext += "Found Token T_DIGIT [ " + currentChar + " ] " + " at index " + currentTokenIndex +  "\n";
									lastTokenIndex = currentTokenIndex;
									tokenFound = true;
									currentToken = "";
									lastTokenTypeFound = "Digit";
								} else {
									// check for !=
									currentToken = currentChar + tokens.charAt(currentTokenIndex+1);
									if (Symbols['T_NOT_EQUAL'].test(currentToken)) {
										lextext += "Found Token T_NOT_EQUAL [ " + currentToken + " ] " + " at index " + currentTokenIndex +  "\n";
										lastTokenIndex = currentTokenIndex;
										currentTokenIndex++;
										tokenFound = true;
										currentToken = "";
										lastTokenTypeFound = "Symbol";
									} else {
										currentToken = lastToken;
										lextext += "Invalid Token [ " + currentChar + " ] " + " at index " + currentTokenIndex + "\n";
										lexErrorFound = true;
										lexErrorCount++;
										return lextext;
									}
									
								}
							}
						}
						
					}	
									
				}
				return lextext;	
			}
				
		    }
		}
	}
	
