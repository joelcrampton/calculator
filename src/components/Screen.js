import React from 'react';
import './Screen.css';

export default function Screen({history, recent}) {
  return (
    <div className="screen">
        <span>{history}</span>
        <span>{recent}</span>
    </div>
  );
}
