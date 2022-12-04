import React from 'react';
import './Key.css';
import { getSymbol } from '../objects/operators';

export default function Key({value, color, press}) {
  return (
    <div className={'key ' + color} onClick={() => press(value)}>{getSymbol(value)}</div>
  );
}
