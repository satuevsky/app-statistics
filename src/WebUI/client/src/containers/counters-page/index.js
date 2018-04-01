import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {updateCounters} from '../../actions/counters-page';
import {setFilter} from '../../actions/events-page';
import Component from '../../components/counters-page';
import type {RootState} from "../../reducers";


function mapStateToProps(state: RootState) {
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
    return bindActionCreators({updateCounters, setFilter}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);