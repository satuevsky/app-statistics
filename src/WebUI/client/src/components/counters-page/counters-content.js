import React from 'react';
import moment from "moment/moment";
import {indigo} from 'material-ui/colors';
import Table, {TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Select from 'material-ui/Select';
import Button from 'material-ui/Button';
import {MenuItem} from 'material-ui/Menu';
import {FormControl} from 'material-ui/Form';
import ExpandMore from 'material-ui-icons/ExpandMore';
import {Link} from 'react-router-dom';

import {getGroupTime} from '../../utils/time';


const configIntervals = {
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

function CountersConfig(props) {
    return <FormControl>
        <Select
            className={props.classes.configSelect}
            value={props.config.groupInterval}
            renderValue={value => configIntervals.values[value].display}
            onChange={props.onIntervalChange}
        >
            {configIntervals.keys
                .map(t =>
                    <MenuItem
                        key={t}
                        value={t}>{configIntervals.values[t].display}
                    </MenuItem>
                )
            }
        </Select>
    </FormControl>
}

function CountersTable(props) {
    return <Paper className={props.classes.countersPaper}>
        <Table>
            <CountersTableHead
                classes={props.classes}
                counterTimes={props.counterTimes}
                groupInterval={props.config.groupInterval}
            />
            <CountersTableBody {...props}/>
        </Table>
    </Paper>
}

function CountersTableHead({classes, counterTimes, groupInterval}) {
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

    return <TableHead>
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
}

function CountersTableBody(props) {
    let {counters, counterGroups, counterTimes, config, classes, expandedGroupName, onExpandGroup} = props,
        {groupInterval, showCount} = config,
        rows = [],
        self = this;

    counterGroups.forEach(group => {
        let isWithoutGroup = group.name === "__without_groups",
            expandedGroup = isWithoutGroup;

        if (!isWithoutGroup) {
            rows.push(
                <CountersTableRow
                    key={group.name}
                    name={group.name}
                    values={group.values}
                    maxValue={group.maxValue}
                    isGroup={true}
                    groupItems={group.items}
                    classes={classes}
                    counterTimes={counterTimes}
                    onExpandGroup={onExpandGroup}
                    groupInterval={groupInterval}
                    setFilter={props.setFilter}
                />
            );
            expandedGroup = expandedGroupName === group.name;
        }

        if (expandedGroup) {
            group.items.forEach(counterName => {
                let counter = counters[counterName] || {};
                rows.push(
                    <CountersTableRow
                        key={counterName}
                        name={counterName}
                        values={counter.values || {}}
                        maxValue={counter.maxValue || 0}
                        isGroup={false}
                        classes={classes}
                        counterTimes={counterTimes}
                        groupInterval={groupInterval}
                        setFilter={props.setFilter}
                    />
                )
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

    return <TableBody>
        {rows}
    </TableBody>
}

function CountersTableRow({name, values, maxValue, isGroup, groupItems, classes, counterTimes, onExpandGroup, groupInterval, setFilter}) {
    return <TableRow>
        <TableCell className={isGroup ? classes.egCell : classes.enCell}>
            {
                !isGroup
                    ? name
                    : <Button
                        fullWidth
                        size="small"
                        style={{height: 48}}
                        classes={{label: classes.groupButtonLabel}}
                        onClick={() => onExpandGroup(name)}
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
                    percent2 = Math.min(percent + 12, 100),
                    toDate = tg * 1000,
                    fromDate = getGroupTime(groupInterval, {naturalTime: toDate, groupOffset: 1}).getTime(),
                    eventNames = isGroup ? groupItems : [name];


                return (
                    <TableCell
                        key={tg}
                        className={isGroup ? classes.groupCell : classes.counterCell}
                        style={{background: `linear-gradient(to top, ${indigo["100"]} ${percent}%, rgba(255,255,255,0) ${percent2}%)`}}
                    >
                        <Link className={classes.counterCellLink} to={"/events"}>
                            <div
                                className={classes.counterCellLinkInner}
                                onClick={() => {
                                    setFilter({
                                        eventNames,
                                        fromDate,
                                        toDate,
                                    });
                                }}
                            >
                                {value}
                            </div>
                        </Link>
                    </TableCell>
                )
            })
        }
    </TableRow>
}

class CountersContent extends React.Component {
    onExpandGroup = (groupName) => {
        this.setState({
            expandedGroupName: this.state.expandedGroupName !== groupName ? groupName : null
        })
    };

    constructor(props) {
        super(props);
        this.state = {
            expandedGroupName: null,
        }
    }

    render() {
        if (this.props.error || (this.props.fetching && !this.props.counters)) return null;

        return <div>
            <CountersConfig {...this.props}/>
            <CountersTable
                {...this.props}
                expandedGroupName={this.state.expandedGroupName}
                onExpandGroup={this.onExpandGroup}
            />
        </div>
    }
}

export default CountersContent;