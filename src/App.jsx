import { useState } from 'react';
import './App.css';
import Modal from './components/modal';

function App() {
	return (
		<>
			<input
				className='w-screen'
				placeholder='input here'
				id='w-imgr-input-field'
			></input>
			<button id='w-imgr-open-modal-btn'>Open WIMGR</button>
			<div className='w-full h-screen bg-black/25 flex flex-row items-center justify-center'>
				<Modal />
			</div>
		</>
	);
}

export default App;
