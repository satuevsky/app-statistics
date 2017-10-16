import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from 'material-ui/styles';
import {indigo} from 'material-ui/colors';

import {CircularProgress} from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
import Table, {TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table';
import Paper from 'material-ui/Paper';



const styles = theme => ({
	root: {
		padding: "0 18px 100px",
		overflow: "auto",
		["-webkit-overflow-scrolling"]: "touch",
	},
	cell: {
		position: "relative",
		padding: 8,
		textAlign: "center",
	},
});


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
		this.updateCounters();
	}

	updateCounters(){
		this.props.updateCounters();
	}



	renderTop(){
		if(this.props.fetching){
			return <CircularProgress size={32}/>
		}
	}
	renderCounters(){
		/*if(!this.props.counters.length){
			return <Typography type="title">Нет данных</Typography>
		}*/

		let {counters, counterNames, config, classes} = this.props,
			{groupInterval, showTime} = config,
			now = Date.now(),
			currentTimeGroup = now - now % groupInterval,
			timeGroups = [];

		while(now - currentTimeGroup < showTime){
			timeGroups.push(currentTimeGroup);
			currentTimeGroup -= groupInterval;
		}

		return <Paper style={{display: "table"}}><Table>
			<TableHead>
				<TableRow>
					<TableCell>Counter Names</TableCell>
					{
						timeGroups.map((gt) => <TableCell className={classes.cell} key={gt}>{new Date(gt).toLocaleString("ru", {hour: "numeric", minute: "numeric"})}</TableCell>)
					}
				</TableRow>
			</TableHead>
			<TableBody>
				{
					counterNames.map(cn => {
						const counter = counters[cn] || {values: {}};

						return <TableRow key={cn}>
							<TableCell numeric={true}>{cn}</TableCell>
							{
								timeGroups.map(tg => {
									const value = counter.values[tg] || 0,
										  percent = Math.round(value/counter.maxValue*100) * 0.95,
										  percent2 = Math.min(percent + 30, 100);
									return <TableCell
										key={tg}
										className={classes.cell}
										style={{background: `linear-gradient(to top, ${indigo[50]} ${percent}%, transparent ${percent}%)`}}
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
	}

	render(){
		return <div className={this.props.classes.root}>
			{this.props.fetching ?
				this.renderTop()
				:
				this.renderCounters()
			}
		</div>
	}
}


export default withStyles(styles)(CountersPage);