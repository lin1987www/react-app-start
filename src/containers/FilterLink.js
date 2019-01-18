import {connect} from 'react-redux';
import Link from '../components/Link.jsx';
import {setVisibilityFilter} from '../reducers';
import PropTypes from 'prop-types';

const mapStateToProps = (state, ownProps) => ({
    active: ownProps.filter === state.visibilityFilter
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onClick: () => dispatch(setVisibilityFilter(ownProps.filter))
});

const FilterLink = connect(
    mapStateToProps,
    mapDispatchToProps
)(Link);

FilterLink.propTypes = {
    filter: PropTypes.string.isRequired
};

export default FilterLink;