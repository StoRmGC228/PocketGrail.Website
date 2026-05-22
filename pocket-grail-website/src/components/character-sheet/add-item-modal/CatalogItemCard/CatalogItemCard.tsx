import './CatalogItemCard.css'
import type { CatalogItemDto } from '../../../../types/character'

const RARITY_COLORS: Record<string, string> = {
	Common: '#9a8fb8',
	Uncommon: '#22c55e',
	Rare: '#3b82f6',
	'Very Rare': '#a855f7',
	Legendary: '#f59e0b',
	Artifact: '#ef4444',
}

interface CatalogItemCardProps {
	item: CatalogItemDto
	onClick: (item: CatalogItemDto) => void
	isAdding: boolean
}

export const CatalogItemCard = ({ item, onClick, isAdding }: CatalogItemCardProps) => {
	const rarityColor = item.rarity ? (RARITY_COLORS[item.rarity] ?? '#9a8fb8') : '#9a8fb8'

	return (
		<button className='cic' onClick={() => onClick(item)} disabled={isAdding} type='button'>
			<div className='cic__header'>
				<span className='cic__rarity-dot' style={{ background: rarityColor }} />
				<span className='cic__name'>{item.name}</span>
				<div className='cic__badges'>
					{item.category && <span className='cic__badge'>{item.category}</span>}
					{item.isWeapon && <span className='cic__badge cic__badge--weapon'>Weapon</span>}
					{item.isMagical && <span className='cic__badge cic__badge--magic'>Magic</span>}
				</div>
			</div>
			{item.description && <p className='cic__desc'>{item.description}</p>}
		</button>
	)
}
