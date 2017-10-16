import React from 'react';
import {Route} from 'react-router-dom';
import Main from './components/main';
import './style.css';

export default function App(){
	return <Route path="/" component={Main}/>
};
