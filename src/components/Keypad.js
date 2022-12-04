import React from 'react';
import './Keypad.css';
import Key from './Key'

export default function Keypad({keys, press}) {
  return (
    <div className="keypad">
      {keys.map(key => {
        return <Key key={key.value} value={key.value} color={key.color} press={press} />;
      })}
    </div>
   );
}
