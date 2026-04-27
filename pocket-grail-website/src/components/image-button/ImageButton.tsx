import { useNavigate } from 'react-router-dom'

interface ImageButtonProps {
	to: string
	text: string
	backgroundImage?: string
	className?: string
}

export const ImageButton = ({ to, text, backgroundImage, className = '' }: ImageButtonProps) => {
	const navigate = useNavigate()

	return (
		<button
			onClick={() => navigate(to)}
			className={`relative w-full h-full min-h-[80px] rounded-lg overflow-hidden cursor-pointer
				flex items-center justify-center
				${backgroundImage ? 'bg-gray-500' : 'bg-gray-400'} hover:brightness-110 active:brightness-90
				transition-[filter] duration-200 ${className}`}
			style={backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
		>
			{backgroundImage && <div className='absolute inset-0 bg-black/40' />}
			<span className='relative z-10 text-white font-semibold text-center px-4 py-2 text-sm leading-snug drop-shadow'>
				{text}
			</span>
		</button>
	)
}
