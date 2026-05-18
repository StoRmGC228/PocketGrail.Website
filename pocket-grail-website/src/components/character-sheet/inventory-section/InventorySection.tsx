import { useState } from 'react'
import './InventorySection.css'
import type { CharacterDetailDto, ItemDto } from '../../../types/character'
import { useDeleteItemMutation, useUpdateItemMutation, useUpdateWalletMutation } from '../../../api/characterApi'

interface InventorySectionProps {
	character: CharacterDetailDto
	onAddItem: () => void
}

type FilterKey = 'all' | 'equipped' | 'weapons' | 'magic'

const RARITY_COLORS: Record<string, string> = {
	Common: '#9a8fb8',
	Uncommon: '#22c55e',
	Rare: '#3b82f6',
	'Very Rare': '#a855f7',
	Legendary: '#f59e0b',
	Artifact: '#ef4444',
}

const COIN_INFO = [
	{ key: 'cpCoins' as const, label: 'CP', color: '#b45309' },
	{ key: 'spCoins' as const, label: 'SP', color: '#9ca3af' },
	{ key: 'epCoins' as const, label: 'EP', color: '#a8a29e' },
	{ key: 'gpCoins' as const, label: 'GP', color: '#f59e0b' },
	{ key: 'ppCoins' as const, label: 'PP', color: '#c084fc' },
]

function ItemRow({
	item,
	characterId,
}: {
	item: ItemDto
	characterId: number
}) {
	const [open, setOpen] = useState(false)
	const [updateItem] = useUpdateItemMutation()
	const [deleteItem] = useDeleteItemMutation()

	const rarityColor = RARITY_COLORS[item.rarity ?? ''] ?? 'var(--border)'

	return (
		<div className='ch-item' style={{ '--rarity-color': rarityColor } as React.CSSProperties}>
			<div className='ch-item-row' onClick={() => setOpen(!open)}>
				<button
					className={`ch-item-equip${item.isEquipped ? ' equipped' : ''}`}
					title={item.isEquipped ? 'Unequip' : 'Equip'}
					onClick={e => {
						e.stopPropagation()
						updateItem({ characterId, itemId: item.id, isEquipped: !item.isEquipped })
					}}
				>
					<svg width='11' height='11' viewBox='0 0 24 24' fill={item.isEquipped ? 'currentColor' : 'none'} stroke='currentColor' strokeWidth='2' strokeLinecap='round'>
						<path d='M12 2L3 7l9 13 9-13-9-5z' />
					</svg>
				</button>
				<span className='ch-item-name'>{item.name}</span>
				<div className='ch-item-row-meta'>
					{item.quantity > 1 && <span className='ch-item-qty'>×{item.quantity}</span>}
					{item.rarity && item.rarity !== 'Common' && (
						<span className='ch-item-rarity' style={{ color: rarityColor }}>{item.rarity}</span>
					)}
					{item.isMagical && <span className='ch-magic-badge'>Magic</span>}
					<svg
						className={`ch-item-chevron${open ? ' open' : ''}`}
						width='12'
						height='12'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2.2'
						strokeLinecap='round'
					>
						<path d='M6 9l6 6 6-6' />
					</svg>
				</div>
			</div>

			{open && (
				<div className='ch-item-body'>
					{item.description && <p className='ch-item-desc'>{item.description}</p>}
					<div className='ch-item-foot'>
						<div className='ch-item-details'>
							{item.weight && <span className='ch-item-detail'>{item.weight} lb</span>}
							{item.cost && <span className='ch-item-detail'>{item.cost}</span>}
							{item.isAttuned && <span className='ch-attuned-badge'>Attuned</span>}
						</div>
						{item.tags && (
							<div className='ch-item-tags'>
								{item.tags.split(',').filter(Boolean).map((tag, i) => (
									<span key={i} className='ch-item-tag'>{tag.trim()}</span>
								))}
							</div>
						)}
						<button
							className='ch-del-btn'
							onClick={() => deleteItem({ characterId, itemId: item.id })}
							aria-label={`Delete ${item.name}`}
						>
							<svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.4' strokeLinecap='round'>
								<path d='M6 6 18 18M6 18 18 6' />
							</svg>
						</button>
					</div>
				</div>
			)}
		</div>
	)
}

