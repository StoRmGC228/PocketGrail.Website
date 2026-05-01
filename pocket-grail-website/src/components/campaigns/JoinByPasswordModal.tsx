import { useState } from 'react'
import { HiMiniXMark } from 'react-icons/hi2'
import { useJoinCampaignMutation } from '../../api/campaignApi'
import type { CampaignDto } from '../../types/campaign'

interface JoinByPasswordModalProps {
	campaign: CampaignDto | null
	onClose: () => void
	onSuccess?: (campaign: CampaignDto) => void
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

export const JoinByPasswordModal = ({ campaign, onClose, onSuccess }: JoinByPasswordModalProps) => {
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')

	const [joinCampaign, { isLoading }] = useJoinCampaignMutation()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!campaign) return
		setError('')
		try {
			const result = await joinCampaign({ campaignId: campaign.id, password }).unwrap()
			onSuccess?.(result)
			handleClose()
		} catch (err) {
			setError(getErrorMessage(err))
		}
	}

	const handleClose = () => {
		setPassword('')
		setError('')
		onClose()
	}

	if (!campaign) return null

	return (
		<div className='fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4'>
			<div className='w-full max-w-sm bg-[#2d2533] border border-white/10 rounded-2xl p-6 shadow-2xl'>
				<div className='flex items-center justify-between mb-5'>
					<h2 className='text-white font-bold text-base'>{campaign.name}</h2>
					<button
						onClick={handleClose}
						className='text-white/50 hover:text-white transition-colors cursor-pointer'
					>
						<HiMiniXMark size={22} />
					</button>
				</div>

				<p className='text-white/50 text-sm mb-5'>{campaign.shortDescription}</p>

				<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
					<div>
						<label className='block text-white/60 text-xs mb-1'>Campaign Password</label>
						<input
							type='password'
							className='bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-lg px-4 py-3 sm:py-2 w-full text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-(--color-nb)'
							placeholder='Enter campaign password'
							value={password}
							onChange={e => setPassword(e.target.value)}
							required
							autoFocus
						/>
					</div>

					{error && <p className='text-red-400 text-sm text-center'>{error}</p>}

					<button
						type='submit'
						disabled={isLoading || !password}
						className='bg-(--color-nb) text-white font-semibold py-3 sm:py-2 rounded-lg w-full text-base sm:text-sm hover:brightness-110 transition-[filter] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
					>
						{isLoading ? 'Joining…' : 'Join Campaign'}
					</button>
				</form>
			</div>
		</div>
	)
}
