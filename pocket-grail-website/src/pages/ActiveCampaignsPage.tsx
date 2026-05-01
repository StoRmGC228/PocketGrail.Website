import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUser } from '../redux/slices/authSlice'
import { useGetActiveCampaignsQuery } from '../api/campaignApi'
import { CampaignCard } from '../components/campaigns/CampaignCard'
import { JoinByCodeWidget } from '../components/campaigns/JoinByCodeWidget'
import { JoinByPasswordModal } from '../components/campaigns/JoinByPasswordModal'
import type { CampaignDto } from '../types/campaign'

export const ActiveCampaignsPage = () => {
	const { data: campaigns, isLoading } = useGetActiveCampaignsQuery()
	const [showCodeWidget, setShowCodeWidget] = useState(false)
	const [selectedCampaign, setSelectedCampaign] = useState<CampaignDto | null>(null)
	const navigate = useNavigate()
	const user = useSelector(selectUser)
	const isDm = user?.role === 'DungeonMaster'

	const handleJoinSuccess = (campaign: CampaignDto) => {
		setSelectedCampaign(null)
		setShowCodeWidget(false)
		navigate(`/campaigns/${campaign.id}`)
	}

	const handleCardClick = (campaign: CampaignDto) => {
		// DMs go straight to the campaign page — they don't need to join
		if (isDm) {
			navigate(`/campaigns/${campaign.id}`)
		} else {
			setSelectedCampaign(campaign)
		}
	}

	return (
		<div className='p-6 max-w-5xl mx-auto'>
			<div className='flex items-center justify-between mb-6'>
				<h1 className='text-white text-2xl font-bold'>Active Campaigns</h1>
				<button
					onClick={() => setShowCodeWidget(true)}
					className='bg-white/10 border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/15 transition-colors cursor-pointer'
				>
					Join by Code
				</button>
			</div>

			{isLoading && (
				<p className='text-white/50 text-sm text-center py-10'>Loading…</p>
			)}

			{!isLoading && (!campaigns || campaigns.length === 0) && (
				<p className='text-white/40 text-sm text-center py-16'>No active campaigns yet.</p>
			)}

			{campaigns && campaigns.length > 0 && (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{campaigns.map(campaign => (
						<CampaignCard
							key={campaign.id}
							campaign={campaign}
							onClick={() => handleCardClick(campaign)}
						/>
					))}
				</div>
			)}

			{/* Code join modal */}
			{showCodeWidget && (
				<JoinByCodeWidget
					onSuccess={handleJoinSuccess}
					onClose={() => setShowCodeWidget(false)}
				/>
			)}

			{/* Password modal — players only */}
			{!isDm && (
				<JoinByPasswordModal
					campaign={selectedCampaign}
					onClose={() => setSelectedCampaign(null)}
					onSuccess={handleJoinSuccess}
				/>
			)}
		</div>
	)
}
