export const operators = ['+', '-', '*', '/', '^'];
export const symbols = [{value: '*', symbol: '\u00d7'}, {value: '/', symbol: '\u00f7'}];

export function getPrecedence(char){
  if(char === '+') return 1;
  if(char === '-') return 1;
  if(char === '*') return 2;
  if(char === '/') return 2;
  if(char === '^') return 3;
  throw new Error('"' + char + '" is not an operator');
}

export function getSymbol(char){
  for(let i = 0; i < symbols.length; i++){
    if(char === symbols[i].value) return symbols[i].symbol;
  }
  return char;
}