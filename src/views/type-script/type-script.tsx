import * as React from 'react';
import * as ReactDOM from 'react-dom';

const greeting = require('./greeting.js');

interface HelloProps {
    compiler: string;
    framework: string;
}

const Hello = (props: HelloProps) => <h1>Hello from {props.compiler} and {props.framework}!</h1>;

const rootDiv = document.createElement('div');
rootDiv.setAttribute('id', 'root');
document.body.prepend(rootDiv);

function log(msg: string){
    console.log(msg);
}
// Test
log(greeting);


ReactDOM.render(
    <Hello compiler="TypeScript" framework="React"/>,
    document.getElementById('root')
);
