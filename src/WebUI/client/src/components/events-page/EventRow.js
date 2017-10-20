import React from 'react';
import PropTypes from 'prop-types';
import {TableRow, TableCell} from "material-ui/Table";

const timeFmt = {hour: "numeric", minute: "numeric", second: "numeric"};


export default class EventRow extends React.Component{
	static propTypes = {
		event: PropTypes.object,
	};

	shouldComponentUpdate(props){
		return props.event !== this.props.event;
	}

	render(){
		const {event} = this.props;
		return <TableRow>
			<TableCell>{new Date(event.date).toLocaleString("en", timeFmt)}</TableCell>
			<TableCell>{event.en}</TableCell>
			<TableCell>{event.uid}</TableCell>
			<TableCell>{event.data}</TableCell>
		</TableRow>
	}
}