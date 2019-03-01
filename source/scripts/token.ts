/* token.ts  
Brandon Litwin
CMPT 432 - Compilers
Project 1

This is the token object
*/
module TSC {
    export class Token {
        type: any;
        value: any;
        lineNumber: number;
        index: number;

        constructor(type: any, value: any, lineNumber: number, index: number) {
            this.type = type;
            this.value = value;
            this.lineNumber = lineNumber;
            this.index = index;
        }
    }

}