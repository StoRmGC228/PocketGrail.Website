import { useState, useRef } from 'react'
import { HiMiniXMark } from 'react-icons/hi2'
import { useCreateCampaignMutation } from '../../api/campaignApi'

interface CreateCampaignModalProps {
	isOpen: boolean
	onClose: () => void
}

function getErrorMessage(err: unknown): string {
	if (err && typeof err === 'object' && 'data' in err) {
		const data = (err as { data: unknown }).data
		if (data && typeof data === 'object' && 'message' in data) {
			return String((data as { message: unknown }).message)
		}
	}
	return 'Something went wrong. Please try again.'
}

export const CreateCampaignModal = ({ isOpen, onClose }: CreateCampaignModalProps) => {
	const [name, setName] = useState('')
	const [password, setPassword] = useState('')
	const [shortDescription, setShortDescription] = useState('')
	const [image, setImage] = useState<File | null>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const [error, setError] = useState('')
	const fileRef = useRef<HTMLInputElement>(null)

	const [createCampaign, { isLoading }] = useCreateCampaignMutation()

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] ?? null
		setImage(file)
		setPreviewUrl(file ? URL.createObjectURL(file) : null)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')
		try {
			await createCampaign({ name, password, shortDescription, image }).unwrap()
			handleClose()
		} catch (err) {
			setError(getErrorMessage(err))
		}
	}

	const handleClose = () => {
		setName('')
		setPassword('')
		setShortDescription('')
		setImage(null)
		setPreviewUrl(null)
		setError('')
		onClose()
	}

	if (!isOpen) return null

	const inputClass =
		'bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-lg px-4 py-3 sm:py-2 w-full text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-(--color-nb)'
	const labelClass = 'block text-white/60 text-xs mb-1'

	return (
		<div className='fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4'>
			<div className='w-full max-w-md bg-[#2d2533] border border-white/10 rounded-2xl p-6 shadow-2xl'>
				<div className='flex items-center justify-between mb-5'>
					<h2 className='text-white font-bold text-lg'>New Campaign</h2>
					<button
						onClick={handleClose}
						className='text-white/50 hover:text-white transition-colors cursor-pointer'
					>
						<HiMiniXMark size={22} />
					</button>
				</div>

				<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
					<div>
						<label className={labelClass}>Campaign Name</label>
						<input
							type='text'
							className={inputClass}
							placeholder='The Lost Mines of Phandelver'
							value={name}
							onChange={e => setName(e.target.value)}
							required
							maxLength={100}
						/>
					</div>

					<div>
						<label className={labelClass}>Password</label>
						<input
							type='password'
							className={inputClass}
							placeholder='Campaign password'
							value={password}
							onChange={e => setPassword(e.target.value)}
							required
						/>
					</div>

					<div>
						<label className={labelClass}>Short Description</label>
						<textarea
							className={`${inputClass} resize-none h-20`}
							placeholder='A brief description of your campaign...'
							value={shortDescription}
							onChange={e => setShortDescription(e.target.value)}
							required
							maxLength={500}
						/>
						<p className='text-white/30 text-xs mt-1 text-right'>{shortDescription.length}/500</p>
					</div>

					<div>
						<label className={labelClass}>Campaign Image</label>
						<div
							className='border border-dashed border-white/20 rounded-lg p-4 text-center cursor-pointer hover:border-white/40 transition-colors'
							onClick={() => fileRef.current?.click()}
						>
							{previewUrl ? (
								<img
									src={previewUrl}
									alt='Preview'
									className='w-full h-32 object-cover rounded-lg'
								/>
							) : (
								<p className='text-white/30 text-sm'>Click to upload image</p>
							)}
						</div>
						<input
							ref={fileRef}
							type='file'
							accept='image/*'
							className='hidden'
							onChange={handleFileChange}
						/>
					</div>

					{error && (
						<p className='text-red-400 text-sm text-center'>{error}</p>
					)}

					<button
						type='submit'
						disabled={isLoading}
						className='mt-1 bg-(--color-nb) text-white font-semibold py-3 sm:py-2 rounded-lg w-full text-base sm:text-sm hover:brightness-110 transition-[filter] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
					>
						{isLoading ? 'Creating…' : 'Create Campaign'}
					</button>
				</form>
			</div>
		</div>
	)
}
