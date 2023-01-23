import { useEffect, useState } from 'react';
import Keypad from './components/Keypad';
import Screen from './components/Screen';
import { Infix } from './objects/infix';
import { Postfix } from './objects/postfix';
import { operators, getSymbol } from './objects/operators';
import { end } from './utils/tools';
// import { v4 as uuidv4 } from 'uuid';

function App() {
  const [equation, setEquation] = useState([[0]]);
  const [equations, setEquations] = useState([]);
  const [history, setHistory] = useState('0');
  const [recent, setRecent] = useState('0');
  const [completed, setCompleted] = useState(false);
  const keys = [
    {value: 'CE', color: 'yellow'}, 
    {value: '(', color: 'yellow'}, 
    {value: ')', color: 'yellow'}, 
    {value: '%', color: 'orange'}, 
    {value: 7, color: 'grey'}, 
    {value: 8, color: 'grey'}, 
    {value: 9, color: 'grey'}, 
    {value: '/', color: 'orange'},           
    {value: 4, color: 'grey'}, 
    {value: 5, color: 'grey'}, 
    {value: 6, color: 'grey'}, 
    {value: '*', color: 'orange'}, 
    {value: 1, color: 'grey'}, 
    {value: 2, color: 'grey'}, 
    {value: 3, color: 'grey'}, 
    {value: '-', color: 'orange'}, 
    {value: 0, color: 'grey'}, 
    {value: '.', color: 'grey'}, 
    {value: '=', color: 'red'}, 
    {value: '+', color: 'orange'}
  ];
  
  useEffect(() => {
    function getEquationString(equation){
      const merged = [...equation];
      for(let i = 0; i < merged.length; i++) merged[i] = merged[i] instanceof Array ? merged[i].join('') : getSymbol(merged[i]);
      return formatEquationString(merged.join(' '));
    }

    function formatEquationString(str){
      let formatted = str.replaceAll(' (', '(').replaceAll('( ', '(');
      formatted = formatted.replaceAll(' )', ')').replaceAll(') ', ')');
      formatted = formatted.replaceAll(' ^', '^').replaceAll('^ ', '^');
      return formatted.replaceAll(' %', '%');
    }

    function getOperand(){
      for(let i = equation.length - 1; i >= 0; i--){
        if(equation[i] instanceof Array) return equation[i];
      }
      return 'fail';
    }

    setHistory(completed ? getTree(end(equations)).toString() + ' =' : getEquationString(equation));
    setRecent(completed ? getEquationString(equation) : getOperand());
  }, [equation, equations, completed]);

  function setTop(top){
    const copy = [...equation];
    copy.pop();
    setEquation([...copy, top]);
    return end(equation);
  }

  function getOpenBrackets(){
    let open = 0;
    for(let i = 0; i < equation.length; i++){
      if(equation[i] === '(') open++;
      if(equation[i] === ')') open--;
    }
    return open;
  }

  function complete(){
    const top = end(equation);
    if(top instanceof Array || top === ')' || top === '%'){
      let copy = [...equation];
      // Close brackets
      const open = getOpenBrackets();
      for(let i = 0; i < open; i++) copy.push(')');

      setEquations([...equations, copy]);
      setEquation([[getAnswer(copy)]]);
      setCompleted(true);
    }
  }

  function getTree(equation){
    const infix = new Infix(equation);
    const postfix = new Postfix(infix);
    return postfix.tree;
  }

  function getAnswer(equation){
    const tree = getTree(equation);
    const answer = tree.evaluate()
    for(let i = 0; i < answer.length; i++){
      if(!isNaN(answer[i])) answer[i] = parseInt(answer[i]);
    }
    return answer;
  }

  function press(value){
    let top = end(equation);
    // Digit or decimal
    if(!isNaN(value) || value === '.'){
      if(top !== ')'){ // Can't have operand after close bracket or percentage
        if(completed){ //Overwrite with operand
          if(value === '.') top = setTop([0, value]);
          else top = setTop([value]);
        }
        else if(top instanceof Array){
          if(top.length === 1 && top[0] === 0 && value !== '.') top = setTop([value]); // Overwrite 0 operand
          else if(value !== '.' || !top.includes('.')) top = setTop([...top, value]); // Append to operand
        }
        else{ // Append operand to equation
          if(value === '.') setEquation([...equation, [0, value]]);
          else setEquation([...equation, [value]]);
        }
      }
    }
    // Remove trailing zeros
    else if(top instanceof Array){
      let decimal = top.indexOf('.'); // Index of decimal
      if(decimal !== -1){
        let zeros = top.length - 1; // Index of trailing zeros
        while(zeros > decimal && top[zeros] === 0) zeros--; // Loop until not zero
        const count = top.length - 1 - zeros; // Number of trailing zeros
        for(let i = 0; i < count; i++) top.pop(); // Pop trailing zeros
        if(end(top) === '.') top.pop(); // Pop decimal if at end
        top = setTop(top);
      }
    }

    // Percentage
    if(value === '%'){
      if(top instanceof Array) setEquation([...equation, value]);
    }

    // Operator
    if(operators.includes(value)){
      if(operators.includes(top)) top = setTop(value);
      else if(top !== '(') setEquation([...equation, value]);
    }

    // Open bracket
    if(value === '('){
      if(top !== '%') setEquation([...equation, value]);
    }

    // Close bracket
    if(value === ')'){
      // Close bracket can't come after open bracket or operator, and must close an already open bracket
      if(top !== '(' && !operators.includes(top) && getOpenBrackets() > 0){
        setEquation([...equation, value]);
      }
    }

    // CE (Clear Entry)
    if(value === 'CE'){
      let copy = [...equation];
      if(end(copy) instanceof Array){
        end(copy).pop()
        if(end(copy).length === 0) copy.pop();
      }
      else copy.pop();
      if(copy.length === 0) copy = [[0]];
      setEquation(copy);
    }

    // AC (All Clear)
    if(value === 'AC') setEquation([[0]]);
    
    // Equals
    if(value === '=') complete();
    else setCompleted(false);
  }

  // Respond to key up events
  onkeyup = function(e) {
    let key = e.key;
    if(!isNaN(key)) press(parseInt(key)); // Digits
    if(key === '.') press(key); //Decimal
    if(key === '%') press(key); // Percentage
    if(operators.includes(key)) press(key); // Operator
    if(key === 'x') press('*') // Multiply
    if(key === '(' || key === ')') press(key); // Brackets
    if(key === 'Backspace') press('CE'); // CE
    if(key === 'Delete' || key === 'Escape') press('AC'); // AC
    if(key === 'Enter' || key === '=') press('='); // Equals
  }

  return (
    <>
      <Screen history={history} recent={recent} />
      <Keypad keys={keys} press={press} />
    </>
  );
}

export default App;
