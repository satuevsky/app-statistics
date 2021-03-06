import React from 'react';

import {withStyles} from 'material-ui/styles';
import Typography from 'material-ui/Typography'
import {CircularProgress} from 'material-ui/Progress';
import EventsList from './EventsList';
import moment from "moment";


const styles = theme => ({
    progress: {
        margin: "0 auto",
        display: "table"
    }
});

type EventsPageProps = {
    events: Object[],
    fetching: boolean,
    hasMore: boolean,
    error: any,
    classes: Object,

    clearEvents: () => void,
    fetchNextEvents: () => void,
    fetchNewEvents: () => void,
    allowUpdating: () => void,
}

class EventsPage extends React.Component<EventsPageProps> {
    props: EventsPageProps;

    handleScroll = () => {
        let {scrollHeight, clientHeight} = document.body.parentNode,
            scrollTop = window.pageYOffset;

        if (scrollHeight - (scrollTop + clientHeight) < (this.props.events.length < 60 ? 800 : 1600) && !this.props.fetching) {
            this.props.fetchNextEvents();
        }

        this.autoUpdating(scrollTop < 100);
    };
    autoUpdating = (enabled = true) => {
        if (this.props.allowUpdating === enabled) return;
        this.props.allowUpdating(enabled);
        clearInterval(this._t);
        if (enabled) {
            this._t = setInterval(this.props.fetchNewEvents, 3000);
        }
    };

    componentDidMount() {
        if (!this.props.events.length && !this.props.fetching) {
            this.props.fetchNextEvents();
        }
        window.addEventListener('scroll', this.handleScroll);

        this.autoUpdating(true);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
        this.props.clearEvents();
        this.autoUpdating(false);
    }

    renderFooter() {
        if (this.props.fetching) {
            return <div className={this.props.classes.progress}><CircularProgress size={32}/></div>
        }
        if (this.props.error) {
            return <Typography variant="subheading" color="error">Failed to retrieve data!</Typography>
        }
    }

    renderEvents() {
        let {events, filter} = this.props,
            {eventNames, fromDate, toDate} = filter,
            title = "Events: ";

        if (eventNames && eventNames.length) {
            title += eventNames.join(", ");
        } else {
            title += "All";
        }

        if (toDate) {
            title += ". From " + moment(toDate).calendar();
        }
        if (fromDate) {
            title += ". To " + moment(fromDate).calendar();
        }

        if (!events.length && !this.props.fetching && !this.props.error) {
            return <Typography variant="subheading">No data</Typography>
        }

        return <EventsList events={events} title={title}/>;
    }

    render() {
        return <div>
            {this.renderEvents()}
            {this.renderFooter()}
        </div>
    }
}

export default withStyles(styles)(EventsPage);