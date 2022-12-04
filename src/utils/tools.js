export function end(arr){
  if(arr instanceof Array){
    if(arr.length > 0) return arr[arr.length - 1];
    return undefined;
  }
  throw new Error('Argument is not of type Array');
}

export function mergeOperands(equation){
  for(let i = 0; i < equation.length; i++){
    if(equation[i] instanceof Array){
      const float = parseFloat(equation[i].join(''));
      equation[i] = float % 1 === 0 ? parseInt(float) : float;
    }
  }
  return equation
}