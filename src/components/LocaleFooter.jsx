import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import LocaleLink from '../containers/LocaleLink';
import locales from '../lib/l10n';

class LocaleFooter extends React.Component {
    render() {
        const {localeCodes} = this.props;
        const localeLinks = localeCodes.map((localeCode) => (
            <LocaleLink key={localeCode} localeCode={localeCode}>
                {locales[localeCode].name}
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
    localeCodes: PropTypes.arrayOf(
        PropTypes.string
    ).isRequired
};

const mapStateToProps = (state) => ({
    localeCodes: Object.keys(state.locales.messagesByLocale)
});

export default connect(
    mapStateToProps,
)(LocaleFooter);
