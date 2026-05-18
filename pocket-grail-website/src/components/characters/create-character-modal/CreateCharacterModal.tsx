import './CreateCharacterModal.css'
import { useState, useRef, useCallback } from 'react'
import { useGetMyCampaignsQuery } from '../../../api/campaignApi'
import { useCreateCharacterMutation, useUpdateCharacterImageMutation } from '../../../api/characterApi'
import { useGetRacesQuery } from '../../../api/raceApi'
import { useGetClassesQuery, useGetStartingItemsQuery } from '../../../api/classApi'
import type { CreateCharacterFormValues } from '../../../types/character'
import { RaceChoicesModal } from '../race-choices-modal/RaceChoicesModal'
import { ClassChoicesModal } from '../class-choices-modal/ClassChoicesModal'

type Step = 'form' | 'race-choices' | 'class-choices'
type FlexBonuses = Pick<CreateCharacterFormValues,
	'flexStrBonus' | 'flexDexBonus' | 'flexConBonus' | 'flexIntBonus' | 'flexWisBonus' | 'flexChaBonus'>

interface CropRect { x: number; y: number; width: number; height: number }
const TARGET_RATIO = 7 / 9

interface CreateCharacterModalProps {
	onClose: () => void
}

const defaultForm = (): CreateCharacterFormValues => ({
	name: '',
	race: '',
	className: '',
	startLevel: 1,
	subclassId: undefined,
	campaignId: undefined,
	image: null,
	imageCrop: null,
	strScore: 10, dexScore: 10, conScore: 10, intScore: 10, wisScore: 10, chaScore: 10,
	flexStrBonus: 0, flexDexBonus: 0, flexConBonus: 0, flexIntBonus: 0, flexWisBonus: 0, flexChaBonus: 0,
	startingItemIds: [],
	skillChoices: [],
	weaponChoices: [], armorChoices: [], languageChoices: [], instrumentChoices: [],
})

