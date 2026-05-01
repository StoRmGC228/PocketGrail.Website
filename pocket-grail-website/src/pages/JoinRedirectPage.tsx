import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useJoinCampaignMutation, useLazyGetCampaignByCodeQuery } from '../api/campaignApi'

export const JoinRedirectPage = () => {
	const { code } = useParams<{ code: string }>()
	const navigate = useNavigate()
	const [joinCampaign] = useJoinCampaignMutation()
	const [getCampaignByCode] = useLazyGetCampaignByCodeQuery()
	const [error, setError] = useState('')

	useEffect(() => {
		if (!code) {
			setError('Invalid join link.')
			return
		}

		const autoJoin = async () => {
			try {
				// Passwordless join — the connection code is the secret
				const campaign = await joinCampaign({ connectionCode: code }).unwrap()
				navigate(`/campaigns/${campaign.id}`, { replace: true })
			} catch (err: unknown) {
				const status = (err as { status?: number })?.status

				if (status === 409) {
					// Already a participant — just navigate to the campaign page
					try {
						const campaign = await getCampaignByCode(code).unwrap()
						navigate(`/campaigns/${campaign.id}`, { replace: true })
					} catch {
						setError('Campaign not found.')
					}
				} else {
					setError('Failed to join campaign. The link may be invalid or the campaign is no longer active.')
				}
			}
		}

		autoJoin()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [code])

	if (error) {
		return (
			<div className='flex flex-col items-center justify-center py-20 px-4 gap-3'>
				<p className='text-red-400 text-sm text-center'>{error}</p>
				<button
					onClick={() => navigate('/campaigns')}
					className='text-(--color-nb) text-sm hover:underline cursor-pointer'
				>
					Browse campaigns →
				</button>
			</div>
		)
	}

	return (
		<div className='flex flex-col items-center justify-center py-20 px-4'>
			<p className='text-white/50 text-sm'>Joining campaign…</p>
		</div>
	)
}
