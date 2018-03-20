//@flow
import React from 'react';
import {withStyles} from 'material-ui/styles';
import {indigo} from 'material-ui/colors';
import {CircularProgress} from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
import Table, {TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Select from 'material-ui/Select';
import Button from 'material-ui/Button';
import {MenuItem} from 'material-ui/Menu';
import {FormControl} from 'material-ui/Form';
import ExpandMore from 'material-ui-icons/ExpandMore';

import type {
    CountersPageConfig,
    CountersPageGroupIntervalType,
    CountersPageGroupType,
    CountersType
} from "../../reducers/counters-page";
import moment from 'moment';


let configIntervals = {
    keys: ["m", "h", "D", "W", "M", "Y"],
    values: {
        "m": {display: "Minute"},
        "h": {display: "Hour"},
        "D": {display: "Day"},
        "W": {display: "Week"},
        "M": {display: "Month"},
        "Y": {display: "Year"}
    },
};


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
        padding: 8,
        textAlign: "center",
        minWidth: 62,
    },
    counterCell: {
        position: "relative",
        padding: 8,
        textAlign: "center",
        minWidth: 62,
        backgroundColor: "#f1f1f1 !important",
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

    renderTop() {
        if (this.props.error) {
            return <Typography variant="subheading" color="error">Failed to retrieve data!</Typography>
        }
        if (this.props.fetching) {
            return <CircularProgress size={32}/>
        }
    }

    renderConfig() {
        return <FormControl>
            <Select
                className={this.props.classes.configSelect}
                value={this.props.config.groupInterval}
                renderValue={value => configIntervals.values[value].display}
                onChange={this.onIntervalChange}
            >
                {configIntervals.keys.map(t => <MenuItem key={t}
                                                         value={t}>{configIntervals.values[t].display}</MenuItem>)}
            </Select>
        </FormControl>
    }

    renderCounters() {
        let {counters, counterGroups, counterTimes, config, classes} = this.props,
            {groupInterval, showCount} = config,
            rows = [],
            self = this;

        counterGroups.forEach(group => {
            let isWithoutGroup = group.name === "__without_groups",
                expandedGroup = isWithoutGroup;

            if (!isWithoutGroup) {
                rows.push(renderItem({
                    name: group.name,
                    values: group.values,
                    maxValue: group.maxValue,
                    isGroup: true,
                }));
                expandedGroup = this.state.expandedGroupName === group.name;
            }

            if (expandedGroup) {
                group.items.forEach(counterName => {
                    let counter = counters[counterName] || {};
                    rows.push(renderItem({
                        name: counterName,
                        values: counter.values || {},
                        maxValue: counter.maxValue || 0,
                        isGroup: false,
                    }));
                });
                if (!isWithoutGroup) {
                    rows.push(
                        <tr key={group.name + ":tr"}>
                            <td style={{height: 8}} colSpan={999}/>
                        </tr>
                    )
                }
            }
        });

        function renderItem({name, values, maxValue, isGroup}) {
            return <TableRow key={name}>
                <TableCell className={isGroup ? classes.egCell : classes.enCell}>
                    {
                        !isGroup
                            ? name
                            : <Button
                                fullWidth
                                size="small"
                                style={{height: 48}}
                                classes={{
                                    label: classes.groupButtonLabel,
                                }}
                                onClick={() => self.setState({
                                    expandedGroupName: self.state.expandedGroupName !== name ? name : null
                                })}
                            >
                                {name}
                                <ExpandMore/>
                            </Button>
                    }
                </TableCell>
                {
                    counterTimes.map(tg => {
                        const value = values[tg] || 0,
                            percent = Math.round(value / maxValue * 100) * 0.95,
                            percent2 = Math.min(percent + 12, 100);
                        return <TableCell
                            key={tg}
                            className={isGroup ? classes.groupCell : classes.counterCell}
                            style={{background: `linear-gradient(to top, ${indigo["100"]} ${percent}%, rgba(255,255,255,0) ${percent2}%)`}}
                        >
                            {value}
                        </TableCell>
                    })
                }
            </TableRow>
        }
        function renderTime(ts, groupInterval) {
            ts = ts * 1000;
            switch (groupInterval) {
                case "m":
                    return moment(ts).calendar(null, {sameDay: "LT"});
                case "h":
                    return moment(ts).calendar(null, {sameDay: "LT"});
                case "D":
                    return moment(ts).format("L");
                case "W":
                    return moment(ts).format("L");
                case "M":
                    return moment(ts).format("MMMM YYYY");
                case "Y":
                    return moment(ts).format("YYYY");
            }
        }

        return <div>
            {this.renderConfig()}
            <Paper className={classes.countersPaper}><Table>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.groupCell}>Counter Names</TableCell>
                        {
                            counterTimes.map((ct) => {
                                return <TableCell
                                    key={ct}
                                    className={classes.cell}
                                    dangerouslySetInnerHTML={{__html: renderTime(ct, groupInterval)}}
                                />
                            })
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows}
                </TableBody>
            </Table></Paper>
        </div>
    }

    render() {
        return <div className={this.props.classes.root}>
            {this.props.error || (this.props.fetching && !this.props.counters) ?
                this.renderTop()
                :
                this.renderCounters()
            }
        </div>
    }
}


export default withStyles(styles)(CountersPage);