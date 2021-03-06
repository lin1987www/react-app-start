import React from 'react';
import Footer from './Footer.jsx';
import AddTodo from '../containers/AddTodo.jsx';
import VisibleTodoList from '../containers/VisibleTodoList';

class App extends React.Component {
    render() {
        return (
            <div>
                <AddTodo/>
                <VisibleTodoList/>
                <Footer/>
            </div>
        );
    }
}

export default App;
