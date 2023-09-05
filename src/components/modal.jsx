import { useState, useRef, useEffect, useCallback } from 'react';

export default function Modal(props) {
	const proxy = 'http://localhost:8000';

	const apiKey = document
		?.querySelector('script[data-id="w-imgr-script"][data-api-key]')
		?.getAttribute('data-api-key');

	const [loadedImages, setLoadedImages] = useState([]);

	const [selectedImg, setSelectedImg] = useState(null);
	const [imagesDisplayed, setImagesDisplayed] = useState(false);
	const [isQuery, setIsQuery] = useState(false);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [errorCode, setErrorCode] = useState(null);
	const [page, setPage] = useState(1);
	const [noMoreImages, setNoMoreImages] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [orientation, setOrientation] = useState('landscape');

	const inputRef = useRef();
	const chooseBtnRef = useRef();

	const observerTarget = useRef(null);
	const observerTargetRoot = useRef();

	const openModal = function (e) {
		setModalIsOpen(true);
		const wimgrContainer = document.getElementById('w-imgr-container');

		wimgrContainer.style.display = 'block';
		wimgrContainer.style.position = 'absolute';
		wimgrContainer.style.top = '0';
		wimgrContainer.style.left = '0';
		wimgrContainer.style.width = '100%';

		inputRef.current.focus();
	};

	const closeModal = function (e) {
		setIsLoading(false);
		setError(null);
		setPage(1);
		setLoadedImages([]);
		setNoMoreImages(false);
		setModalIsOpen(false);
		setIsQuery(false);
		setImagesDisplayed(false);
		setSelectedImg(false);

		inputRef.current.value = null;
		const wimgrContainer = document.getElementById('w-imgr-container');

		wimgrContainer.style.display = 'none';
	};

	useEffect(() => {
		const openBtn = document.getElementById('w-imgr-open-modal-btn');
		openBtn.addEventListener('click', openModal);
	}, []);

	// Remove button clicked - remove url from inputfield and img src
	useEffect(() => {
		const removeBtn = document.getElementById('w-imgr-remove-btn');
		removeBtn.addEventListener('click', () => {
			const inputfield = document.getElementById('w-imgr-input-field');
			inputfield.value = '';

			const previewImage = document.getElementById('w-imgr-preview-image');
			if (previewImage) {
				previewImage.src = '';
			}
		});
	}, []);

	const handleResponse = async function (res) {
		if (res.status === 200) {
			let images = await res.json();
			if (images.results.length !== 0) {
				// Request approved and has images
				setLoadedImages((prevItems) => [...prevItems, ...images.results]);
				setPage((prevPage) => prevPage + 1);
				setImagesDisplayed(true);
			} else {
				// Request approved and has no images for search query
				setError('No results for your search, try something else.');
			}
		} else if (res.status === 204) {
			// No images found for search
			setError('No results for your search, try something else.');
			setErrorCode(204);
		} else if (res.status === 401) {
			// Auth fail
			setError(
				'An API-Key is required to use W-IMGR. Please check if your key is present.'
			);
		} else if (res.status === 429) {
			setError('Too many requests. Your limit will reset in a minute.');
			setErrorCode(429);
		} else if (res.status === 500) {
			setError('Internal server error. Something went wrong.');
		} else {
			setError('Something went wrong.');
		}
	};

	const getImages = async function (e) {
		if (e.key === 'Enter' || e.type === 'click') {
			setIsLoading(true);
			setError(null);
			setErrorCode(null);
			setPage(1);
			setLoadedImages([]);
			setNoMoreImages(false);

			try {
				const query = inputRef.current.value;
				setIsQuery(true);

				let res = await fetch(`${proxy}/api/unsplash`, {
					method: 'GET',
					headers: {
						query: query,
						page: 1,
						orientation: orientation,
						authorization: apiKey,
					},
				});

				await handleResponse(res);
			} catch (error) {
				setError(error);
			} finally {
				setIsLoading(false);
			}
		}
	};

	const getMoreImages = async function (e) {
		setIsLoading(true);
		setError(null);

		try {
			let res = await fetch(`${proxy}/api/unsplash`, {
				method: 'GET',
				headers: {
					query: inputRef.current.value,
					page: page,
					orientation: orientation,
					authorization: apiKey,
				},
			});

			await handleResponse(res);
		} catch (error) {
			setError(error);
		} finally {
			setIsLoading(false);
		}
	};

	const imgSelected = function (e) {
		const url = e.target.getAttribute('data-url');
		chooseBtnRef.current.setAttribute('data-url', url);

		setSelectedImg(e.target.id);
	};

	const chooseImage = function (e) {
		const url = e.target.getAttribute('data-url');
		chooseBtnRef.current.setAttribute('data-url', url);

		const inputfield = document.getElementById('w-imgr-input-field');
		inputfield.value = url;

		const previewImage = document.getElementById('w-imgr-preview-image');
		if (previewImage) {
			previewImage.src = url;
		}

		closeModal();
	};

	const handleOrientation = function (e) {
		setOrientation(e.target.getAttribute('data-orientation'));
	};

	useEffect(() => {
		if (orientation && isQuery) {
			getImages({ type: 'click' });
		}
	}, [orientation, isQuery]);

	const loadMore = useCallback(
		(entries) => {
			if (entries[0].isIntersecting && isQuery) {
				//console.log('Is intersecting');
				getMoreImages();
				setPage((prevPage) => prevPage + 1);
			}
		},
		[page, isQuery]
	);

	// Stop observer when error 429 too many requests has been received
	useEffect(() => {
		if (errorCode === 429) {
			setTimeout(() => {
				setErrorCode(null);
			}, 60000);
		}
	}, [errorCode]);

	useEffect(() => {
		const container = observerTargetRoot.current;

		const observer = new IntersectionObserver(loadMore, {
			root: container,
			threshold: 1,
		});

		if (
			observerTarget &&
			observerTarget.current &&
			imagesDisplayed &&
			!noMoreImages &&
			errorCode !== 429 &&
			errorCode !== 204
		) {
			observer.observe(observerTarget.current);
		}

		return () => {
			if (observerTarget.current) {
				observer.unobserve(observerTarget.current);
			}
		};
	}, [
		imagesDisplayed,
		observerTarget,
		loadMore,
		isLoading,
		noMoreImages,
		errorCode,
	]);

	return (
		<div
			className={
				modalIsOpen
					? 'relative flex flex-col gap-8 w-96 p-4 bg-white rounded-xl shadow-lg animate-[wiggle_0.3s_ease-out_1]'
					: ''
			}
		>
			<div className='w-full flex flex-row items-center justify-between'>
				<h3 className='text-black text-xl'>Search for an image</h3>
				<svg
					onClick={closeModal}
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 24 24'
					stroke-width='1.5'
					stroke='#5832e9'
					className='w-6 h-6 cursor-pointer'
				>
					<path d='M6 18L18 6M6 6l12 12' />
				</svg>
			</div>

			<div className='w-full flex flex-row gap-4 items-center'>
				<input
					ref={inputRef}
					placeholder='e.g. Mountain ranges'
					type='text'
					className='bg-white text-black w-full h-12 border-b-[1px] border-purple focus:outline-none'
					autoFocus
					onKeyDown={getImages}
				/>
				<div className='flex flex-row items-center'>
					<div
						className={
							orientation === 'landscape'
								? 'p-2 rounded-full bg-black/5 cursor-pointer'
								: 'p-2 cursor-pointer'
						}
						data-orientation='landscape'
						onClick={handleOrientation}
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='24'
							height='24'
							viewBox='0 0 24 24'
							stroke='#5832e9'
							className='w-6 h-6 pointer-events-none'
							stroke-width='2'
							fill='none'
						>
							<rect width='20' height='12' x='2' y='6' rx='2' />
						</svg>
					</div>

					<div
						className={
							orientation === 'portrait'
								? 'p-2 rounded-full bg-black/5 cursor-pointer'
								: 'p-2 cursor-pointer'
						}
						data-orientation='portrait'
						onClick={handleOrientation}
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='24'
							height='24'
							viewBox='0 0 24 24'
							stroke='#5832e9'
							className='w-6 h-6 pointer-events-none	'
							stroke-width='2'
							fill='none'
						>
							<rect width='12' height='20' x='6' y='2' rx='2' />
						</svg>
					</div>
				</div>
			</div>

			<div className='w-full max-h-48 overflow-scroll' ref={observerTargetRoot}>
				<div className='w-full flex flex-col items-center'>
					<div
						className={
							orientation === 'landscape'
								? 'w-full grid grid-cols-2 gap-2'
								: 'w-full grid grid-cols-4 gap-2'
						}
					>
						{loadedImages.map((img) => (
							<div
								className={'relative w-full h-[5.5rem] cursor-pointer'}
								onMouseEnter={(e) => {
									setIsHovered(e.target.id);
								}}
								onMouseLeave={(e) => {
									setIsHovered('');
								}}
							>
								<img
									onClick={imgSelected}
									src={img.urls.thumb}
									data-url={img.urls.full}
									id={img.id}
									className={
										selectedImg === img.id
											? 'w-full h-full object-cover rounded opacity-75 border-solid border-[2px] border-purple'
											: 'w-full h-full object-cover rounded'
									}
								/>
								<div
									className={
										isHovered === img.id
											? 'absolute bottom-0 left-0 p-1'
											: 'opacity-0'
									}
									id={img.id}
								>
									<a
										href={
											img.links.html + '?utm_source=wimgr&utm_medium=referral'
										}
										target='_blank'
										className='text-white text-xs underline leading-none'
									>
										{img.user.name}
									</a>
								</div>
							</div>
						))}
					</div>

					{isLoading ? (
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='24'
							height='24'
							viewBox='0 0 24 24'
							fill='none'
							stroke='#5832e9'
							stroke-width='2'
							className='mt-2 animate-spin'
						>
							<path d='M21 12a9 9 0 1 1-6.219-8.56' />
						</svg>
					) : (
						<div
							className={imagesDisplayed ? 'w-full min-h-2' : ''}
							ref={observerTarget}
						></div>
					)}
				</div>
			</div>

			{imagesDisplayed ? (
				<div className='flex flex-row justify-between items-center'>
					<div className='flex flex-row justify-start'>
						<span className='text-xs'>
							Photos by{' '}
							<a
								className='font-bold cursor-pointer underline'
								href='https://unsplash.com/?utm_source=wimgr&utm_medium=referral'
								target='_blank'
							>
								Unsplash
							</a>
						</span>
					</div>
					<div className='flex flex-row gap-2 items-center justify-end'>
						<button
							className='text-sm py-1 px-2 border-solid border-[1px] border-black/25 rounded-lg'
							onClick={closeModal}
						>
							Cancel
						</button>
						<button
							ref={chooseBtnRef}
							onClick={chooseImage}
							data-url=''
							disabled={selectedImg ? false : true}
							className={
								selectedImg
									? 'text-sm text-white py-1 px-2 bg-purple border-black/25 rounded-lg'
									: 'text-sm text-white py-1 px-2 bg-purple/25 rounded-lg cursor-not-allowed'
							}
						>
							Choose image
						</button>
					</div>
				</div>
			) : (
				''
			)}

			{error && <p className='text-sm text-red-400'>{error}</p>}
		</div>
	);
}
