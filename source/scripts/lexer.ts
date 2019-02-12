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
							new RegExp('\$'),
							new RegExp('\s'),
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
							new RegExp('!='),
							new RegExp('\\"'),
							new RegExp('\\/*'),
							new RegExp('\\*/'),
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
