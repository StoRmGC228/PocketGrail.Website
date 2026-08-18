import { useState } from 'react'
import './AddSpellModal.css'
import { useGetSpellsQuery, useAddSpellFromCatalogMutation } from '../../../api/characterApi'
import { CatalogSpellCard } from './CatalogSpellCard/CatalogSpellCard'
import type { CatalogSpellDto } from '../../../types/character'

interface AddSpellModalProps {
	characterId: number
	onClose: () => void
}

export const AddSpellModal = ({ characterId, onClose }: AddSpellModalProps) => {
	const [search, setSearch] = useState('')
	const [addingId, setAddingId] = useState<number | null>(null)
	const [error, setError] = useState('')

	const { data: spells = [], isLoading, isError } = useGetSpellsQuery()
	const [addSpellFromCatalog] = useAddSpellFromCatalogMutation()

	const filtered = spells.filter(spell =>
		spell.name.toLowerCase().includes(search.toLowerCase()),
	)

	const handleAdd = async (spell: CatalogSpellDto) => {
		setAddingId(spell.id)
		setError('')
		try {
			await addSpellFromCatalog({ characterId, spellId: spell.id }).unwrap()
			onClose()
		} catch {
			setError('Failed to add spell. Please try again.')
			setAddingId(null)
		}
	}

	return (
		<div className='rst-modal-backdrop' onClick={e => e.target === e.currentTarget && onClose()}>
			<div className='rst-modal aim-modal'>
				<div className='rst-modal-eyebrow'>Spellbook</div>
				<h2>Add Spell</h2>
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
						placeholder='Search spells…'
						value={search}
						onChange={e => setSearch(e.target.value)}
						autoFocus
					/>
				</div>

				{error && <p className='rst-modal-error'>{error}</p>}

				<div className='aim-list'>
					{isLoading && <p className='aim-state'>Loading spells…</p>}
					{isError && <p className='aim-state aim-state--error'>Failed to load spells.</p>}
					{!isLoading && !isError && filtered.length === 0 && (
						<p className='aim-state'>No spells found.</p>
					)}
					{filtered.map(spell => (
						<CatalogSpellCard
							key={spell.id}
							spell={spell}
							onClick={handleAdd}
							isAdding={addingId === spell.id}
						/>
					))}
				</div>
			</div>
		</div>
	)
}
