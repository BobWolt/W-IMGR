import { useState, useRef, useEffect, useCallback } from 'react';

export default function Modal(props) {
	const proxy = 'http://localhost:8000';

	const [loadedImages, setLoadedImages] = useState([]);

	const [selectedImg, setSelectedImg] = useState(null);
	const [imagesDisplayed, setImagesDisplayed] = useState(false);
	const [isQuery, setIsQuery] = useState(false);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [page, setPage] = useState(1);
	const [noMoreImages, setNoMoreImages] = useState(false);
	const [isHovered, setIsHovered] = useState(false);

	const [modalIsOpen, setModalIsOpen] = useState(false);

	const inputRef = useRef();
	const chooseBtnRef = useRef();

	const observerTarget = useRef(null);
	const observerTargetRoot = useRef();

	const openModal = function (e) {
		setModalIsOpen(true);
		const wimgrContainer = document.getElementById('w-imgr-container');

		wimgrContainer.style.display = 'block';
		wimgrContainer.style.position = 'absolute';
		wimgrContainer.style.width = '100%';
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

	const getImages = async function (e) {
		if (e.key === 'Enter') {
			setIsLoading(true);
			setError(null);
			setPage(1);
			setLoadedImages([]);
			setNoMoreImages(false);

			try {
				const query = inputRef.current.value;
				console.log(query);
				setIsQuery(true);

				let images = await fetch(`${proxy}/api/unsplash`, {
					method: 'GET',
					headers: { query: query, page: page },
				});

				let res = await images.json();

				console.log(res);

				if (res.results.length !== 0) {
					setLoadedImages((prevItems) => [...prevItems, ...res.results]);
					setPage((prevPage) => prevPage + 1);
					setImagesDisplayed(true);

					console.log(res.results);
				} else {
					setError('No results for your search, try something else.');
				}

				console.log('page updated?', page);
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
			let images = await fetch(`${proxy}/api/unsplash`, {
				method: 'GET',
				headers: { query: inputRef.current.value, page: page },
			});

			let res = await images.json();

			if (res.results.length) {
				setLoadedImages((prevItems) => [...prevItems, ...res.results]);
			} else {
				setError('No more images available for this search');
				setNoMoreImages(true);
			}
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

		closeModal();
	};

	const loadMore = useCallback(
		(entries) => {
			if (entries[0].isIntersecting && isQuery) {
				console.log('Is intersecting alright!!!!');
				getMoreImages();
				setPage((prevPage) => prevPage + 1);
			}
		},
		[page, isQuery]
	);

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
			!noMoreImages
		) {
			observer.observe(observerTarget.current);
		}

		return () => {
			if (observerTarget.current) {
				observer.unobserve(observerTarget.current);
			}
		};
	}, [imagesDisplayed, observerTarget, loadMore, isLoading, noMoreImages]);

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

			<div className='w-full'>
				<input
					ref={inputRef}
					placeholder='e.g. Mountain ranges'
					type='text'
					className='bg-white text-black w-full h-12 border-b-[1px] border-purple focus:outline-none '
					autoFocus
					onKeyDown={getImages}
				/>
			</div>

			<div className='w-full max-h-48 overflow-scroll' ref={observerTargetRoot}>
				<div className='w-full flex flex-col items-center'>
					<div className='w-full grid grid-cols-2 gap-2'>
						{loadedImages.map((img) => (
							<div
								className='relative w-full h-[5.5rem] cursor-pointer'
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
											? 'w-full h-full object-cover rounded opacity-75 border-[2px] border-purple'
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
							className='text-sm py-1 px-2 border-[1px] border-black/25 rounded-lg'
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
									: 'text-sm text-black py-1 px-2 bg-white border-black rounded-lg cursor-not-allowed'
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
