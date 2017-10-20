import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import {indigo} from 'material-ui/colors';
import {CircularProgress} from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
import Table, {TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Select from 'material-ui/Select';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import {m, h, d} from '../../constants/counters-page';



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
	keys: [h, d, 7*d, 30*d],
	values: {
		[h]: {display: "Hour"},
		[d]: {display: "Day"},
		[7*d]: {display: "Week"},
		[30*d]: {display: "Month"}
	}
};

function renderTime(ts, groupInterval){
	let now = new Date(),
		date = new Date(ts*1000),
		fmt = {};

	if(groupInterval < m)
		fmt.second = "numeric";
	if(groupInterval < d){
		fmt.minute = "numeric";
		fmt.hour = "numeric";
		if(now.getDate() !== date.getDate() || now - date > d*1000){
			fmt.day = "numeric";
			fmt.month = "numeric";
			fmt.year = "numeric";
		}
	}else{
		fmt.day = "numeric";
		fmt.month = "numeric";
		fmt.year = "numeric";
	}
	return date.toLocaleString("ru", fmt).replace(',', '</br>');
}


class CountersPage extends React.Component{
	static propTypes = {
		counters: PropTypes.object,
		counterNames: PropTypes.array,
		fetching: PropTypes.bool,
		error: PropTypes.any,
		config: PropTypes.object,

		updateCounters: PropTypes.func,
	};

	componentWillMount(){
		this.props.updateCounters();
	}
	componentWillUnmount(){
		clearTimeout(this._t);
	}
	componentWillReceiveProps(props){
		if(!props.fetching && !props.error && props.counters){
			clearTimeout(this._t);
			this._t = setTimeout(this.props.updateCounters, 1000);
		}
	}

	onIntervalChange = (event) => {
		this.props.updateCounters({groupInterval: event.target.value});
	};

	renderTop(){
		if(this.props.error){
			return <Typography type="subheading" color="error">Failed to retrieve data!</Typography>
		}
		if(this.props.fetching){
			return <CircularProgress size={32}/>
		}
	}
	renderConfig(){
		return <FormControl>
			{/*<InputLabel htmlFor="age-simple">Age</InputLabel>*/}
			<Select
				className={this.props.classes.configSelect}
				value={this.props.config.groupInterval}
				renderValue={value => configIntervals.values[value].display}
				onChange={this.onIntervalChange}
			>
				{configIntervals.keys.map(t => <MenuItem key={t} value={t}>{configIntervals.values[t].display}</MenuItem>)}
			</Select>
		</FormControl>
	}
	renderCounters(){
		/*if(!this.props.counters.length){
			return <Typography type="title">Нет данных</Typography>
		}*/

		let {counters, counterNames, config, classes} = this.props,
			{groupInterval, showCount} = config,
			now = Math.floor(Date.now()/1000),
			currentTimeGroup = now - now % groupInterval,
			timeGroups = [];

		while(timeGroups.length < showCount){
			timeGroups.push(currentTimeGroup);
			currentTimeGroup -= groupInterval;
		}

		return <div>
			{this.renderConfig()}
			<Paper className={classes.countersPaper}><Table>
				<TableHead>
					<TableRow>
						<TableCell className={classes.enCell}>Counter Names</TableCell>
						{
							timeGroups.map((gt) => <TableCell className={classes.cell} key={gt} dangerouslySetInnerHTML={{__html: renderTime(gt, groupInterval)}}/>)
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
									timeGroups.map(tg => {
										const value = counter.values[tg] || 0,
											percent = Math.round(value/counter.maxValue*100) * 0.95,
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

	render(){
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