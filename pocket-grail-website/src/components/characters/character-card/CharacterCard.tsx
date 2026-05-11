import './CharacterCard.css'
import type { CharacterDto } from '../../../types/character'

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

interface CharacterCardProps {
	character: CharacterDto
	delMode?: boolean
	onClick?: () => void
	onDelete?: (character: CharacterDto) => void
}

export const CharacterCard = ({ character, delMode, onClick, onDelete }: CharacterCardProps) => {
	const hpPct = character.maxHp > 0 ? Math.max(0, (character.currentHp / character.maxHp) * 100) : 0
	const isLow = character.maxHp > 0 && character.currentHp / character.maxHp < 0.35
	const isDowned = character.currentHp === 0 && character.maxHp > 0
	const artStyle = character.imageUrl
		? { backgroundImage: `url(${character.imageUrl})`, backgroundSize: 'cover' as const, backgroundPosition: 'center' }
		: { background: getClassGradient(character.class) }

	const handleClick = (e: React.MouseEvent) => {
		if (delMode) e.preventDefault()
		else onClick?.()
	}

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation()
		e.preventDefault()
		onDelete?.(character)
	}

	const updatedLabel = (() => {
		const ms = Date.now() - new Date(character.updatedAt).getTime()
		const mins = Math.floor(ms / 60000)
		const hrs = Math.floor(mins / 60)
		const days = Math.floor(hrs / 24)
		if (days > 30) return `${Math.floor(days / 30)}mo ago`
		if (days > 0) return `${days}d ago`
		if (hrs > 0) return `${hrs}h ago`
		if (mins > 0) return `${mins}m ago`
		return 'just now'
	})()

	return (
		<div className="rst-card" data-layout="portrait-left" onClick={handleClick}>
			<div className="rst-card-art" style={artStyle}>
				{!character.imageUrl && <div className="rst-card-art-grain" />}
				<div className="rst-card-art-scrim" />
				<div className="rst-card-art-initial">{character.name[0]?.toUpperCase()}</div>
				<div className="rst-card-art-lvbadge">Lv<b>{character.level}</b></div>
			</div>
			<div className="rst-card-body">
				<div className="rst-card-name">{character.name}</div>
				<div className="rst-card-race">{character.race}</div>
				<div className="rst-card-cls">{character.class}</div>
				<div className="rst-card-hp">
					<div className="rst-card-hp-row">
						<span className="rst-card-hp-lbl">{isDowned ? 'Downed' : 'Hit Points'}</span>
						<span className="rst-card-hp-num">
							{character.currentHp}<em>/</em>{character.maxHp}
						</span>
					</div>
					<div className="rst-card-hp-bar">
						<div data-low={isLow || undefined} style={{ width: `${hpPct}%` }} />
					</div>
				</div>
				<div className="rst-card-foot">
					<div className="rst-card-campaign">
						<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<path d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5z"/>
						</svg>
						{character.campaignName ?? 'No campaign'}
					</div>
					<div className="rst-card-last">{updatedLabel}</div>
				</div>
			</div>
			<button
				className="rst-card-del"
				onClick={handleDelete}
				aria-label={`Delete ${character.name}`}
			>
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
					<path d="M6 6 18 18M6 18 18 6"/>
				</svg>
			</button>
		</div>
	)
}
