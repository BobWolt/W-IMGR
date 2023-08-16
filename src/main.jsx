import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './App.css';
import { createPortal } from 'react-dom';

const widgetRoot = document.querySelectorAll('.wimgr-widget');
console.log(widgetRoot);

//const rootElement = document.querySelector('body');
const rootElement = document.getElementById('w-imgr-container');
const root = ReactDOM.createRoot(rootElement);

/* const rootEl = document.createElement('div');
document.body.appendChild(rootEl); */

/* ReactDOM.createRoot(document.querySelector('body')).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
); */

root.render(
	createPortal(
		<React.StrictMode>
			<App />
		</React.StrictMode>,
		document.body
	)
);

/* widgetRoot.forEach((div) => {
	ReactDOM.render(
		<React.StrictMode>
			<App />
		</React.StrictMode>
	);
});
 */
