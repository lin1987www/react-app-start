import React, {
    useState,
    useRef,
    //
    useCallback,
    //
    forwardRef,
    useImperativeHandle,
    //
    useEffect,
    /*
    useLayoutEffect,
    useMemo,
    */
} from 'react';
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';

const rootDiv = document.createElement('div');
rootDiv.setAttribute('id', 'root');
document.body.prepend(rootDiv);

function usePrevious(value) {
    const prev = useRef(null);
    useEffect(() => {
        prev.current = value;
    });
    return prev.current;
}

function NumberInput({onChange, forwardedRef}) {
    const [number, setNumber] = useState(function () {
        console.log('NumberInput useState: NumberInput');
        return 0;
    });

    // const prevNumber = useRef(null);
    // useEffect(() => {
    //     console.log('useEffect: NumberInput ' + number);
    //     prevNumber.current = number;
    // }, [number]);
    const prevNumber = usePrevious(number);

    useEffect(() => {
        console.log('NumberInput useEffect NumberInput ' + ' previous: ' + prevNumber + ' current: ' + number);
    }, [number]);

    function handleNumberChange(event) {
        const text = event.target.value;
        if (text) {
            let value = parseInt(text);
            if (value !== number) {
                setNumber(value);
            }
        }
    }

    function handleOnClick() {
        if (number) {
            onChange(number);
        }
    }

    const objectRef = useRef();
    const objectRef2 = useRef();
    const callbackRef = useCallback(node => {
        console.log('NumberInput useCallback', node);
        if (node) {
            objectRef2.current = node;
        }
        return objectRef2;
    });

    useImperativeHandle(forwardedRef, () => {
        console.log('NumberInput useImperativeHandle');
        return {
            objectRef: objectRef,
            callbackRef: callbackRef
        };
    });

    return (
        <React.Fragment>
            <label htmlFor="numberInput">Enter Number </label>
            <input
                ref={objectRef}
                id="numberInput"
                type="number"
                value={number}
                onChange={handleNumberChange}
            />
            <input
                ref={callbackRef}
                type="button"
                value="ok"
                onClick={handleOnClick}
            />
        </React.Fragment>
    );
}

NumberInput.propTypes = {
    onChange: PropTypes.func,
    forwardedRef: PropTypes.object
};

function NumberInputForwardRefWrapper(props, ref) {
    return <NumberInput {...props} forwardedRef={ref}/>;
}

const NumberInputForwardRef = forwardRef(NumberInputForwardRefWrapper);


function EvenNumber({fetchNumber, inputNumber, ref}) {
    const [number, setNumber] = useState(function () {
        return 0;
    });

    useEffect(() => {
        let n;
        if (inputNumber === undefined) {
            n = fetchNumber();
        } else {
            n = inputNumber;
        }
        setNumber(n);
        console.log('useEffect: EvenNumber ' + n);
    }, [inputNumber, fetchNumber]);

    return (
        <p ref={ref}>
            Is {number} even? {(number % 2 === 0) ? 'Yes' : 'No'}
        </p>
    );
}

EvenNumber.propTypes = {
    fetchNumber: PropTypes.func,
    inputNumber: PropTypes.number,
    ref: PropTypes.object
};


function plusOneApi(n) {
    return new Promise((resolve, reject) => {
        function finish() {
            if (n === 404) {
                reject('Error Message');
            } else {
                resolve(n + 1);
            }
        }

        setTimeout(finish, 3000);
    });
}

function NumberDetector() {
    const [inputNumber, setInputNumber] = useState(function () {
        return 0;
    });

    // update by setUpdatedTime
    const [updatedTime, setUpdatedTime] = useState(function () {
        return Date.now();
    });

    const [output, setOutput] = useState(function () {
        return {status: 'initial', value: 0};
    });

    useEffect(() => {
        let isCanceled = false;

        function handleApiEffect() {
            plusOneApi(inputNumber).then((result) => {
                if (!isCanceled) {
                    setOutput({...output, value: result, status: 'done'});
                }
            }).catch((error) => {
                setOutput({...output, value: error, status: 'error'});
            });
        }

        setOutput({...output, status: 'loading'});
        handleApiEffect();


        const timeoutId = setTimeout(() => {
            console.log('Update ' + new Date(updatedTime) + ' ' + new Date());
            setUpdatedTime(Date.now());
        }, 60 * 1000);

        return () => {
            clearTimeout(timeoutId);
            isCanceled = true;
        };
    }, [inputNumber, updatedTime]);

    function handleNumberChange(n) {
        setInputNumber(n);
        if (inputNumber !== n) {
            console.log('NumberDetector handleNumberChange: ' + n);
        }
    }

    const forwardRef = useRef();

    useEffect(() => {
        const inputButton = forwardRef.current.callbackRef().current;
        const inputNumber = forwardRef.current.objectRef.current;
        if (output.value % 2 === 0) {
            console.log('inputButton.focus()');
            inputButton.focus();
        } else {
            console.log('inputButton.focus()');
            inputNumber.focus();
        }
        console.log('NumberDetector useEffect: forwardRef.current.callbackRef().current', inputButton);
        console.log('NumberDetector useEffect: forwardRef.current.objectRef.current', inputNumber);
    });

    const ref2 = useRef();
    const callbackRef = useCallback(node => {
        console.log('NumberDetector useCallback', node);
        if (node) {
            ref2.current = node;
        }
        return ref2;
    });

    const ref3 = useRef();
    useEffect(() => {
        console.log('ref3', ref3);
    });

    return (
        <React.Fragment>
            <div ref={callbackRef}>
                {output.status}
            </div>
            <div>
                <NumberInputForwardRef ref={forwardRef} onChange={handleNumberChange}/>
            </div>
            <div>
                <EvenNumber ref={ref3} inputNumber={output.value}/>
            </div>
        </React.Fragment>
    );
}

NumberDetector.propTypes = {};


ReactDOM.render(
    <NumberDetector/>,
    document.getElementById('root')
);