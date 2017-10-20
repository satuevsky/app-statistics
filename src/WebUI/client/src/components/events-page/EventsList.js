import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Table, {TableBody, TableHead, TableRow, TableCell} from "material-ui/Table";
import EventRow from './EventRow';


const dateFmt = {year: "numeric", month: "long", day: "numeric"};

export default class EventList extends React.Component{
	static propTypes = {
		events: PropTypes.array,
	};

	constructor(props){
		super(props);
		this.prevEventsLength = props.events.length;
	}

	shouldComponentUpdate(props){
		if(props.events !== this.props.events || props.events.length !== this.prevEventsLength){
			this.prevEventsLength = props.events.length;
			return true;
		}
		return false;
	}

	render(){
		let {events} = this.props;

		let days = [],
			currentDay = null,
			dayEvents = null;

		function pushDay(){
			if(!dayEvents)return;


			days.push(<Paper key={currentDay}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell colSpan={4}>{new Date(currentDay).toLocaleString("en", dateFmt)}</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{dayEvents.map(e => <EventRow key={e.date+e.uid} event={e}/>)}
					</TableBody>
				</Table>
			</Paper>)
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