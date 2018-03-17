import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {updateCounters} from '../../actions/counters-page';
import Component from '../../components/counters-page';
import type {State} from "../../reducers";


function mapStateToProps(state: State) {
    let countersPage = state.countersPage;

    return {
        counters: countersPage.items.counters,
        counterGroups: countersPage.items.counterGroups,
        counterTimes: countersPage.items.counterTimes,
        fetching: countersPage.items.fetching,
        error: countersPage.items.error,
        config: countersPage.config,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({updateCounters}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);