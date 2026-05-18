import './CharacterPortrait.css'
import type { CharacterDetailDto } from '../../../types/character'

const CLASS_GRADIENTS: Record<string, string> = {
	rogue: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 60%, #831843 100%)',
	wizard: 'linear-gradient(135deg, #0c4a6e 0%, #1e40af 60%, #6366f1 100%)',
	sorcerer: 'linear-gradient(135deg, #312e81 0%, #6d28d9 60%, #c084fc 100%)',
	warlock: 'linear-gradient(135deg, #4a044e 0%, #831843 60%, #f43f5e 100%)',
	cleric: 'linear-gradient(135deg, #422006 0%, #b45309 60%, #fbbf24 100%)',
	paladin: 'linear-gradient(135deg, #064e3b 0%, #0891b2 60%, #facc15 100%)',
	ranger: 'linear-gradient(135deg, #14532d 0%, #15803d 60%, #84cc16 100%)',
	barbarian: 'linear-gradient(135deg, #7c2d12 0%, #b91c1c 60%, #ef4444 100%)',
	bard: 'linear-gradient(135deg, #581c87 0%, #be185d 60%, #fb7185 100%)',
	monk: 'linear-gradient(135deg, #064e3b 0%, #115e59 60%, #d6d3d1 100%)',
	fighter: 'linear-gradient(135deg, #1c1917 0%, #44403c 60%, #a8a29e 100%)',
	druid: 'linear-gradient(135deg, #14532d 0%, #4d7c0f 60%, #fbbf24 100%)',
	artificer: 'linear-gradient(135deg, #422006 0%, #92400e 60%, #06b6d4 100%)',
}

function getClassGradient(cls: string): string {
	const key = cls.toLowerCase().split(' ').pop() ?? ''
	return CLASS_GRADIENTS[key] ?? 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 60%, #6366f1 100%)'
}

interface CharacterPortraitProps {
	character: CharacterDetailDto
	onEditImage: () => void
}

export const CharacterPortrait = ({ character, onEditImage }: CharacterPortraitProps) => {
	const hasImage = !!character.imageUrl
	const hasCrop =
		character.imageCropX !== undefined &&
		character.imageCropY !== undefined &&
		character.imageCropWidth !== undefined &&
		character.imageCropHeight !== undefined

	const imgStyle: React.CSSProperties = hasImage
		? {
				backgroundImage: `url(${character.imageUrl})`,
				backgroundSize: 'cover',
				objectFit: 'cover',
				objectPosition: hasCrop
					? `${(character.imageCropX! + character.imageCropWidth! / 2)}% ${(character.imageCropY! + character.imageCropHeight! / 2)}%`
					: 'center',
		  }
		: { background: getClassGradient(character.classDisplay) }

	return (
		<div className='ch-portrait'>
			<div className='ch-portrait-art' style={imgStyle}>
				{!hasImage && (
					<span className='ch-portrait-initial'>{character.name[0]?.toUpperCase()}</span>
				)}
				<div className='ch-portrait-scrim' />
			</div>
			<div className='ch-portrait-foot'>
				<button className='ch-portrait-edit' onClick={onEditImage} type='button'>
					<svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round'>
						<path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
						<path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' />
					</svg>
					Change Portrait
				</button>
			</div>
		</div>
	)
}