export const InventorySection = ({ character, onAddItem }: InventorySectionProps) => {
	const [filter, setFilter] = useState<FilterKey>('all')
	const [updateWallet] = useUpdateWalletMutation()
	const [editCoin, setEditCoin] = useState<string | null>(null)
	const [coinInput, setCoinInput] = useState('')

	const totalWeight = character.items.reduce((sum, item) => sum + (item.weight ?? 0) * item.quantity, 0)
	const maxCarry = character.strScore * 15

	const filteredItems = character.items.filter(item => {
		if (filter === 'equipped') return item.isEquipped
		if (filter === 'weapons') return item.isWeapon
		if (filter === 'magic') return item.isMagical
		return true
	})

	const handleCoinBlur = (key: string) => {
		const val = parseInt(coinInput)
		if (!isNaN(val)) {
			updateWallet({ id: character.id, [key]: val } as Parameters<typeof updateWallet>[0])
		}
		setEditCoin(null)
	}

	return (
		<div className='ch-sec ch-inv'>
			<div className='ch-sec-head'>
				<h3>Inventory</h3>
				<button className='ch-add-btn' onClick={onAddItem}>
					<svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round'>
						<path d='M12 5v14M5 12h14' />
					</svg>
					Add Item
				</button>
			</div>

			{/* Wallet */}
			<div className='ch-wallet'>
				<div className='ch-wallet-coins'>
					{COIN_INFO.map(coin => (
						<div key={coin.key} className='ch-coin'>
							<div className='ch-coin-disc' style={{ background: coin.color }} />
							{editCoin === coin.key ? (
								<input
									className='ch-coin-input'
									type='number'
									value={coinInput}
									autoFocus
									onChange={e => setCoinInput(e.target.value)}
									onBlur={() => handleCoinBlur(coin.key)}
									onKeyDown={e => e.key === 'Enter' && handleCoinBlur(coin.key)}
								/>
							) : (
								<button
									className='ch-coin-num'
									onClick={() => { setCoinInput(String(character[coin.key])); setEditCoin(coin.key) }}
								>
									{character[coin.key]}
								</button>
							)}
							<span className='ch-coin-name'>{coin.label}</span>
						</div>
					))}
				</div>
			</div>

			{/* Carry weight */}
			<div className='ch-carry'>
				<div className='ch-carry-row'>
					<span className='ch-carry-lbl'>Carry Weight</span>
					<span className='ch-carry-num'>{totalWeight.toFixed(1)} / {maxCarry} lb</span>
				</div>
				<div className='ch-carry-bar'>
					<div
						className='ch-carry-fill'
						style={{ width: `${Math.min(100, (totalWeight / maxCarry) * 100)}%` }}
						data-over={totalWeight > maxCarry ? '' : undefined}
					/>
				</div>
			</div>

			{/* Filter chips */}
			<div className='ch-inv-filters'>
				{(['all', 'equipped', 'weapons', 'magic'] as FilterKey[]).map(f => (
					<button
						key={f}
						className={`ch-inv-filter${filter === f ? ' active' : ''}`}
						onClick={() => setFilter(f)}
					>
						{f.charAt(0).toUpperCase() + f.slice(1)}
					</button>
				))}
			</div>

			{/* Items */}
			{filteredItems.length === 0 ? (
				<div className='ch-empty'>No items found.</div>
			) : (
				<div className='ch-items-list'>
					{filteredItems.map(item => (
						<ItemRow key={item.id} item={item} characterId={character.id} />
					))}
				</div>
			)}
		</div>
	)
}
