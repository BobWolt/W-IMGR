import { useState } from 'react';
import './App.css';
import Modal from './components/modal';

function App() {
	return (
		<>
			<div className='flex flex-row gap-32'>
				<Modal />
			</div>
		</>
	);
}

export default App;
