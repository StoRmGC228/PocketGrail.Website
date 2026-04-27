import { ImageButton } from '../components/image-button/ImageButton'

export const HomePage = () => {
	return (
		<div className='flex flex-col gap-6 md:gap-8'>
			{/* Hero banner */}
			<img
				src='/homeHeaderImage.jpg'
				alt='Hero banner'
				className='w-full h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[37.5rem] object-cover rounded-lg bg-gray-300'
			/>

			{/* Intro text */}
			<div className='text-center max-w-xl mx-auto py-6 md:py-10 lg:py-20'>
				<h2>Dorem ipsum dolor sit amet</h2>
				<p>
					Dorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
					vulputate libero et velit interdum, ac aliquet odio mattis. Class
					aptent taciti sociosqu ad litora torquent per conubia nostra, per
					inceptos himenaeos.
				</p>
			</div>

			{/* World lore + notable figures */}
			{/* Mobile: stack all 3 vertically; tablet+: side-by-side */}
			<div className='grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-4'>
				<div className='h-40 sm:h-56 lg:h-72'>
					<ImageButton to='/lore' text='World Lore' />
				</div>
				<div className='grid grid-cols-2 sm:grid-cols-1 gap-4 sm:h-56 lg:h-72'>
					<ImageButton to='/lore/figures' text='Notable Figures' />
					<ImageButton to='/lore/misc' text='Miscellaneous' />
				</div>
			</div>

			{/* Campaigns promo + text block */}
			{/* Mobile: text on top, button below; tablet+: side-by-side */}
			<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 md:py-10'>
				<div className='sm:w-4/5'>
					<h2>Korem ipsum dolor sit amet, consectetur adipiscing elit.</h2>
					<p>
						Korem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
						vulputate libero et velit interdum, ac aliquet odio mattis. Class
						aptent taciti sociosqu ad litora torquent per conubia nostra, per
						inceptos himenaeos.
					</p>
				</div>
				<div className='h-36 sm:h-full min-h-[9rem]'>
					<ImageButton
						to='/campaigns'
						text='Browse Public PocketGrail Campaigns'
					/>
				</div>
			</div>

			{/* Quick-access tool buttons */}
			{/* Mobile: 2 columns; tablet: 4 columns */}
			<div className='grid grid-cols-2 sm:grid-cols-4 gap-3 '>
				<ImageButton to='/characters' text='Character List' />
				<ImageButton to='/tools/dice' text='Dice Calculator' />
				<ImageButton to='/tools/loot' text='Loot Generator' />
				<ImageButton to='/patreon' text='Support on Patreon' />
			</div>
		</div>
	)
}
