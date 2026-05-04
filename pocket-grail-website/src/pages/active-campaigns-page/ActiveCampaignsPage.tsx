import './ActiveCampaignsPage.css'
import '../../components/campaigns/campaign-layout.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/slices/authSlice'
import { useGetActiveCampaignsQuery, useGetMyCampaignsQuery } from '../../api/campaignApi'
import { CampaignCard } from '../../components/campaigns/campaign-card/CampaignCard'
import { JoinByCodeWidget } from '../../components/campaigns/JoinByCodeWidget'
import { JoinByPasswordModal } from '../../components/campaigns/JoinByPasswordModal'
import { CreateCampaignModal } from '../../components/campaigns/CreateCampaignModal'
import { HiLink, HiPlus } from 'react-icons/hi'
import type { CampaignDto } from '../../types/campaign'

const FILTER_CHIPS = ['All', '5e', 'PF2e', 'Custom', 'Open Seats', 'Live now']

export const ActiveCampaignsPage = () => {
	const { data: campaigns, isLoading } = useGetActiveCampaignsQuery()
	const { data: myCampaigns } = useGetMyCampaignsQuery()
	const [showCodeWidget, setShowCodeWidget] = useState(false)
	const [showCreateModal, setShowCreateModal] = useState(false)
	const [selectedCampaign, setSelectedCampaign] = useState<CampaignDto | null>(null)
	const [activeFilter, setActiveFilter] = useState('All')
	const navigate = useNavigate()
	const user = useSelector(selectUser)
	const isDm = user?.role === 'DungeonMaster'

	const myIds = new Set(myCampaigns?.map(c => c.id) ?? [])

	const handleJoinSuccess = (campaign: CampaignDto) => {
		setSelectedCampaign(null)
		setShowCodeWidget(false)
		navigate(`/campaigns/${campaign.id}`)
	}

	const handleCardClick = (campaign: CampaignDto) => {
		// DMs always navigate directly; players who already joined also navigate directly
		if (isDm || myIds.has(campaign.id)) {
			navigate(`/campaigns/${campaign.id}`)
		} else {
			setSelectedCampaign(campaign)
		}
	}

	return (
		<div className='p-6 max-w-6xl mx-auto flex flex-col gap-6'>
			<div className='page-head'>
				<div>
					<div className='vA-eyebrow'>Public Realms</div>
					<h1 className='page-title'>Active Campaigns</h1>
					<p className='page-sub'>Sit at a stranger's table. New seats open every day.</p>
				</div>
				<div className='page-actions'>
					<button className='page-btn-ghost' onClick={() => setShowCodeWidget(true)}>
						<HiLink size={14} /> Join by Code
					</button>
					{isDm && (
						<button className='page-btn-primary' onClick={() => setShowCreateModal(true)}>
							<HiPlus size={14} /> Host Campaign
						</button>
					)}
				</div>
			</div>

			<div className='page-filters'>
				{FILTER_CHIPS.map(chip => (
					<button
						key={chip}
						className='filter-chip'
						{...(chip === activeFilter ? { 'data-active': '' } : {})}
						onClick={() => setActiveFilter(chip)}
					>
						{chip}
					</button>
				))}
			</div>

			{isLoading && (
				<p className='text-white/50 text-sm text-center py-10'>Loading…</p>
			)}

			{!isLoading && (!campaigns || campaigns.length === 0) && (
				<p className='text-white/40 text-sm text-center py-16'>No active campaigns yet.</p>
			)}

			{campaigns && campaigns.length > 0 && (
				<div className='cc-grid'>
					{campaigns.map(campaign => (
						<CampaignCard
							key={campaign.id}
							campaign={campaign}
							joined={!isDm && myIds.has(campaign.id)}
							onClick={() => handleCardClick(campaign)}
						/>
					))}
				</div>
			)}

			{showCodeWidget && (
				<JoinByCodeWidget
					onSuccess={handleJoinSuccess}
					onClose={() => setShowCodeWidget(false)}
				/>
			)}

			{!isDm && (
				<JoinByPasswordModal
					campaign={selectedCampaign}
					onClose={() => setSelectedCampaign(null)}
					onSuccess={handleJoinSuccess}
				/>
			)}

			<CreateCampaignModal
				isOpen={showCreateModal}
				onClose={() => setShowCreateModal(false)}
			/>
		</div>
	)
}
