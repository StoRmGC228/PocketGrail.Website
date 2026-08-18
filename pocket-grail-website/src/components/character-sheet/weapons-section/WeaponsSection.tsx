import './WeaponsSection.css'
import type { CharacterDetailDto } from '../../../types/character'
import { useDeleteItemMutation } from '../../../api/characterApi'

interface WeaponsSectionProps {
	character: CharacterDetailDto
	onAddItem: () => void
}

export const WeaponsSection = ({ character, onAddItem }: WeaponsSectionProps) => {
	const [deleteItem] = useDeleteItemMutation()

	const weapons = character.items.filter(item => item.isWeapon)

	return (
		<div className='ch-sec ch-weapons'>
			<div className='ch-sec-head'>
				<h3>Weapons</h3>
				<button className='ch-add-btn' onClick={onAddItem}>
					<svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round'>
						<path d='M12 5v14M5 12h14' />
					</svg>
					Add Weapon
				</button>
			</div>

			{weapons.length === 0 ? (
				<div className='ch-empty'>No weapons added yet.</div>
			) : (
				<div className='ch-weapons-list'>
					{weapons.map(weapon => (
						<div key={weapon.id} className='ch-weapon'>
							<div className='ch-weapon-head'>
								<span className='ch-weapon-name'>{weapon.name}</span>
								<div className='ch-weapon-head-badges'>
									{weapon.isMagical && <span className='ch-magic-badge'>Magic</span>}
									<button
										className='ch-del-btn'
										onClick={() => deleteItem({ characterId: character.id, itemId: weapon.id })}
										aria-label={`Delete ${weapon.name}`}
									>
										<svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.4' strokeLinecap='round'>
											<path d='M6 6 18 18M6 18 18 6' />
										</svg>
									</button>
								</div>
							</div>
							<div className='ch-weapon-stats'>
								{weapon.atkMod && (
									<div className='ch-weapon-stat'>
										<span className='ch-weapon-stat-lbl'>ATK</span>
										<span className='ch-weapon-stat-val'>{weapon.atkMod}</span>
									</div>
								)}
								{weapon.damage && (
									<div className='ch-weapon-stat'>
										<span className='ch-weapon-stat-lbl'>DMG</span>
										<span className='ch-weapon-stat-val'>{weapon.damage}</span>
									</div>
								)}
								{weapon.damageType && (
									<div className='ch-weapon-stat'>
										<span className='ch-weapon-stat-lbl'>TYPE</span>
										<span className='ch-weapon-stat-val'>{weapon.damageType}</span>
									</div>
								)}
							</div>
							{weapon.weaponProperties && (
								<div className='ch-weapon-props'>
									{weapon.weaponProperties.split(',').filter(Boolean).map((prop, i) => (
										<span key={i} className='ch-weapon-prop'>{prop.trim()}</span>
									))}
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	)
}
