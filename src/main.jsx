import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './App.css';

const widgetRoot = document.querySelectorAll('.wimgr-widget');
console.log(widgetRoot);

//const rootElement = document.querySelector('body');
const rootElement = document.getElementById('w-imgr-container');
const root = ReactDOM.createRoot(rootElement);

/* ReactDOM.createRoot(document.querySelector('body')).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
); */

root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);

/* widgetRoot.forEach((div) => {
	ReactDOM.render(
		<React.StrictMode>
			<App />
		</React.StrictMode>
	);
});
 */
