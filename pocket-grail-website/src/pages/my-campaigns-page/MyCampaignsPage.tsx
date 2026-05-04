import './MyCampaignsPage.css'
import '../../components/campaigns/campaign-layout.css'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/slices/authSlice'
import { useGetMyCampaignsQuery, useDeleteCampaignMutation } from '../../api/campaignApi'
import { CampaignCard } from '../../components/campaigns/campaign-card/CampaignCard'
import { CreateCampaignModal } from '../../components/campaigns/CreateCampaignModal'
import { JoinByCodeWidget } from '../../components/campaigns/JoinByCodeWidget'
import { HiPlus, HiLink } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import type { CampaignDto } from '../../types/campaign'

export const MyCampaignsPage = () => {
	const user = useSelector(selectUser)
	const isDm = user?.role === 'DungeonMaster'
	const currentUserId = user ? parseInt(user.userId, 10) : 0
	const [modalOpen, setModalOpen] = useState(false)
	const [showCodeWidget, setShowCodeWidget] = useState(false)
	const navigate = useNavigate()

	const { data: campaigns, isLoading } = useGetMyCampaignsQuery()
	const [deleteCampaign] = useDeleteCampaignMutation()

	const handleJoinSuccess = (campaign: CampaignDto) => {
		setShowCodeWidget(false)
		navigate(`/campaigns/${campaign.id}`)
	}

	const campaignCount = campaigns?.length ?? 0

	return (
		<div className='p-6 max-w-6xl mx-auto flex flex-col gap-6'>
			<div className='page-head'>
				<div>
					<div className='vA-eyebrow'>{isDm ? 'Your worlds' : 'Your saga'}</div>
					<h1 className='page-title'>My Campaigns</h1>
					<p className='page-sub'>
						{isDm
							? `${campaignCount} realm${campaignCount !== 1 ? 's' : ''} · share the code or pass the link.`
							: `${campaignCount} active world${campaignCount !== 1 ? 's' : ''}.`}
					</p>
				</div>
				<div className='page-actions'>
					{isDm ? (
						<button className='page-btn-primary' onClick={() => setModalOpen(true)}>
							<HiPlus size={14} /> New Campaign
						</button>
					) : (
						<button className='page-btn-ghost' onClick={() => setShowCodeWidget(true)}>
							<HiLink size={14} /> Join by Code
						</button>
					)}
				</div>
			</div>

			{isLoading && (
				<p className='text-white/50 text-sm text-center py-10'>Loading…</p>
			)}

			{!isLoading && (!campaigns || campaigns.length === 0) && (
				<div className='text-center py-16'>
					<p className='text-white/40 text-sm mb-3'>No campaigns yet.</p>
					{!isDm && (
						<Link to='/campaigns' className='text-(--color-nb) text-sm hover:underline'>
							Browse active campaigns →
						</Link>
					)}
				</div>
			)}

			{campaigns && campaigns.length > 0 && (
				<div className='cc-grid'>
					{campaigns.map(campaign => {
						const isOwner = isDm && campaign.dmOwnerId === currentUserId
						return (
							<CampaignCard
								key={campaign.id}
								campaign={campaign}
								showCode={isOwner}
								isOwner={isOwner}
								joined={!isDm}
								onClick={() => navigate(`/campaigns/${campaign.id}`)}
								onDelete={() => deleteCampaign(campaign.id)}
							/>
						)
					})}
				</div>
			)}

			<CreateCampaignModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

			{showCodeWidget && (
				<JoinByCodeWidget
					onSuccess={handleJoinSuccess}
					onClose={() => setShowCodeWidget(false)}
				/>
			)}
		</div>
	)
}
