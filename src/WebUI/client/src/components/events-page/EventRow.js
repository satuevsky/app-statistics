import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from 'material-ui/styles';
import {TableCell, TableRow} from "material-ui/Table";

const timeFmt = {hour: "numeric", minute: "numeric", second: "numeric"};

const styles = () => ({
    cell: {
        whiteSpace: "nowrap"
    }
});

class EventRow extends React.Component {
    static propTypes = {
        event: PropTypes.object,
    };

    shouldComponentUpdate(props) {
        return props.event !== this.props.event;
    }

    render() {
        const {event, classes} = this.props;
        return <TableRow>
            <TableCell className={classes.cell}>{new Date(event.date).toLocaleString("en", timeFmt)}</TableCell>
            <TableCell className={classes.cell}>{event.en}</TableCell>
            <TableCell className={classes.cell}>{event.uid}</TableCell>
            <TableCell className={classes.cell}>{JSON.stringify(event.data)}</TableCell>
        </TableRow>
    }
}

export default withStyles(styles)(EventRow);