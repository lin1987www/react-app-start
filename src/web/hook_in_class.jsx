import React, {
    useState,
    // useRef,
    //
    // useCallback,
    //
    // forwardRef,
    // useImperativeHandle,
    //
    useEffect,
    /*
    useLayoutEffect,
    useMemo,
    */
} from 'react';
import ReactDOM from "react-dom";
//import PropTypes from 'prop-types';

const rootDiv = document.createElement('div');
rootDiv.setAttribute('id', 'root');
document.body.prepend(rootDiv);

function useDocumentTitle({title}) { // eslint-disable-line
    let [ pos, setPos ] = useState({ x: 0, y: 0 });  // eslint-disable-line
    useEffect(() => {
        document.title = title;
    }, [title]);
    return <div>{title}</div>;
}

function DocumentTitle({title}) {
    return useDocumentTitle({title});
}

class Dashboard extends React.Component {
    render() {
        return (
            <React.Fragment>
                <DocumentTitle title="Dashboard"/>
                <div>
                    {/* etc. */}
                </div>
            </React.Fragment>
        );
    }
}

ReactDOM.render(
    <Dashboard/>,
    document.getElementById('root')
);