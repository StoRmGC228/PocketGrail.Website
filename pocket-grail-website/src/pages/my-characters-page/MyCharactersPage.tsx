import './MyCharactersPage.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetMyCharactersQuery, useDeleteCharacterMutation } from '../../api/characterApi'
import { CharacterCard } from '../../components/characters/character-card/CharacterCard'
import { CreateCharacterModal } from '../../components/characters/create-character-modal/CreateCharacterModal'
import { DeleteCharacterModal } from '../../components/characters/delete-character-modal/DeleteCharacterModal'
import type { CharacterDto } from '../../types/character'

const PER_PAGE = 8

export const MyCharactersPage = () => {
	const navigate = useNavigate()
	const { data: characters, isLoading } = useGetMyCharactersQuery()
	const [deleteCharacter, { isLoading: isDeleting }] = useDeleteCharacterMutation()

	const [page, setPage] = useState(1)
	const [delMode, setDelMode] = useState(false)
	const [modal, setModal] = useState<'create' | 'delete' | null>(null)
	const [target, setTarget] = useState<CharacterDto | null>(null)

	const total = characters?.length ?? 0
	const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))
	const start = (page - 1) * PER_PAGE
	const visible = characters?.slice(start, start + PER_PAGE) ?? []

	const handleDeleteRequest = (c: CharacterDto) => {
		setTarget(c)
		setModal('delete')
	}

	const handleConfirmDelete = async () => {
		if (!target) return
		await deleteCharacter(target.id).unwrap()
		setModal(null)
		setTarget(null)
		if (page > 1 && visible.length === 1) setPage(p => p - 1)
	}

	return (
		<div className="rst-page">
			{/* Header */}
			<div className="rst-header">
				<div>
					<div className="rst-title-eyebrow">
						Roster · {total === 0 ? 'empty' : `${total} ${total === 1 ? 'hero' : 'heroes'}`}
					</div>
					<h1 className="rst-title">Your Characters</h1>
				</div>
				<div className="rst-actionpill" data-delmode={delMode || undefined}>
					<button className="rst-actionbtn rst-actionbtn-add" onClick={() => setModal('create')}>
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<path d="M12 5v14M5 12h14"/>
						</svg>
						New
					</button>
					<button className="rst-actionbtn rst-actionbtn-del" onClick={() => setDelMode(d => !d)}>
						<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
							<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
							<path d="m19 6-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
						</svg>
						<span>{delMode ? 'Done' : 'Manage'}</span>
					</button>
				</div>
			</div>

			{/* Delete mode banner */}
			{delMode && (
				<div className="rst-delmode-banner">
					<span><b>Delete mode active</b> — tap the × on any card to remove that hero. This can't be undone.</span>
					<button className="rst-delmode-banner-cancel" onClick={() => setDelMode(false)}>Exit</button>
				</div>
			)}

			{/* Loading */}
			{isLoading && (
				<p style={{ color: 'var(--text-faint)', fontSize: 14, textAlign: 'center', padding: '40px 0' }}>
					Loading…
				</p>
			)}

			{/* Empty state */}
			{!isLoading && total === 0 && (
				<div className="rst-empty">
					<div className="rst-empty-glyph">
						<svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
							<path d="M24 6 8 12v9c0 9 7 17 16 21 9-4 16-12 16-21v-9z"/>
							<path d="M18 22h12M24 16v12" opacity=".7"/>
							<circle cx="24" cy="22" r="2.5" fill="currentColor" opacity=".4"/>
						</svg>
					</div>
					<h2>No heroes yet</h2>
					<p>Roll up your first character to step into a campaign. We'll keep their sheet, dice, and story right here.</p>
					<button className="rst-empty-cta" onClick={() => setModal('create')}>
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<path d="M12 5v14M5 12h14"/>
						</svg>
						Forge your first hero
					</button>
				</div>
			)}

			{/* Grid */}
			{!isLoading && total > 0 && (
				<div
					className="rst-grid"
					data-layout="portrait-left"
					data-delmode={delMode || undefined}
				>
					{visible.map(c => (
						<CharacterCard
							key={c.id}
							character={c}
							delMode={delMode}
							onClick={() => !delMode && navigate(`/characters/${c.id}`)}
							onDelete={handleDeleteRequest}
						/>
					))}
				</div>
			)}

			{/* Pagination */}
			{totalPages > 1 && (
				<Pager page={page} totalPages={totalPages} onPage={setPage} />
			)}

			{/* Modals */}
			{modal === 'create' && (
				<CreateCharacterModal onClose={() => setModal(null)} />
			)}
			{modal === 'delete' && target && (
				<DeleteCharacterModal
					character={target}
					onClose={() => { setModal(null); setTarget(null) }}
					onConfirm={handleConfirmDelete}
					isLoading={isDeleting}
				/>
			)}
		</div>
	)
}

interface PagerProps {
	page: number
	totalPages: number
	onPage: (p: number) => void
}

const Pager = ({ page, totalPages, onPage }: PagerProps) => {
	const window2 = new Set([1, totalPages, page, page - 1, page + 1])
	const nums: number[] = []
	for (let i = 1; i <= totalPages; i++) if (window2.has(i)) nums.push(i)

	const items: Array<{ n?: number; ellipsis?: boolean; key: string }> = []
	let prev = 0
	nums.forEach(n => {
		if (prev && n - prev > 1) items.push({ ellipsis: true, key: `e${n}` })
		items.push({ n, key: String(n) })
		prev = n
	})

	return (
		<nav className="rst-pager" aria-label="Pagination">
			<button className="rst-page-btn" disabled={page === 1} onClick={() => onPage(page - 1)}>
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<path d="M15 18 9 12l6-6"/>
				</svg>
				Prev
			</button>
			{items.map(it => it.ellipsis
				? <span key={it.key} className="rst-page-ellipsis">…</span>
				: <button key={it.key} className="rst-page-btn" data-active={it.n === page || undefined} onClick={() => onPage(it.n!)}>
					{it.n}
				</button>
			)}
			<button className="rst-page-btn" disabled={page === totalPages} onClick={() => onPage(page + 1)}>
				Next
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<path d="M9 18 15 12 9 6"/>
				</svg>
			</button>
		</nav>
	)
}
