import {connect} from 'react-redux';
import Link from '../components/Link.jsx';
import {selectLocale} from '../reducers/locales';
import PropTypes from 'prop-types';

const mapStateToProps = (state, ownProps) => ({
    active: ownProps.localeCode === state.locales.locale
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onClick: () => dispatch(selectLocale(ownProps.localeCode))
});

const LocaleLink = connect(
    mapStateToProps,
    mapDispatchToProps
)(Link);

LocaleLink.propTypes = {
    localeCode: PropTypes.string.isRequired
};

export default LocaleLink;