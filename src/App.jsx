import { useState } from 'react';
import './App.css';
import Modal from './components/modal';

function App() {
	const [isClicked, setIsClicked] = useState(false);
	const handleWrapperClose = function () {
		setIsClicked(true);
	};

	return (
		<>
			{/* <input
				className='w-screen'
				placeholder='input here'
				id='w-imgr-input-field'
			></input> */}
			{/* <button id='w-imgr-open-modal-btn'>Open WIMGR</button> */}
			<div
				className='w-full h-screen bg-black/25 flex flex-row items-center justify-center'
				onClick={handleWrapperClose}
			>
				<Modal modalClose={isClicked} />
			</div>
		</>
	);
}

export default App;
