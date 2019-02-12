/* lexer.ts  */

module TSC
	{
	export class Lexer {
		public static lex() {
		    {
				// Creating all the RegEx for the grammar
				var allRegex = [];
				allRegex = [new RegExp('{'), 
							new RegExp('}'),
							new RegExp('[a-z]'),
							new RegExp('='),
							//new RegExp('$'),
							//new RegExp(' '),
							new RegExp('[0-9]')
				];
				var foundArray = [];

				var lextext = "Lexing program 1...\n";

				for (var i = 0; i < tokens.length; i++) {
					var tokenFound = false;
					for (var j = 0; j < allRegex.length; j++) {
						if (allRegex[j].test(tokens.charAt(i))) {
							lextext += "Found Token " + tokens.charAt(i) + "\n";
							tokenFound = true;
						}
						if (j == allRegex.length-1 && tokenFound == false) {
							lextext += "Error: Found Invalid Token " + tokens.charAt(i) + " \n";
						}
						
					}
				}
				
				return lextext;
				
		    }
		}
	}
	}
