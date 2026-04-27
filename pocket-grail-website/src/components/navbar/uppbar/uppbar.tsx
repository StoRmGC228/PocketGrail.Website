import { HiMenuAlt2 } from 'react-icons/hi'
import { useUser } from '../../../context/UserContext'

interface UppbarProps {
	onBurgerClick: () => void
}

export const Uppbar = ({ onBurgerClick }: UppbarProps) => {
	const { user } = useUser()

	return (
		<div className='flex items-center justify-between bg-(--color-nb) h-[70px] px-[15px] md:h-[80px] md:px-[18px] lg:h-[90px] lg:px-[20px] shrink-0'>
			{/* Logo */}
			<span className='text-white font-bold text-lg tracking-wide select-none'>
				⚔️ PocketGrail
			</span>

			{/* Right side */}
			<div className='flex items-center gap-3'>
				{/* User badge — visible when name is set */}
				{user.name && (
					<div className='hidden sm:flex items-center leading-tight'>
						<span className='text-white text-sm font-semibold'>{user.name}</span>
					</div>
				)}

				{/* Avatar */}
				<div className='w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0'>
					<span className='text-white font-bold text-sm'>
						{user.name ? user.name.charAt(0).toUpperCase() : '?'}
					</span>
				</div>

				{/* Burger — mobile only, hidden on lg (sidebar is static) */}
				<button
					onClick={onBurgerClick}
					className='lg:hidden text-white p-1 rounded hover:bg-white/10 transition-colors cursor-pointer'
					aria-label='Toggle menu'
				>
					<HiMenuAlt2 size={26} />
				</button>
			</div>
		</div>
	)
}
