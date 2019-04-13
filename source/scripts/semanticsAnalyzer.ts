/* semanticsAnalyzer.ts
Brandon Litwin
CMPT 432 - Compilers
Project 3
*/

module TSC {
    export class SemanticsAnalyzer {
        static semantictext: string;
        static semanticErrorCount: number = 0;
        static ast
        public static analyze(ast) {
            this.ast = ast;
            console.log(ast);
            return ast;

        }
    }
}