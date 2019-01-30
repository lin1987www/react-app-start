import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl, FormattedMessage, defineMessages} from 'react-intl';
import LocaleFooter from './LocaleFooter.jsx';

const message = defineMessages({
    greeting: 'Hi, \\{{name}\\}'
});

class Greeting extends React.Component {
    render() {
        const {name, intl} = this.props; // eslint-disable-line no-unused-vars
        return (<div>
            <h1>
                <FormattedMessage
                    {...message.greeting}
                    values={{
                        name
                    }}
                />
            </h1>
            <LocaleFooter/>
        </div>);
    }
}

Greeting.propTypes = {
    name: PropTypes.string.isRequired,
    intl: PropTypes.object.isRequired
};

const WrappedGreeting = injectIntl(Greeting);

export {
    WrappedGreeting as default
};