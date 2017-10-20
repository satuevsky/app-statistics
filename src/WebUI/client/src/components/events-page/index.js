import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Table, {TableHead, TableBody, TableRow, TableCell} from 'material-ui/Table'
import Typography from 'material-ui/Typography'
import {CircularProgress} from 'material-ui/Progress';
import EventsList from './EventsList';


const styles = theme => ({
	progress: {
		margin: "0 auto",
		display: "table"
	}
});

class EventsPage extends React.Component{
	static propTypes = {
		events: PropTypes.array,
		fetching: PropTypes.bool,
		hasMore: PropTypes.bool,
		error: PropTypes.bool,

		fetchNextEvents: PropTypes.func,
	};

	componentDidMount(){
		if(!this.props.events.length && !this.props.fetching){
			this.props.fetchNextEvents();
		}
		window.addEventListener('scroll', this.handleScroll);
	}
	componentWillUnmount(){
		window.removeEventListener('scroll', this.handleScroll);
	}

	handleScroll = (e) => {
		let {scrollTop, scrollHeight, clientHeight} = document.body.parentNode;

		if(scrollHeight - (scrollTop + clientHeight) < 800 && !this.props.fetching){
			this.props.fetchNextEvents();
		}
	};

	renderFooter(){
		if(this.props.fetching){
			return <div className={this.props.classes.progress}><CircularProgress size={32}/></div>
		}
		if(this.props.error){
			return <Typography type="subheading" color="error">Failed to retrieve data!</Typography>
		}
	}
	renderEvents(){
		let {events} = this.props;

		if(!events.length && !this.props.fetching && !this.props.error){
			return <Typography type="subheading">No data</Typography>
		}

		return <EventsList events={events}/>;
	}
	render(){
		return <div>
			{this.renderEvents()}
			{this.renderFooter()}
		</div>
	}
}

export default withStyles(styles)(EventsPage);