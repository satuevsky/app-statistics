import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setFilter} from '../../actions/events-page';
import Component from '../../components/main';


function mapStateToProps() {
    return null
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        setFilter
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);