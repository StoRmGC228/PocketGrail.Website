import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUser } from '../redux/slices/authSlice'
import { useGetMyCampaignsQuery, useDeleteCampaignMutation } from '../api/campaignApi'
import { CampaignCard } from '../components/campaigns/CampaignCard'
import { CreateCampaignModal } from '../components/campaigns/CreateCampaignModal'

export const MyCampaignsPage = () => {
	const user = useSelector(selectUser)
	const isDm = user?.role === 'DungeonMaster'
	const [modalOpen, setModalOpen] = useState(false)

	const { data: campaigns, isLoading } = useGetMyCampaignsQuery()
	const [deleteCampaign] = useDeleteCampaignMutation()

	return (
		<div className='p-6 max-w-5xl mx-auto'>
			<div className='flex items-center justify-between mb-6'>
				<h1 className='text-white text-2xl font-bold'>My Campaigns</h1>
				{isDm && (
					<button
						onClick={() => setModalOpen(true)}
						className='bg-(--color-nb) text-white text-sm font-semibold px-4 py-2 rounded-lg hover:brightness-110 transition-[filter] cursor-pointer'
					>
						+ New Campaign
					</button>
				)}
			</div>

			{isLoading && (
				<p className='text-white/50 text-sm text-center py-10'>Loading…</p>
			)}

			{!isLoading && (!campaigns || campaigns.length === 0) && (
				<div className='text-center py-16'>
					<p className='text-white/40 text-sm mb-3'>No campaigns yet.</p>
					{!isDm && (
						<Link
							to='/campaigns'
							className='text-(--color-nb) text-sm hover:underline'
						>
							Browse active campaigns →
						</Link>
					)}
				</div>
			)}

			{campaigns && campaigns.length > 0 && (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{campaigns.map(campaign => (
						<CampaignCard
							key={campaign.id}
							campaign={campaign}
							showCode={isDm}
							isOwner={isDm && campaign.dmOwnerId === parseInt(user?.userId ?? '', 10)}
							onDelete={() => deleteCampaign(campaign.id)}
						/>
					))}
				</div>
			)}

			<CreateCampaignModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
		</div>
	)
}
