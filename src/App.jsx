import { useState } from 'react';
import './App.css';

function App() {
	return (
		<>
			<div className='flex flex-row gap-32'>
				<h1 className='text-3xl text-blue-800 font-bold underline'>
					Hello world!
				</h1>
				<h1 className='text-3xl text-red-800 font-bold underline'>
					Tailwind CSS should be working and is injected into a single JS file!
				</h1>
			</div>
		</>
	);
}

export default App;
