import { useState } from 'react'
import './AddItemModal.css'
import { useAddItemMutation } from '../../../api/characterApi'

interface AddItemModalProps {
	characterId: number
	onClose: () => void
}

export const AddItemModal = ({ characterId, onClose }: AddItemModalProps) => {
	const [addItem, { isLoading }] = useAddItemMutation()

	const [name, setName] = useState('')
	const [category, setCategory] = useState('')
	const [rarity, setRarity] = useState('Common')
	const [weight, setWeight] = useState('')
	const [cost, setCost] = useState('')
	const [quantity, setQuantity] = useState('1')
	const [description, setDescription] = useState('')
	const [tags, setTags] = useState('')
	const [isWeapon, setIsWeapon] = useState(false)
	const [atkMod, setAtkMod] = useState('')
	const [damage, setDamage] = useState('')
	const [damageType, setDamageType] = useState('')
	const [weaponProperties, setWeaponProperties] = useState('')
	const [isMagical, setIsMagical] = useState(false)
	const [isEquipped, setIsEquipped] = useState(false)
	const [error, setError] = useState('')

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!name.trim()) { setError('Name is required.'); return }
		try {
			await addItem({
				id: characterId,
				name: name.trim(),
				category: category || undefined,
				rarity: rarity || undefined,
				weight: weight ? parseFloat(weight) : undefined,
				cost: cost || undefined,
				quantity: parseInt(quantity) || 1,
				description: description || undefined,
				tags: tags || undefined,
				isWeapon,
				isMagical,
				isEquipped,
				isAttuned: false,
				atkMod: isWeapon ? atkMod || undefined : undefined,
				damage: isWeapon ? damage || undefined : undefined,
				damageType: isWeapon ? damageType || undefined : undefined,
				weaponProperties: isWeapon && weaponProperties ? weaponProperties : undefined,
			}).unwrap()
			onClose()
		} catch {
			setError('Failed to add item. Please try again.')
		}
	}

	return (
		<div className='rst-modal-backdrop' onClick={e => e.target === e.currentTarget && onClose()}>
			<div className='rst-modal'>
				<div className='rst-modal-eyebrow'>Inventory</div>
				<h2>Add Item</h2>
				<button className='rst-modal-close' onClick={onClose} type='button' aria-label='Close'>
					<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.4' strokeLinecap='round'>
						<path d='M6 6 18 18M6 18 18 6' />
					</svg>
				</button>

				<form className='rst-form' onSubmit={handleSubmit}>
					<div className='rst-field'>
						<label>Name *</label>
						<input value={name} onChange={e => setName(e.target.value)} placeholder='Item name' required />
					</div>

					<div className='rst-field-row'>
						<div className='rst-field'>
							<label>Category</label>
							<select value={category} onChange={e => setCategory(e.target.value)}>
								<option value=''>Select…</option>
								<option>Weapon</option>
								<option>Armor</option>
								<option>Gear</option>
								<option>Magic Item</option>
								<option>Tool</option>
								<option>Consumable</option>
								<option>Treasure</option>
								<option>Other</option>
							</select>
						</div>
						<div className='rst-field'>
							<label>Rarity</label>
							<select value={rarity} onChange={e => setRarity(e.target.value)}>
								<option>Common</option>
								<option>Uncommon</option>
								<option>Rare</option>
								<option>Very Rare</option>
								<option>Legendary</option>
								<option>Artifact</option>
							</select>
						</div>
					</div>

					<div className='rst-field-row'>
						<div className='rst-field'>
							<label>Weight (lb)</label>
							<input type='number' min={0} step={0.1} value={weight} onChange={e => setWeight(e.target.value)} placeholder='0' />
						</div>
						<div className='rst-field'>
							<label>Cost</label>
							<input value={cost} onChange={e => setCost(e.target.value)} placeholder='e.g. 50 gp' />
						</div>
					</div>

					<div className='rst-field'>
						<label>Quantity</label>
						<input type='number' min={1} value={quantity} onChange={e => setQuantity(e.target.value)} />
					</div>

					<div className='rst-field'>
						<label>Description</label>
						<textarea className='rst-textarea' value={description} onChange={e => setDescription(e.target.value)} placeholder='Item description…' rows={3} />
					</div>

					<div className='rst-field'>
						<label>Tags (comma-separated)</label>
						<input value={tags} onChange={e => setTags(e.target.value)} placeholder='e.g. artifact, holy' />
					</div>

					{/* Checkboxes */}
					<div className='rst-checkboxes'>
						<label className='rst-checkbox-label'>
							<input type='checkbox' checked={isWeapon} onChange={e => setIsWeapon(e.target.checked)} />
							Is Weapon
						</label>
						<label className='rst-checkbox-label'>
							<input type='checkbox' checked={isMagical} onChange={e => setIsMagical(e.target.checked)} />
							Is Magical
						</label>
						<label className='rst-checkbox-label'>
							<input type='checkbox' checked={isEquipped} onChange={e => setIsEquipped(e.target.checked)} />
							Start Equipped
						</label>
					</div>

					{isWeapon && (
						<div className='rst-weapon-fields'>
							<div className='rst-field-row'>
								<div className='rst-field'>
									<label>ATK Mod</label>
									<input value={atkMod} onChange={e => setAtkMod(e.target.value)} placeholder='+5' />
								</div>
								<div className='rst-field'>
									<label>Damage</label>
									<input value={damage} onChange={e => setDamage(e.target.value)} placeholder='1d8' />
								</div>
							</div>
							<div className='rst-field'>
								<label>Damage Type</label>
								<select value={damageType} onChange={e => setDamageType(e.target.value)}>
									<option value=''>Select…</option>
									<option>Slashing</option>
									<option>Piercing</option>
									<option>Bludgeoning</option>
									<option>Fire</option>
									<option>Cold</option>
									<option>Lightning</option>
									<option>Necrotic</option>
									<option>Radiant</option>
									<option>Poison</option>
									<option>Acid</option>
									<option>Thunder</option>
									<option>Psychic</option>
									<option>Force</option>
								</select>
							</div>
							<div className='rst-field'>
								<label>Weapon Properties (comma-separated)</label>
								<input value={weaponProperties} onChange={e => setWeaponProperties(e.target.value)} placeholder='Finesse, Light, Thrown' />
							</div>
						</div>
					)}

					{error && <p className='rst-modal-error'>{error}</p>}

					<div className='rst-modal-actions'>
						<button type='button' className='rst-modal-btn rst-modal-btn-ghost' onClick={onClose}>Cancel</button>
						<button type='submit' className='rst-modal-btn rst-modal-btn-primary' disabled={isLoading}>
							{isLoading ? 'Adding…' : 'Add Item'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
