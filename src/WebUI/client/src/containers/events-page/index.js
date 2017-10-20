import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchNextEvents} from '../../actions/events-page';
import Component from '../../components/events-page';



function mapStateToProps({eventsPage}){
	return {
		events: eventsPage.events.items,
		fetching: eventsPage.events.fetching,
		error: eventsPage.events.error,
		hasMore: eventsPage.events.hasMore
	}
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({fetchNextEvents}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);