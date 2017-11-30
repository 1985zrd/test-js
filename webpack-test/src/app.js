import React from 'react';
import ReactDOM from 'react-dom';

import './css/style.css';
import './fonts/iconfont.css';
import './sass/a.ss'

import a from './js/a.js';

a();

ReactDOM.render(
	<div>
		<h1><i className="iconfont icon-email"></i>hello</h1>
		<img src={ require('./img/safeBgTitle.png') } />
		<div className="flex">
			<span>123</span>
			<span>456</span>
		</div>
	</div>,
	document.getElementById('root')
)