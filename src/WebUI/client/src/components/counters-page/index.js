//@flow
import React from 'react';
import {withStyles} from 'material-ui/styles';
import {indigo} from 'material-ui/colors';
import {CircularProgress} from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
import Table, {TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Select from 'material-ui/Select';
import {MenuItem} from 'material-ui/Menu';
import {FormControl} from 'material-ui/Form';
import {d, h, m} from '../../constants/counters-page';
import type {CountersPageConfig, CountersPageGroupIntervalType, CountersType} from "../../reducers/counters-page";


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
    enCell: {
        padding: 16,
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

function renderTime(ts, groupInterval) {
    let now = new Date(),
        date = new Date(ts * 1000),
        fmt = {};

    if (groupInterval < m)
        fmt.second = "numeric";
    if (groupInterval < d) {
        fmt.minute = "numeric";
        fmt.hour = "numeric";
        if (now.getDate() !== date.getDate() || now - date > d * 1000) {
            fmt.day = "numeric";
            fmt.month = "numeric";
            fmt.year = "numeric";
        }
    } else {
        fmt.day = "numeric";
        fmt.month = "numeric";
        fmt.year = "numeric";
    }
    return date.toLocaleString("ru", fmt).replace(',', '</br>');
}


type CountersPageProps = {
    counters: CountersType,
    counterNames: string[],
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

class CountersPage extends React.Component<CountersPageProps> {
    props: CountersPageProps;
    _t: TimeoutID;
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
            {/*<InputLabel htmlFor="age-simple">Age</InputLabel>*/}
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
        /*if(!this.props.counters.length){
            return <Typography variant="title">Нет данных</Typography>
        }*/

        let {counters, counterNames, counterTimes, config, classes} = this.props,
            {groupInterval, showCount} = config;

        return <div>
            {this.renderConfig()}
            <Paper className={classes.countersPaper}><Table>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.enCell}>Counter Names</TableCell>
                        {
                            counterTimes.map((ct) => <TableCell className={classes.cell} key={ct}
                                                                dangerouslySetInnerHTML={{__html: renderTime(ct, groupInterval)}}/>)
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        counterNames.map(cn => {
                            const counter = counters[cn] || {values: {}};

                            return <TableRow key={cn}>
                                <TableCell className={classes.enCell}>{cn}</TableCell>
                                {
                                    counterTimes.map(tg => {
                                        const value = counter.values[tg] || 0,
                                            percent = Math.round(value / counter.maxValue * 100) * 0.95,
                                            percent2 = Math.min(percent + 12, 100);
                                        return <TableCell
                                            key={tg}
                                            className={classes.cell}
                                            style={{background: `linear-gradient(to top, ${indigo[50]} ${percent}%, rgba(255,255,255,0) ${percent2}%)`}}
                                        >
                                            {value}
                                        </TableCell>
                                    })
                                }
                            </TableRow>
                        })
                    }
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