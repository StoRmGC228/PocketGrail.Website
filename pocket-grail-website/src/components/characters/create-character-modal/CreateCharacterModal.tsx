import './CreateCharacterModal.css'
import { useState } from 'react'
import { useGetMyCampaignsQuery } from '../../../api/campaignApi'
import { useCreateCharacterMutation } from '../../../api/characterApi'
import type { CreateCharacterFormValues } from '../../../types/character'

const RACES = [
	'Human', 'Half-Elf', 'Tiefling', 'Dwarf', 'Mountain Dwarf', 'Dragonborn',
	'Halfling', 'Wood Elf', 'High Elf', 'Gnome', 'Aasimar', 'Goliath',
	'Firbolg', 'Half-Orc', 'Tabaxi', 'Kenku', 'Lizardfolk',
]

const CLASSES = [
	'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk',
	'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard', 'Artificer',
]

interface CreateCharacterModalProps {
	onClose: () => void
}

export const CreateCharacterModal = ({ onClose }: CreateCharacterModalProps) => {
	const [form, setForm] = useState<CreateCharacterFormValues>({
		name: '',
		race: '',
		class: '',
		level: 1,
		campaignId: undefined,
	})
	const [error, setError] = useState('')

	const { data: campaigns } = useGetMyCampaignsQuery()
	const [createCharacter, { isLoading }] = useCreateCharacterMutation()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!form.name.trim()) { setError('Name is required.'); return }
		if (!form.race) { setError('Race is required.'); return }
		if (!form.class) { setError('Class is required.'); return }

		try {
			await createCharacter(form).unwrap()
			onClose()
		} catch {
			setError('Failed to create character. Please try again.')
		}
	}

	const set = <K extends keyof CreateCharacterFormValues>(key: K, value: CreateCharacterFormValues[K]) =>
		setForm(f => ({ ...f, [key]: value }))

	return (
		<div className="rst-modal-backdrop" onMouseDown={onClose}>
			<div className="rst-modal" onMouseDown={e => e.stopPropagation()}>
				<button className="rst-modal-close" onClick={onClose} aria-label="Close">
					<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
						<path d="M6 6 18 18M6 18 18 6"/>
					</svg>
				</button>

				<div>
					<div className="rst-modal-eyebrow">New Character</div>
					<h2>Forge a new hero</h2>
				</div>

				<p>The basics will do for now — you can fill in stats, spells, and backstory once they're on the table.</p>

				{error && <p className="rst-modal-error">{error}</p>}

				<form className="rst-form" onSubmit={handleSubmit}>
					<div className="rst-field">
						<label>Name</label>
						<input
							placeholder="e.g. Kael Veil"
							value={form.name}
							onChange={e => set('name', e.target.value)}
						/>
					</div>

					<div className="rst-field-row">
						<div className="rst-field">
							<label>Race / Species</label>
							<select value={form.race} onChange={e => set('race', e.target.value)}>
								<option value="" disabled>Choose race…</option>
								{RACES.map(r => <option key={r}>{r}</option>)}
							</select>
						</div>
						<div className="rst-field">
							<label>Class</label>
							<select value={form.class} onChange={e => set('class', e.target.value)}>
								<option value="" disabled>Choose class…</option>
								{CLASSES.map(c => <option key={c}>{c}</option>)}
							</select>
						</div>
					</div>

					<div className="rst-field-row">
						<div className="rst-field">
							<label>Starting Level</label>
							<input
								type="number"
								min={1}
								max={20}
								value={form.level}
								onChange={e => set('level', Number(e.target.value))}
							/>
						</div>
						<div className="rst-field">
							<label>Campaign (optional)</label>
							<select
								value={form.campaignId ?? ''}
								onChange={e => set('campaignId', e.target.value ? Number(e.target.value) : undefined)}
							>
								<option value="">— Unassigned —</option>
								{campaigns?.map(c => (
									<option key={c.id} value={c.id}>{c.name}</option>
								))}
							</select>
						</div>
					</div>

					<div className="rst-modal-actions">
						<button type="button" className="rst-modal-btn rst-modal-btn-ghost" onClick={onClose}>
							Cancel
						</button>
						<button type="submit" className="rst-modal-btn rst-modal-btn-primary" disabled={isLoading}>
							<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<path d="M12 5v14M5 12h14"/>
							</svg>
							{isLoading ? 'Creating…' : 'Forge hero'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
