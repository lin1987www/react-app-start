import React from 'react';
import ReactDOM from 'react-dom';
import HelloWorld from '../components/hello-world.jsx';
import './index.css';

ReactDOM.render(
    <HelloWorld name="world!" /> ,
    document.getElementById('root')
);

