import { Infix } from './infix';
import { operators, getPrecedence } from './operators';
import { AddNode, SubtractNode, MultiplyNode, DivideNode, ModuloNode, ExponentNode, OperandNode, PercentageNode } from './nodes';
import { end } from '../utils/tools';

export class Postfix{
  constructor(infix){
    if(!(infix instanceof Infix)) throw new Error('Invalid argument. Postfix() must take 1 Infix object argument');
    this.symbols = this.convert(infix.symbols);
    this.tree = this.build();
  }

  build(){
    const stack = [];
    for(let i = 0; i < this.symbols.length; i++){
      const symbol = this.symbols[i];
      if(!isNaN(symbol)) stack.push(new OperandNode(symbol)); // Operand
      else if(symbol.includes('%')){ // Percentage
        const float = parseFloat(symbol.slice(0, -1));
        stack.push(new PercentageNode(float % 1 === 0 ? parseInt(float) : float));
      }
      else{ // Operator
        const b = stack.pop();
        const a = stack.pop();
        if(symbol === '+') stack.push(new AddNode(a, b));
        else if(symbol === '-') stack.push(new SubtractNode(a, b));
        else if(symbol === '*') stack.push(new MultiplyNode(a, b));
        else if(symbol === '/') stack.push(new DivideNode(a, b));
        else if(symbol === '%') stack.push(new ModuloNode(a, b));
        else if(symbol === '^') stack.push(new ExponentNode(a, b));
      }
    }
    return stack[0]; // Root
  }

  convert(data){
    const stack = [];
    const output = [];
    for(let i = 0; i < data.length; i++){
      const symbol = data[i];
      if(!isNaN(symbol)){
        const next = i + 1 < data.length ? data[i + 1] : undefined;
        if(next === '%'){
          output.push(symbol+next); // Percentage
          i++;
        }
        else output.push(symbol); // Operand
      }
      else if(symbol === '(') stack.push(symbol); // Open bracket
      else if(symbol === ')'){ // Close bracket
        while(end(stack) !== '(') output.push(stack.pop()); // Pop all items before open bracket from stack to output
        stack.pop(); // Remove open bracket
      }
      else{ // Operator
        if(stack.length > 0){ // Proceed if stack is not empty
          // Pop items before open bracket from stack to output
          while(end(stack) !== '('){
            if(operators.includes(end(stack))){
              if(getPrecedence(end(stack)) < getPrecedence(symbol)) break; // Break if item has lower precedence
            }
            output.push(stack.pop());
            if(stack.length === 0) break; // Break if stack is empty
          }
        }
        stack.push(symbol); // Push operator to stack
      }
    }
    while(stack.length > 0) output.push(stack.pop()); // Pop all remaining items from stack to output
    return output;
  }

  toString(){
    return this.symbols.join();
  }
}