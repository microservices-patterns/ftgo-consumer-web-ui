//import React from 'react';
export const If = ({ condition, children, elseIf }) => condition ? (<>{ children }</>) : (elseIf || null);
//export const ElseIf = ({ condition, children }) => condition ? null : (<>{ children }</>);
