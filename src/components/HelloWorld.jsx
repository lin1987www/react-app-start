import React from 'react';
import PropTypes from 'prop-types';

class HelloWorld extends React.Component {
    render() {
        return <h1>Hello, {this.props.name}</h1>;
    }
}

HelloWorld.propTypes = {
    name: PropTypes.string.isRequired
};

export {HelloWorld as default};