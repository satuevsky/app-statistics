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
		allowUpdating: PropTypes.bool,

		clearEvents: PropTypes.func,
		fetchNextEvents: PropTypes.func,
		fetchNewEvents: PropTypes.func,
		allowUpdating: PropTypes.func,
	};

	componentDidMount(){
		if(!this.props.events.length && !this.props.fetching){
			this.props.fetchNextEvents();
		}
		window.addEventListener('scroll', this.handleScroll);

		this.autoUpdating(true);
	}
	componentWillUnmount(){
		window.removeEventListener('scroll', this.handleScroll);
		this.props.clearEvents();
		this.autoUpdating(false);
	}

	handleScroll = () => {
		let {scrollHeight, clientHeight} = document.body.parentNode,
			scrollTop = window.pageYOffset;

		//alert(JSON.stringify({scrollTop, scrollHeight, clientHeight}));

		if(scrollHeight - (scrollTop + clientHeight) < (this.props.events.length < 60 ? 800 : 1600) && !this.props.fetching){
			this.props.fetchNextEvents();
		}

		this.autoUpdating(scrollTop < 100);
	};

	autoUpdating = (enabled=true) => {
		if(this.props.allowUpdating === enabled)return;
		this.props.allowUpdating(enabled);
		clearInterval(this._t);
		if(enabled){
			this._t = setInterval(this.props.fetchNewEvents, 3000);
		}
	};

	renderFooter(){
		if(this.props.fetching){
			return <div className={this.props.classes.progress}><CircularProgress size={32}/></div>
		}
		if(this.props.error){
			return <Typography variant="subheading" color="error">Failed to retrieve data!</Typography>
		}
	}
	renderEvents(){
		let {events} = this.props;

		if(!events.length && !this.props.fetching && !this.props.error){
			return <Typography variant="subheading">No data</Typography>
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