import React from 'react';
import Typography from "material-ui/Typography";
import {CircularProgress} from "material-ui/Progress";


export default function CountersTop(props) {
    if (props.error) {
        return <Typography variant="subheading" color="error">Failed to retrieve data!</Typography>
    }
    if (props.fetching && !props.counters) {
        return <CircularProgress size={32}/>
    }

    return null;
}