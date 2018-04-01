//@flow
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {allowUpdating, clearEvents, fetchNewEvents, fetchNextEvents} from '../../actions/events-page';
import Component from '../../components/events-page';
import type {RootState} from "../../reducers";


function mapStateToProps(state: RootState) {
    let {eventsPage} = state;

    return {
        events: eventsPage.events.items,
        fetching: eventsPage.events.fetching,
        error: eventsPage.events.error,
        hasMore: eventsPage.events.hasMore,
        allowUpdating: eventsPage.config.allowUpdating,
        filter: eventsPage.config.filter,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        clearEvents,
        allowUpdating,
        fetchNewEvents,
        fetchNextEvents,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);