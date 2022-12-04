import { operators } from './operators';
import { end, mergeOperands } from '../utils/tools';

export class Infix{
  constructor(data){
    try{
      this.symbols = mergeOperands(data);
      this.check();
      this.format();
    }
    catch(e){
      console.log(e.message);
    }
  }

  check(){
    let prev = undefined;
    if(isNaN(this.symbols[0])){
       throw new Error('Invalid equation. First symbol must be a number: "' + this.symbols[0] + '" at position 0');
    }
    if(end(this.symbols) === '(' || operators.includes(end(this.symbols))){
      throw new Error('Invalid equation. Last symbol must be a number, percentage or close bracket: "' + end(this.symbols) + '" at position ' + (this.symbols.length - 1));
    }
    for(let i = 0; i < this.symbols.length; i++){
      const symbol = this.symbols[i];
      if(!isNaN(prev)){
        if(!isNaN(symbol)){
          throw new Error('Invalid equation. Number cannot be followed by another number: "' + symbol + '" at position ' + i);
        }
      } 
      else if(operators.includes(prev)){
        if(operators.includes(symbol)){
          throw new Error('Invalid equation. Operator cannot be followed by another operator: "' + symbol + '" at position ' + i);
        }
        else if(symbol === ')'){
          throw new Error('Invalid equation. Operator cannot be followed by a close bracket: "' + symbol + '" at position ' + i);
        }
      }
      else if(prev === '('){
        if(operators.includes(symbol)){
          throw new Error('Invalid equation. Open bracket cannot be followed by an operator: "' + symbol + '" at position ' + i);
        }
        else if(symbol === ')'){
          throw new Error('Invalid equation. Open bracket cannot be followed by a close bracket: "' + symbol + '" at position ' + i);
        }
      }
      else if(prev === ')'){
        if(!isNaN(symbol)){
          throw new Error('Invalid equation. Close bracket cannot be followed by a number: "' + symbol + '" at position ' + i);
        }
      }
      prev = symbol;
    }
  }
  
  format(){
    this.formatCoefficients();
  }
  
  formatCoefficients(){
    for(let i = 0; i < this.symbols.length; i++){
      let at = this.symbols[i];
      // Symbol at counter is a close bracket or an operand
      // Next symbol exists
      if(at === '(' && i > 0){
        const prev = this.symbols[i - 1];
        if(prev === '(' || !isNaN(prev)){
          this.symbols.splice(i, 0, '*'); // Insert multiply between coefficient and open bracket
          i++; // Move counter to open bracket
        }
      }
    }
  }
}