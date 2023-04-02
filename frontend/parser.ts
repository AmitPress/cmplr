import {
    Expr,
    BinaryExpr,
    Identifier,
    NumericalLiteral,
    Program,
    Stmt
} from './ast.ts'

import {
    Token,
    tokenize,
    TokenType
} from './lexer.ts'

export default class Parser {
    private tokens: Token[] = []

    // helper functions
    private not_eof(): boolean {
        return this.tokens[0].type != TokenType.EOF
    }
    private at(){
        return this.tokens[0] as Token
    }
    private eat(){
        const prev = this.tokens.shift() as Token
        return prev
    }
    private expect(type: TokenType, err: any){
        const prev = this.tokens.shift() as Token
        if(!prev || prev.type != type){
            console.error("Parser Error:\n", err, prev, "- Expecting: ", type);
            Deno.exit(1)
        }
        return prev
    }

    public produceAST(sourceCode: String): Program{
        this.tokens = tokenize(sourceCode)

        const program: Program = {
            kind: "Program",
            body: []
        }

        while(this.not_eof()){
            program.body.push(this.parse_stmt())
        }
        return program
    }

    private parse_stmt(): Stmt {
        return this.parse_expr()
    }

    private parse_expr(): Expr {
        return this.parse_additive_expr()
    }

    private parse_additive_expr():Expr{
        let left = this.parse_multiplicative_expr()
        while(this.at().value == "+" || this.at().value == "-"){
            const operator = this.eat().value
            const right = this.parse_multiplicative_expr()
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator
            } as BinaryExpr;
        }
        return left
    }

    private parse_multiplicative_expr():Expr{
        let left = this.parse_primary_expr()
        while(
            this.at().value == "/" || this.at().value == "*" || this.at().value == "%"
        ){
            const operator = this.eat().value
            const right = this.parse_primary_expr()
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator
            } as BinaryExpr
        }
        return left
    }
    private parse_primary_expr(): Expr{
        const tk = this.at().type 
        switch(tk){
            case TokenType.Identifier:
                return { kind: "Identifier", symbol: this.eat().value} as Identifier
            
            case TokenType.Number:
                return {
                    kind: "NumericalLiteral",
                    value: parseFloat(this.eat().value)
                } as NumericalLiteral
            case TokenType.OpenParen:{
                this.eat()
                const value = this.parse_expr()
                this.expect(
                    TokenType.CloseParen,
                    "Unexpected"
                )
                return value
            }
            default:
                console.error("Unexpected token at", this.at());
                Deno.exit(1)
                
        }
    }
}
