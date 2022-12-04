import { getSymbol } from "./operators";

export class ExpressionNode{
  constructor(left, right, precedence){
    this.left = left;
    this.right = right;
    this.parent = undefined;
    this.precedence = precedence
    left.parent = left instanceof ExpressionNode ? this : undefined;
    right.parent = right instanceof ExpressionNode ? this : undefined;
  }
}

export class AddNode extends ExpressionNode{
  constructor(left, right){
    super(left, right, 1);
  }

  evaluate(){
    const evaluation = this.left.evaluate() + this.right.evaluate();
    return evaluation % 1 === 0 ? parseInt(evaluation) : evaluation;
  }

  toString(){
    const content = this.left.toString() + ' + ' + this.right.toString();
    return this.parent === undefined || this.parent.precedence === this.precedence ? content : '(' + content + ')';
  }
}

export class SubtractNode extends ExpressionNode{
  constructor(left, right){
    super(left, right, 1);
  }

  evaluate(){
    const evaluation = this.left.evaluate() - this.right.evaluate();
    return evaluation % 1 === 0 ? parseInt(evaluation) : evaluation;
  }

  toString(){
    const content = this.left.toString() + ' - ' + this.right.toString();
    return this.parent === undefined || this.parent.precedence === this.precedence ? content : '(' + content + ')';
  }
}

export class MultiplyNode extends ExpressionNode{
  constructor(left, right){
    super(left, right, 2);
  }

  evaluate(){
    const evaluation = this.left.evaluate() * this.right.evaluate();
    return evaluation % 1 === 0 ? parseInt(evaluation) : evaluation;
  }

  toString(){
    const content = this.left.toString() + ' ' + getSymbol('*') +' ' + this.right.toString();
    return this.parent === undefined || this.parent instanceof MultiplyNode ? content : '(' + content + ')';
  }
}

export class DivideNode extends ExpressionNode{
  constructor(left, right){
    super(left, right, 2);
  }

  evaluate(){
    const evaluation = parseFloat(this.left.evaluate()) / parseFloat(this.right.evaluate());
    return evaluation % 1 === 0 ? parseInt(evaluation) : evaluation;
  }

  toString(){
    const content = this.left.toString() + ' ' + getSymbol('/') +' ' + this.right.toString();
    return this.parent === undefined || this.parent instanceof DivideNode ? content : '(' + content + ')';
  }
}

export class ModuloNode extends ExpressionNode{
  constructor(left, right){
    super(left, right, 2);
  }

  evaluate(){
    const evaluation = this.left.evaluate() % this.right.evaluate();
    return evaluation % 1 === 0 ? parseInt(evaluation) : evaluation;
  }

  toString(){
    const content = this.left.toString() + ' modulo ' + this.right.toString();
    return this.parent === undefined ? content : '(' + content + ')';
  }
}

export class ExponentNode extends ExpressionNode{
  constructor(left, right){
    super(left, right, 3);
  }

  evaluate(){
    const evaluation = this.left.evaluate() ** this.right.evaluate();
    return evaluation % 1 === 0 ? parseInt(evaluation) : evaluation;
  }

  toString(){
    const content = this.left.toString() + '^' + this.right.toString();
    return this.parent === undefined ? content : '(' + content + ')';
  }
}

export class OperandNode{
  parent = undefined;
  
  constructor(value){
    this.value = value;
  }
  
  evaluate(){
    return this.value;
  }

  toString(){
    return this.value.toString();
  }
}

// This is beautiful code
export class PercentageNode extends OperandNode{
  evaluate(){
    return this.value / 100.0;
  }

  toString(){
    return this.value + '%';
  }
}