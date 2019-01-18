import React from 'react';
import {connect} from 'react-redux';
import {addTodo} from '../reducers';
import PropTypes from 'prop-types';

class AddTodo extends React.Component {
    constructor(props) {
        super(props);
        this.input = React.createRef();
    }

    render() {
        const {dispatch} = this.props;

        return (
            <div>
                <form onSubmit={e => {
                    e.preventDefault();
                    if (!this.input.current.value.trim()) {
                        return;
                    }
                    dispatch(addTodo(this.input.current.value));
                    this.input.current.value = '';
                }}>
                    <input ref={this.input}/>
                    <button type="submit">
                        Add Todo
                    </button>
                </form>
            </div>
        );
    }
}

AddTodo.propTypes = {
    dispatch: PropTypes.func.isRequired
};

export default connect()(AddTodo);