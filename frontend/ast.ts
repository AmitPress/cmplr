export type NodeType =
    | "Program"
    | "NumericalLiteral"
    | "Identifier"
    | "BinaryExpr"

export interface Stmt {
    kind: NodeType
}

export interface Program extends Stmt {
    kind: "Program"
    body: Stmt[]
}

export interface Expr extends Stmt {}

export interface BinaryExpr extends Expr {
    kind: "BinaryExpr"
    left: Expr 
    right: Expr 
    operator: String
}

export interface Identifier extends Expr {
    kind: "Identifier"
    symbol: String
}

export interface NumericalLiteral extends Expr {
    kind: "NumericalLiteral"
    value: Number
}