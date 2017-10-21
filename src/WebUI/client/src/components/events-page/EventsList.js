import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import {withStyles} from 'material-ui/styles';
import Table, {TableBody, TableHead, TableRow, TableCell} from "material-ui/Table";
import EventRow from './EventRow';

const dateFmt = {year: "numeric", month: "long", day: "numeric"};

const styles = theme => ({
	paper: {
		marginBottom: 16,
	},
	dayTitle: {
		marginLeft: 4,
	}
});

class EventList extends React.PureComponent{
	static propTypes = {
		events: PropTypes.array,
	};

	render(){
		let {events, classes} = this.props;

		let days = [],
			currentDay = null,
			dayEvents = null;

		function pushDay(){
			if(!dayEvents)return;

			days.push(<div key={currentDay}>
				<Typography className={classes.dayTitle} type="body2" color="secondary">{new Date(currentDay).toLocaleString("en", dateFmt)}</Typography>
				<Paper className={classes.paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Time</TableCell>
								<TableCell>Event name</TableCell>
								<TableCell>UserId</TableCell>
								<TableCell>Data</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{dayEvents.map(e => <EventRow key={e.date+e.uid} event={e}/>)}
						</TableBody>
					</Table>
				</Paper>
			</div>)
		}

		for(let i = 0; i < events.length; i++){
			let event = events[i];
			if(currentDay !== new Date(event.date).setHours(0,0,0,0)){
				pushDay();
				currentDay = new Date(event.date).setHours(0,0,0,0);
				dayEvents = [];
			}
			dayEvents.push(event);
		}
		pushDay();

		return <div>{days}</div>;
	}
}

export default withStyles(styles)(EventList);