export const CreateCharacterModal = ({ onClose }: CreateCharacterModalProps) => {
	const [form, setForm] = useState<CreateCharacterFormValues>(defaultForm)
	const [step, setStep] = useState<Step>('form')
	const [error, setError] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)

	// Image crop state
	const [imageFile, setImageFile] = useState<File | null>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const [crop, setCrop] = useState<CropRect>({ x: 25, y: 0, width: 50, height: 50 / TARGET_RATIO })
	const containerRef = useRef<HTMLDivElement>(null)
	const dragging = useRef(false)
	const dragStart = useRef({ mx: 0, my: 0, cx: 0, cy: 0 })

	const { data: campaigns } = useGetMyCampaignsQuery()
	const { data: races = [] } = useGetRacesQuery()
	const { data: classes = [] } = useGetClassesQuery()
	const [createCharacter] = useCreateCharacterMutation()
	const [updateCharacterImage] = useUpdateCharacterImageMutation()

	const { data: startingItems } = useGetStartingItemsQuery(form.className, {
		skip: !form.className,
	})

	const selectedRace = races.find(r => r.name === form.race) ?? null
	const selectedClass = classes.find(c => c.name === form.className) ?? null

	const set = <K extends keyof CreateCharacterFormValues>(key: K, value: CreateCharacterFormValues[K]) =>
		setForm(f => ({ ...f, [key]: value }))

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const f = e.target.files?.[0]
		if (!f) return
		setImageFile(f)
		setPreviewUrl(URL.createObjectURL(f))
		const w = 50
		setCrop({ x: (100 - w) / 2, y: (100 - w / TARGET_RATIO) / 2, width: w, height: w / TARGET_RATIO })
	}

	const onPointerDown = useCallback((e: React.PointerEvent) => {
		e.currentTarget.setPointerCapture(e.pointerId)
		dragging.current = true
		dragStart.current = { mx: e.clientX, my: e.clientY, cx: crop.x, cy: crop.y }
	}, [crop])

	const onPointerMove = useCallback((e: React.PointerEvent) => {
		if (!dragging.current || !containerRef.current) return
		const rect = containerRef.current.getBoundingClientRect()
		const dx = ((e.clientX - dragStart.current.mx) / rect.width) * 100
		const dy = ((e.clientY - dragStart.current.my) / rect.height) * 100
		setCrop(prev => ({
			...prev,
			x: Math.max(0, Math.min(100 - prev.width, dragStart.current.cx + dx)),
			y: Math.max(0, Math.min(100 - prev.height, dragStart.current.cy + dy)),
		}))
	}, [])

	const onPointerUp = useCallback(() => { dragging.current = false }, [])

	const submit = async (finalForm: CreateCharacterFormValues) => {
		setIsSubmitting(true)
		setError('')
		try {
			const char = await createCharacter({ ...finalForm, image: null }).unwrap()
			if (imageFile) {
				await updateCharacterImage({
					id: char.id,
					image: imageFile,
					cropX: Math.round(crop.x),
					cropY: Math.round(crop.y),
					cropWidth: Math.round(crop.width),
					cropHeight: Math.round(crop.height),
				}).unwrap()
			}
			onClose()
		} catch {
			setError('Failed to create character. Please try again.')
			setStep('form')
		} finally {
			setIsSubmitting(false)
		}
	}

	const needsClassChoices =
		((selectedClass?.skillChoiceCount ?? 0) > 0 && (selectedClass?.availableSkillChoices?.length ?? 0) > 0)
		|| (startingItems?.choicePairs.length ?? 0) > 0

	const handleFormNext = (e: React.FormEvent) => {
		e.preventDefault()
		if (!form.name.trim()) { setError('Name is required.'); return }
		if (!form.race) { setError('Race is required.'); return }
		if (!form.className) { setError('Class is required.'); return }
		setError('')

		if ((selectedRace?.flexBonusSlots ?? []).length > 0) {
			setStep('race-choices')
		} else if (needsClassChoices) {
			setStep('class-choices')
		} else {
			submit(form)
		}
	}

	const handleRaceChoicesConfirm = (flexBonuses: FlexBonuses) => {
		const updated = { ...form, ...flexBonuses }
		setForm(updated)
		if (needsClassChoices) {
			setStep('class-choices')
		} else {
			submit(updated)
		}
	}

	const handleClassChoicesConfirm = (choices: { skillChoices: string[]; startingItemIds: number[] }) => {
		const updated = { ...form, ...choices }
		setForm(updated)
		submit(updated)
	}

	if (step === 'race-choices' && selectedRace) {
		return (
			<RaceChoicesModal
				race={selectedRace}
				onConfirm={handleRaceChoicesConfirm}
				onBack={() => setStep('form')}
			/>
		)
	}

	if (step === 'class-choices' && selectedClass) {
		return (
			<ClassChoicesModal
				cls={selectedClass}
				startingItems={startingItems ?? { choicePairs: [] }}
				onConfirm={handleClassChoicesConfirm}
				onBack={() => setStep(
					selectedRace && (selectedRace.flexBonusSlots?.length ?? 0) > 0 ? 'race-choices' : 'form'
				)}
				isSubmitting={isSubmitting}
			/>
		)
	}

	return (
		<div className="rst-modal-backdrop" onMouseDown={onClose}>
			<div className="rst-modal ccm-modal" onMouseDown={e => e.stopPropagation()}>
				<button className="rst-modal-close" onClick={onClose} aria-label="Close">
					<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
						<path d="M6 6 18 18M6 18 18 6"/>
					</svg>
				</button>

				<div>
					<div className="rst-modal-eyebrow">New Character</div>
					<h2>Forge a new hero</h2>
				</div>

				<p>Choose your race, class, and level — then resolve any choices to complete creation.</p>

				{error && <p className="rst-modal-error">{error}</p>}

				<form className="rst-form" onSubmit={handleFormNext}>
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
							<select value={form.race} onChange={e => {
								setForm(f => ({ ...f, race: e.target.value, flexStrBonus: 0, flexDexBonus: 0, flexConBonus: 0, flexIntBonus: 0, flexWisBonus: 0, flexChaBonus: 0 }))
							}}>
								<option value="" disabled>Choose race…</option>
								{races.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
							</select>
						</div>
						<div className="rst-field">
							<label>Class</label>
							<select value={form.className} onChange={e => {
								setForm(f => ({ ...f, className: e.target.value, subclassId: undefined, skillChoices: [] }))
							}}>
								<option value="" disabled>Choose class…</option>
								{classes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
							</select>
						</div>
					</div>

					<div className="rst-field-row">
						<div className="rst-field">
							<label>Start Level</label>
							<input
								type="number"
								min={1}
								max={20}
								value={form.startLevel}
								onChange={e => setForm(f => ({
									...f,
									startLevel: Math.max(1, Math.min(20, Number(e.target.value) || 1)),
									subclassId: undefined,
								}))}
							/>
						</div>
						{form.startLevel >= 3 && form.className && (selectedClass?.subclasses.length ?? 0) > 0 && (
							<div className="rst-field">
								<label>Subclass</label>
								<select
									value={form.subclassId ?? ''}
									onChange={e => set('subclassId', e.target.value ? Number(e.target.value) : undefined)}
								>
									<option value="">— None —</option>
									{selectedClass?.subclasses.map(s => (
										<option key={s.id} value={s.id}>{s.name}</option>
									))}
								</select>
							</div>
						)}
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

					<div className="rst-field">
						<label>Portrait (optional)</label>
						<label className="ccm-img-upload">
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
								<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
								<polyline points="17 8 12 3 7 8"/>
								<line x1="12" y1="3" x2="12" y2="15"/>
							</svg>
							{imageFile ? imageFile.name : 'Choose image…'}
							<input type="file" accept="image/*" onChange={handleFileChange} className="ccm-img-file-input" />
						</label>
					</div>

					{previewUrl && (
						<div className="ccm-img-preview-wrap">
							<span className="ccm-img-hint">Drag the frame to crop your portrait (7:9 ratio).</span>
							<div className="ccm-img-container" ref={containerRef}>
								<img src={previewUrl} alt="Preview" className="ccm-img" draggable={false} />
								<div className="ccm-img-dim ccm-img-dim-top" style={{ height: `${crop.y}%` }} />
								<div className="ccm-img-dim ccm-img-dim-bottom" style={{ height: `${100 - crop.y - crop.height}%` }} />
								<div className="ccm-img-dim ccm-img-dim-left" style={{ top: `${crop.y}%`, height: `${crop.height}%`, width: `${crop.x}%` }} />
								<div className="ccm-img-dim ccm-img-dim-right" style={{ top: `${crop.y}%`, height: `${crop.height}%`, width: `${100 - crop.x - crop.width}%` }} />
								<div
									className="ccm-img-crop"
									style={{ left: `${crop.x}%`, top: `${crop.y}%`, width: `${crop.width}%`, height: `${crop.height}%` }}
									onPointerDown={onPointerDown}
									onPointerMove={onPointerMove}
									onPointerUp={onPointerUp}
								/>
							</div>
						</div>
					)}

					<div className="rst-modal-actions">
						<button type="button" className="rst-modal-btn rst-modal-btn-ghost" onClick={onClose}>
							Cancel
						</button>
						<button type="submit" className="rst-modal-btn rst-modal-btn-primary" disabled={isSubmitting}>
							<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<path d="M5 12h14M12 5l7 7-7 7"/>
							</svg>
							{isSubmitting ? 'Creating…' : 'Next'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
