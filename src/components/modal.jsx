import { useState } from 'react';
import { useRef } from 'react';

export default function Modal(props) {
	const proxy = 'http://localhost:8000';

	const [images, setImages] = useState([]);

	const inputRef = useRef();

	const getImages = async function (e) {
		console.log('Ref:', inputRef.current.value);

		const query = inputRef.current.value;

		let images = await fetch(`${proxy}/api/unsplash`, {
			method: 'GET',
			headers: { query: query, page: 1 },
		});

		let res = await images.json();

		console.log(res);

		setImages(res.results);
	};
	return (
		<div className='relative flex flex-col gap-8 w-96 p-4 bg-white rounded-xl shadow-lg'>
			<div className='w-full flex flex-row items-center justify-between'>
				<h3 className='text-black text-xl'>Search for an image</h3>
				<h3>X</h3>
			</div>

			<div className='w-full'>
				<input
					ref={inputRef}
					placeholder='e.g. Mountain ranges'
					type='text'
					className='bg-white text-black w-full h-12 border-b-2 border-purple-800 focus:outline-none '
					autoFocus
				/>
				<button onClick={getImages}>Get images</button>
			</div>

			<div className='grid grid-cols-4 gap-2 max-h-48 overflow-scroll'>
				{images.map((img) => (
					<div className='w-full h-16 '>
						<img
							src={img.urls.thumb}
							className='w-full h-full object-cover rounded'
						/>
					</div>
				))}
			</div>
		</div>
	);
}
