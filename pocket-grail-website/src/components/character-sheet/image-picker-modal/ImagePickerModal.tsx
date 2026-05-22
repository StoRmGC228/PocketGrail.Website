import { useState, useRef, useCallback } from 'react'
import './ImagePickerModal.css'
import { useUpdateCharacterImageMutation } from '../../../api/characterApi'
import { cropImageToFile, PORTRAIT_RATIO } from '../../../utils/cropImage'

interface ImagePickerModalProps {
	characterId: number
	onClose: () => void
}

interface CropRect {
	x: number
	y: number
	width: number
	height: number
}

const TARGET_RATIO = PORTRAIT_RATIO

export const ImagePickerModal = ({ characterId, onClose }: ImagePickerModalProps) => {
	const [updateImage, { isLoading }] = useUpdateCharacterImageMutation()

	const [file, setFile] = useState<File | null>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const [crop, setCrop] = useState<CropRect>({ x: 0, y: 0, width: 80, height: 80 / TARGET_RATIO })
	const [error, setError] = useState('')

	const containerRef = useRef<HTMLDivElement>(null)
	const dragging = useRef(false)
	const dragStart = useRef({ mx: 0, my: 0, cx: 0, cy: 0 })

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const f = e.target.files?.[0]
		if (!f) return
		setFile(f)
		const url = URL.createObjectURL(f)
		setPreviewUrl(url)
		const probe = new Image()
		probe.onload = () => {
			const aspect = probe.naturalWidth / probe.naturalHeight
			let w = 80
			let h = w * aspect / TARGET_RATIO
			if (h > 100) { h = 100; w = h * TARGET_RATIO / aspect }
			setCrop({ x: (100 - w) / 2, y: (100 - h) / 2, width: w, height: h })
		}
		probe.src = url
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
		const newX = Math.max(0, Math.min(100 - crop.width, dragStart.current.cx + dx))
		const newY = Math.max(0, Math.min(100 - crop.height, dragStart.current.cy + dy))
		setCrop(prev => ({ ...prev, x: newX, y: newY }))
	}, [crop.width, crop.height])

	const onPointerUp = useCallback(() => {
		dragging.current = false
	}, [])

	const handleSubmit = async () => {
		if (!file) { setError('Please select an image.'); return }
		try {
			const cropped = await cropImageToFile(file, crop)
			await updateImage({ id: characterId, image: cropped }).unwrap()
			onClose()
		} catch {
			setError('Failed to upload image. Please try again.')
		}
	}

	return (
		<div className='rst-modal-backdrop' onClick={e => e.target === e.currentTarget && onClose()}>
			<div className='rst-modal rst-modal--wide'>
				<div className='rst-modal-eyebrow'>Portrait</div>
				<h2>Change Image</h2>
				<button className='rst-modal-close' onClick={onClose} type='button' aria-label='Close'>
					<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.4' strokeLinecap='round'>
						<path d='M6 6 18 18M6 18 18 6' />
					</svg>
				</button>

				<div className='imgpick-upload'>
					<label className='imgpick-upload-label'>
						<svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round'>
							<path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
							<polyline points='17 8 12 3 7 8' />
							<line x1='12' y1='3' x2='12' y2='15' />
						</svg>
						{file ? file.name : 'Choose image…'}
						<input type='file' accept='image/*' onChange={handleFileChange} className='imgpick-file-input' />
					</label>
				</div>

				{previewUrl && (
					<div className='imgpick-preview-wrap'>
						<p className='imgpick-hint'>Drag the frame to set the portrait crop area (9:11 ratio).</p>
						<div className='imgpick-container-outer'>
							<div className='imgpick-container' ref={containerRef}>
								<img src={previewUrl} alt='Preview' className='imgpick-img' draggable={false} />

								{/* Dim overlay — four pieces around the crop rect */}
								<div
									className='imgpick-dim imgpick-dim-top'
									style={{ height: `${crop.y}%` }}
								/>
								<div
									className='imgpick-dim imgpick-dim-bottom'
									style={{ height: `${100 - crop.y - crop.height}%` }}
								/>
								<div
									className='imgpick-dim imgpick-dim-left'
									style={{
										top: `${crop.y}%`,
										height: `${crop.height}%`,
										width: `${crop.x}%`,
									}}
								/>
								<div
									className='imgpick-dim imgpick-dim-right'
									style={{
										top: `${crop.y}%`,
										height: `${crop.height}%`,
										width: `${100 - crop.x - crop.width}%`,
									}}
								/>

								{/* Draggable crop rect */}
								<div
									className='imgpick-crop'
									style={{
										left: `${crop.x}%`,
										top: `${crop.y}%`,
										width: `${crop.width}%`,
										height: `${crop.height}%`,
									}}
									onPointerDown={onPointerDown}
									onPointerMove={onPointerMove}
									onPointerUp={onPointerUp}
								/>
							</div>
						</div>
					</div>
				)}

				{error && <p className='rst-modal-error'>{error}</p>}

				<div className='rst-modal-actions'>
					<button type='button' className='rst-modal-btn rst-modal-btn-ghost' onClick={onClose}>Cancel</button>
					<button
						type='button'
						className='rst-modal-btn rst-modal-btn-primary'
						onClick={handleSubmit}
						disabled={isLoading || !file}
					>
						{isLoading ? 'Uploading…' : 'Save Portrait'}
					</button>
				</div>
			</div>
		</div>
	)
}
