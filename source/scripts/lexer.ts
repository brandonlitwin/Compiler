/* lexer.ts  */

module TSC
	{
	export class Lexer {
		public static lex() {
		    {
				// Creating all the RegEx for the grammar
				var Keywords = {
					T_PRINT: new RegExp('print'),
					T_WHILE: new RegExp('while'),
					T_IF: new RegExp('if'),
					T_INT: new RegExp('int'),
					T_STRING: new RegExp('string'),
					T_BOOLEAN: new RegExp('boolean'),
					T_TRUE: new RegExp('true'),
					T_FALSE: new RegExp('false')
				};
				var Symbols = {
					T_L_BRACE: new RegExp('{'), 
					T_R_BRACE: new RegExp('}'),
					T_EOP: new RegExp('\\$'),
					T_SPACE: new RegExp('\\s'),
					T_ADDITION_OP: new RegExp('\\+'),
					T_L_PAREN: new RegExp('\\('),
					T_R_PAREN: new RegExp('\\)'),
					T_EQUALS: new RegExp('=='),
					T_NOT_EQUAL: new RegExp('!='),
					T_ASSIGNMENT_OP: new RegExp('^=$'),
					T_QUOTE: new RegExp('^\\"$'),
					T_BEGIN_COMMENT: new RegExp('\\/\\*'),
					T_END_COMMENT: new RegExp('\\*\\/'),
				};

				var T_ID = new RegExp('[a-z]');
				var T_DIGIT = new RegExp('[0-9]');

				// Lex hierarchy:
				// 1. Keyword
				// 2. ID
				// 3. Symbol
				// 4. Digit
				// 5. Char
				/* 
				Lexer TODO: Option to switch on verbose mode.
				*/

				var lextext = "Lexing program 1...\n";
				for (currentTokenIndex; currentTokenIndex < tokens.length; currentTokenIndex++) {
					var tokenFound = false;
					var currentChar = tokens.charAt(currentTokenIndex);
					// Warning if EOP not found at last token
					if ((currentTokenIndex == tokens.length-1) && currentChar != '$') {
						tokens += "$";
						warningText += "Warning: No EOP Token [$] Found in program " + programCount + ". Added to the end of program.\n";
					}
					currentToken = currentToken + currentChar;
					currentToken = currentToken.trim();
					// Check for keyword
					for (var regex in Keywords) {
						if (Keywords[regex].test(currentToken)) {
							// Separate the keyword from the rest of the token being reviewed
							var keywordStart = currentToken.search(Keywords[regex]) + lastTokenIndex;
							var keywordStartFromCurrent = keywordStart - lastTokenIndex;
							// If found keyword, print all last IDs
							if (lastTokenTypeFound == "ID") {
								while (lastTokenIndex < keywordStart) {
									if (!lexErrorFound)
										lextext += "Found Token T_ID [ " + tokens.charAt(lastTokenIndex) + " ] " + " at index " + lastTokenIndex +  "\n";
									lastTokenIndex++;
								}
								currentToken = currentToken.substring(keywordStartFromCurrent);
							}
							if (!lexErrorFound)
								lextext += "Found Token " + regex + " [ " + currentToken + " ] " + " at index " + keywordStart +  "\n";
							lastTokenIndex = keywordStart - 1;
							tokenFound = true;
							currentToken = "";
							lastTokenTypeFound = "Keyword";
						} 	
									
					} 
					if (!tokenFound) {
						// Not keyword, check for id
						if (T_ID.test(currentChar)) {
							if (lastTokenTypeFound != "ID") {
								lastTokenIndex = currentTokenIndex;
							}
							tokenFound = true;
							lastTokenTypeFound = "ID";
						} else {
							// Not id, check for symbol
							for (var regex in Symbols) {
								if (Symbols[regex].test(currentChar)) {
									// If found symbol, print all last IDs
									if (lastTokenTypeFound == "ID") {
										var keywordFound = false;
										while (lastTokenIndex < currentTokenIndex) {
											// Check if the current list of IDs contains a keyword
											var currentTokens = tokens.substring(lastTokenIndex, currentTokenIndex);
											for (var K_regex in Keywords) {
												if (Keywords[K_regex].test(currentTokens) && !lexErrorFound) {
													lextext += "Found Token " + K_regex + " [ " + currentTokens + " ] " + " at index " + lastTokenIndex +  "\n";
													keywordFound = true;
												}
											}
											if (!lexErrorFound && !keywordFound) {
												lextext += "Found Token T_ID [ " + tokens.charAt(lastTokenIndex) + " ] " + " at index " + lastTokenIndex +  "\n";
											}
											lastTokenIndex++;
										}
										
									}
									// Check for == case
									if (Symbols[regex] == Symbols['T_ASSIGNMENT_OP']) {
										lastTokenIndex = currentTokenIndex;
										currentTokenIndex++;
										currentToken = currentChar + tokens.charAt(currentTokenIndex);
										if (Symbols['T_EQUALS'].test(currentToken)) {
											if (!lexErrorFound)
												lextext += "Found Token T_EQUALS [ " + currentToken + " ] " + " at index " + lastTokenIndex +  "\n";
											lastTokenIndex = currentTokenIndex;
											tokenFound = true;
											currentToken = "";
											lastTokenTypeFound = "Symbol";
										} else { 
											currentTokenIndex = lastTokenIndex;
										}
									}
									// Now print the symbol
									if (!tokenFound) {
										if (!lexErrorFound)
											lextext += "Found Token " + regex + " [ " + currentChar + " ] " + " at index " + currentTokenIndex +  "\n";
										lastTokenIndex = currentTokenIndex;
										tokenFound = true;
										currentToken = "";
										lastTokenTypeFound = "Symbol";
									}
									// If EOP is found, assume program is finished
									if (Symbols[regex] == Symbols['T_EOP']) {
										lextext += "Finished program " + programCount + "\n";
										lexErrorFound = false;
										programCount++;
										if (currentTokenIndex < tokens.length - 1)
											lextext += "Lexing program " + programCount + "...\n";
									}
									
								} 
							}
							if (!tokenFound) {
								// Not a symbol, check if it's a digit
								if (T_DIGIT.test(currentChar)) {
									//If found keyword, print all last IDs
									if (lastTokenTypeFound == "ID") {
										var keywordFound = false;
										while (lastTokenIndex < currentTokenIndex) {
											// Check if the current list of ids contains a keyword
											var currentTokens = tokens.substring(lastTokenIndex, currentTokenIndex);
											for (var K_regex in Keywords) {
												if (Keywords[K_regex].test(currentTokens) && !lexErrorFound) {
													lextext += "Found Token " + K_regex + " [ " + currentTokens + " ] " + " at index " + lastTokenIndex +  "\n";
													keywordFound = true;
												}
											}
											if (!lexErrorFound && !keywordFound) {
												lextext += "Found Token T_ID [ " + tokens.charAt(lastTokenIndex) + " ] " + " at index " + lastTokenIndex +  "\n";
											}
											lastTokenIndex++;
										}
										
									}
									// Now print the digit
									if (!lexErrorFound)
										lextext += "Found Token T_DIGIT [ " + currentChar + " ] " + " at index " + currentTokenIndex +  "\n";
									lastTokenIndex = currentTokenIndex;
									tokenFound = true;
									currentToken = "";
									lastTokenTypeFound = "Digit";
									
								} else {
									// check for !=
									currentToken = currentChar + tokens.charAt(currentTokenIndex+1);
									if (Symbols['T_NOT_EQUAL'].test(currentToken)) {
										if (!lexErrorFound)
											lextext += "Found Token T_NOT_EQUAL [ " + currentToken + " ] " + " at index " + currentTokenIndex +  "\n";
										lastTokenIndex = currentTokenIndex;
										currentTokenIndex++;
										tokenFound = true;
										currentToken = "";
										lastTokenTypeFound = "Symbol";
									} else {
										// Check for comments
										currentToken = currentChar + tokens.charAt(currentTokenIndex+1);
										if (Symbols['T_BEGIN_COMMENT'].test(currentToken)) {
											// If you find the start comment token, keep looking for the end comment token
											var startCommentIndex = currentTokenIndex;
											var EOPFound = false;
											while (!Symbols['T_END_COMMENT'].test(currentToken) && currentTokenIndex < tokens.length-1 && !EOPFound) {
												currentChar = tokens.charAt(currentTokenIndex);
												currentToken = currentChar + tokens.charAt(currentTokenIndex+1);
												if (Symbols['T_EOP'].test(currentToken)) {
													lexErrorCount++;
													lexErrorFound = true;
													EOPFound = true;
													lextext += "Error: Missing End Comment [*/] for Comment beginning on line " + startCommentIndex + "\n";
													lextext += "Compilation of program " + programCount + " stopped due to a Lexer error\n";
													errorText = "Compilation failed! " + lexErrorCount + " Lex errors found!\n";
												} else
													currentTokenIndex++;
											}
											// In case there is no EOP token
											if (currentTokenIndex == tokens.length-1) {
												lexErrorCount++;
												lexErrorFound = true;
												lextext += "Error: Missing End Comment [*/] for Comment beginning on line " + startCommentIndex + "\n";
												lextext += "Compilation of program " + programCount + " stopped due to a Lexer error\n";
												errorText = "Compilation failed! " + lexErrorCount + " Lex errors found!\n";
											}
										}
										currentToken = currentChar + tokens.charAt(currentTokenIndex);
										if (Symbols['T_END_COMMENT'].test(currentToken)) {
											currentToken = "";
										} else {
											// No other errors and no valid tokens found yet. This must be an invalid token.
											if (!lexErrorFound) {
												lextext += "Invalid Token [ " + currentChar + " ] " + " at index " + currentTokenIndex + "\n";
												lexErrorFound = true;
												lexErrorCount++;
												lextext += "Compilation of program " + programCount + " stopped due to a Lexer error\n";
												errorText = "Compilation failed! " + lexErrorCount + " Lex errors found!\n";
											}	
										}
									
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
	
