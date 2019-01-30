import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import LocaleLink from '../containers/LocaleLink';
import locales from '../lib/l10n';

class LocaleFooter extends React.Component {
    render() {
        const {localeNames} = this.props;
        const localeLinks = localeNames.map((localeName) => (
            <LocaleLink key={localeName} locale={localeName}>
                {locales[localeName].name}
            </LocaleLink>
        ));
        return (
            <div>
                <span>Show: </span>{localeLinks}
            </div>
        );
    }
}

LocaleFooter.propTypes = {
    localeNames: PropTypes.arrayOf(
        PropTypes.string
    ).isRequired
};

const mapStateToProps = (state) => ({
    localeNames: Object.keys(state.locales.messagesByLocale)
});

export default connect(
    mapStateToProps,
)(LocaleFooter);
