import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {updateCounters} from '../../actions/counters-page';
import Component from '../../components/counters-page';



function mapStateToProps({countersPage}){
	return {
		counters: countersPage.items.counters,
		counterNames: countersPage.items.counterNames,
		counterTimes: countersPage.items.counterTimes,
		fetching: countersPage.items.fetching,
		error: countersPage.items.error,
		config: countersPage.config,
	}
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({updateCounters}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);