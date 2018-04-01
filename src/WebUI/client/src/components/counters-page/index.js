//@flow
import React from 'react';
import {withStyles} from 'material-ui/styles';

import CountersTop from './counters-top';
import CountersContent from './counters-content';

import type {
    CountersPageConfig,
    CountersPageGroupIntervalType,
    CountersPageGroupType,
    CountersType
} from "../../reducers/counters-page";
import type {EventsSetFilterParams} from "../../actions/events-page";


const styles = theme => ({
    root: {
        //padding: "0 18px 100px",
        //overflow: "auto",
        //["-webkit-overflow-scrolling"]: "touch",
    },
    cell: {
        position: "relative",
        padding: 8,
        textAlign: "center",
        minWidth: 62,
    },
    egCell: {
        padding: 0,
    },
    enCell: {
        padding: 16,
        backgroundColor: "#f1f1f1 !important",
    },
    groupCell: {
        position: "relative",
        padding: 0,
        textAlign: "center",
        minWidth: 62,
    },
    counterCell: {
        position: "relative",
        padding: 0,
        textAlign: "center",
        minWidth: 62,
        backgroundColor: "#f1f1f1 !important",
    },
    counterCellLink: {
        textDecoration: "none",
        color: "inherit"
    },
    counterCellLinkInner: {
        padding: 16,
        transition: "background-color 150ms",
        "&:hover": {
            backgroundColor: "#3f51b54d"
        }
    },
    groupButtonLabel: {
        fontWeight: 100,
    },
    configSelect: {
        width: 100,
        marginLeft: 16
    },
    countersPaper: {
        display: "table",
        marginTop: 16
    }
});



type CountersPageProps = {
    counters: CountersType,
    counterGroups: CountersPageGroupType[],
    counterTimes: number[],
    fetching: boolean,
    error: any,
    config: CountersPageConfig,
    classes: Object,

    updateCounters: (params: ?{
        groupInterval?: CountersPageGroupIntervalType,
        showCount?: number,
    }) => void,
    setFilter: (params?: EventsSetFilterParams) => void,
}

type CountersPageState = {
    expandedGroupName: ?string,
}

class CountersPage extends React.Component<CountersPageProps, CountersPageState> {
    props: CountersPageProps;
    state: CountersPageState;
    _t: TimeoutID;


    constructor(props) {
        super(props);
        this.state = {
            expandedGroupName: null,
        }
    }

    onIntervalChange = (event) => {
        this.props.updateCounters({groupInterval: event.target.value});
    };

    componentWillMount() {
        this.props.updateCounters();
    }

    componentWillUnmount() {
        clearTimeout(this._t);
    }

    componentWillReceiveProps(props, _) {
        if (!props.fetching && !props.error && props.counters) {
            clearTimeout(this._t);
            this._t = setTimeout(this.props.updateCounters, 1000);
        }
    }

    render() {
        return <div className={this.props.classes.root}>
            <CountersTop {...this.props}/>
            <CountersContent
                {...this.props}
                onIntervalChange={this.onIntervalChange}
            />
        </div>
    }
}


export default withStyles(styles)(CountersPage);