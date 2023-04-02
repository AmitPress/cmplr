// objective is to get 
export enum TokenType {
    Number,
    Identifier,
    Equals,
    Let,
    OpenParen,
    CloseParen,
    BinaryOperator,
    EOF
}
export const KEYWORDS: Record<string, TokenType> = {
    let: TokenType.Let
}
export interface Token {
    value: string,
    type: TokenType
}

export const token = (value="", type:TokenType): Token => {
    return {value, type}
}

const isAlpha = (src: string): Boolean => {
    return src.toUpperCase() != src.toLowerCase()
}
const isInt = (str: string): Boolean => {
    const c = str.charCodeAt(0)
    const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)]
    return (c >= bounds[0], c <= bounds[1])
}
const isSkippable = (str: string): Boolean => {
    return (str == '\n' || str == ' ' || str == '\t')
}
export const tokenize = (sourceCode: string): Token[] => {
    const tokens = new Array<Token>()
    const src = sourceCode.split("")

    // build each token until end of file
    while(src.length > 0){
        switch(src[0]){
            case '(': 
                tokens.push(token(src.shift(), TokenType.OpenParen))
                break
            case ')': 
                tokens.push(token(src.shift(), TokenType.CloseParen))
                break
            case '+':
            case '-':
            case '*':
            case '/':
                tokens.push(token(src.shift(), TokenType.OpenParen))
                break
            case 'let': 
                tokens.push(token(src.shift(), TokenType.OpenParen))
                break
            case '=': 
                tokens.push(token(src.shift(), TokenType.OpenParen))
                break
            case '(': 
                tokens.push(token(src.shift(), TokenType.OpenParen))
                break
            // handling multicharecter tokens
            default:
                if(isInt(src[0])){
                    let num = ''
                    while(src.length>0 && isInt(src[0])){
                        num += src.shift()
                    }
                    tokens.push(token(num, TokenType.Number))
                }
                else if(isAlpha(src[0])){
                    let ident = ''
                    while(src.length>0 && isAlpha(src[0])){
                        ident += src.shift()
                    }
                    // lookup identifier

                    const reserve = KEYWORDS[ident]
                    if(reserve){
                        tokens.push(token(ident, reserve))
                    }else{
                        tokens.push(token(ident, TokenType.Identifier))
                    }

                }
                else if(isSkippable(src[0])){
                    src.shift()
                }
                else {
                    console.log(`Unrecognized charecter '${src[0]}'`)
                    Deno.exit(1)
                }
            
        }
    }
    return tokens
}

// inputting

const source = await Deno.readTextFile('./test.txt')

for(const token of tokenize(source)){
    console.log(token);
    
}