import { useState } from 'react'
import './AddItemModal.css'
import { useGetItemsQuery, useAddItemFromCatalogMutation } from '../../../api/characterApi'
import { CatalogItemCard } from './CatalogItemCard/CatalogItemCard'
import type { CatalogItemDto } from '../../../types/character'

interface AddItemModalProps {
	characterId: number
	onClose: () => void
}

export const AddItemModal = ({ characterId, onClose }: AddItemModalProps) => {
	const [search, setSearch] = useState('')
	const [addingId, setAddingId] = useState<number | null>(null)
	const [error, setError] = useState('')

	const { data: items = [], isLoading, isError } = useGetItemsQuery()
	const [addItemFromCatalog] = useAddItemFromCatalogMutation()

	const filtered = items.filter(item =>
		item.name.toLowerCase().includes(search.toLowerCase()),
	)

	const handleAdd = async (item: CatalogItemDto) => {
		setAddingId(item.id)
		setError('')
		try {
			await addItemFromCatalog({ characterId, itemId: item.id }).unwrap()
			onClose()
		} catch {
			setError('Failed to add item. Please try again.')
			setAddingId(null)
		}
	}

	return (
		<div className='rst-modal-backdrop' onClick={e => e.target === e.currentTarget && onClose()}>
			<div className='rst-modal aim-modal'>
				<div className='rst-modal-eyebrow'>Inventory</div>
				<h2>Add Item</h2>
				<button className='rst-modal-close' onClick={onClose} type='button' aria-label='Close'>
					<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.4' strokeLinecap='round'>
						<path d='M6 6 18 18M6 18 18 6' />
					</svg>
				</button>

				<div className='aim-search'>
					<svg className='aim-search__icon' width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
						<circle cx='11' cy='11' r='8' />
						<path d='M21 21l-4.35-4.35' />
					</svg>
					<input
						className='aim-search__input'
						placeholder='Search items…'
						value={search}
						onChange={e => setSearch(e.target.value)}
						autoFocus
					/>
				</div>

				{error && <p className='rst-modal-error'>{error}</p>}

				<div className='aim-list'>
					{isLoading && <p className='aim-state'>Loading items…</p>}
					{isError && <p className='aim-state aim-state--error'>Failed to load items.</p>}
					{!isLoading && !isError && filtered.length === 0 && (
						<p className='aim-state'>No items found.</p>
					)}
					{filtered.map(item => (
						<CatalogItemCard
							key={item.id}
							item={item}
							onClick={handleAdd}
							isAdding={addingId === item.id}
						/>
					))}
				</div>
			</div>
		</div>
	)
}
