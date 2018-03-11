import React from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Drawer from 'material-ui/Drawer';
import List, {ListItem, ListItemIcon, ListItemText} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import DraftsIcon from 'material-ui-icons/Drafts';
import MessageIcon from 'material-ui-icons/Message';
import Typography from "material-ui/Typography";
import {withStyles} from 'material-ui/styles';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import theme from './theme';

import {getRoutePath} from '../../utils/route-utils';
import {COUNTERS, EVENTS} from '../../constants/route-paths';
import {Link, Route, Switch} from 'react-router-dom';

import CountersPage from '../../containers/counters-page';
import EventsPage from '../../containers/events-page';

const drawerWidth = 240;

const styles = theme => ({
    navRoot: {},
    navIcon: {
        marginRight: 24,
    },

    main: {
        padding: 18,
        display: "table",
        margin: "0 auto",
    },

    toolbarSpace: theme.mixins.toolbar,
    drawerHeaderTyp: {
        margin: 18,
        marginBottom: -18
    },
    drawerPaper: {
        height: '100%',
        width: drawerWidth,
    },
});


class Main extends React.Component {
    handleDrawerToggle = () => {
        this.setState({open: !this.state.open});
    };

    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    renderAppBar(classes) {
        return <AppBar className={classes.navRoot} position="fixed">
            <Toolbar>
                <IconButton className={classes.navIcon} color="secondary" aria-label="Menu"
                            onClick={this.handleDrawerToggle}>
                    <MenuIcon/>
                </IconButton>
                <Typography variant="title" color="secondary">
                    AppStatistics
                </Typography>
            </Toolbar>
        </AppBar>
    }

    renderDrawer(classes) {
        return <Drawer
            type="temporary"
            classes={{paper: classes.drawerPaper}}
            onClose={this.handleDrawerToggle}
            open={this.state.open}
            ModalProps={{
                keepMounted: true, // Better open performance on mobile.
            }}
        >
            <div>
                <div className={classes.toolbarSpace}>
                    <Typography className={classes.drawerHeaderTyp} variant="title" color="inherit">Menu</Typography>
                </div>
                <Divider/>
                <List>
                    <ListItem
                        button
                        onClick={this.handleDrawerToggle}
                        component={props => <Link to={getRoutePath(COUNTERS)}{...props}/>}
                    >
                        <ListItemIcon>
                            <MessageIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Counters"/>
                    </ListItem>
                    <ListItem
                        button
                        onClick={this.handleDrawerToggle}
                        component={props => <Link to={getRoutePath(EVENTS)} {...props}/>}
                    >
                        <ListItemIcon>
                            <DraftsIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Events"/>
                    </ListItem>
                </List>
            </div>
        </Drawer>
    }

    render() {
        let {classes} = this.props;

        return <MuiThemeProvider theme={theme}>
            <div>
                {this.renderAppBar(classes)}
                {this.renderDrawer(classes)}
                <div className={classes.toolbarSpace}/>
                <main className={classes.main}>
                    <Switch>
                        <Route path={getRoutePath(COUNTERS)} component={CountersPage}/>
                        <Route path={getRoutePath(EVENTS)} component={EventsPage}/>
                        <Route render={(props) => <Typography variant="title">Not found 404!</Typography>}/>
                    </Switch>
                </main>
            </div>
        </MuiThemeProvider>
    }
}

export default withStyles(styles)(Main);