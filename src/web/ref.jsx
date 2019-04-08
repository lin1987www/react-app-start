import React from 'react';
import ReactDOM from "react-dom";

// eslint-disable-next-line no-unused-vars
function CustomTextInput(props) {
    // textInput must be declared here so the ref can refer to it
    let textInput = React.createRef();
    let textInput2 = React.createRef();
    let textInput3;

    let setTextInput3Ref = element => {
        textInput3 = element;
    };

    function handleClick() {
        textInput.current.focus();
    }

    function handleClick2() {
        textInput2.current.focus();
    }

    function handleClick3() {
        textInput3.focus();
    }


    return (
        <React.Fragment>
            <div>
                <input
                    type="text"
                    ref={textInput}/>
                <input
                    type="button"
                    value="Focus the text input"
                    onClick={handleClick}
                />
            </div>
            <div>
                <input
                    type="text"
                    ref={textInput2}/>
                <input
                    type="button"
                    value="Focus the text input"
                    onClick={handleClick2}
                />
            </div>
            <div>
                <input
                    type="text"
                    ref={setTextInput3Ref}/>
                <input
                    type="button"
                    value="Focus the text input"
                    onClick={handleClick3}
                />
            </div>
        </React.Fragment>
    );
}

CustomTextInput.propTypes = {};

const rootDiv = document.createElement('div');
rootDiv.setAttribute('id', 'root');
document.body.prepend(rootDiv);

ReactDOM.render(
    <CustomTextInput/>,
    document.getElementById('root')
);