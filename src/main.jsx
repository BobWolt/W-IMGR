import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './App.css';
import { createPortal } from 'react-dom';

const rootElement = document.getElementById('w-imgr-container');
const root = ReactDOM.createRoot(rootElement);

root.render(
	createPortal(
		<React.StrictMode>
			<App />
		</React.StrictMode>,
		rootElement
	)
);
