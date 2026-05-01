import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { CampaignDto, CreateCampaignFormValues, JoinCampaignRequest } from '../types/campaign'

export const campaignApi = createApi({
	reducerPath: 'campaignApi',
	baseQuery: fetchBaseQuery({
		baseUrl: import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:7228/api',
		credentials: 'include',
	}),
	tagTypes: ['Campaign', 'MyCampaigns'],
	endpoints: builder => ({
		getActiveCampaigns: builder.query<CampaignDto[], void>({
			query: () => 'Campaigns',
			providesTags: ['Campaign'],
		}),
		getMyCampaigns: builder.query<CampaignDto[], void>({
			query: () => 'Campaigns/mine',
			providesTags: ['MyCampaigns'],
		}),
		getCampaignById: builder.query<CampaignDto, number>({
			query: id => `Campaigns/by-id/${id}`,
		}),
		getCampaignByCode: builder.query<CampaignDto, string>({
			query: code => `Campaigns/${code}`,
		}),
		createCampaign: builder.mutation<CampaignDto, CreateCampaignFormValues>({
			query: ({ name, password, shortDescription, image }) => {
				const body = new FormData()
				body.append('name', name)
				body.append('password', password)
				body.append('shortDescription', shortDescription)
				if (image) body.append('image', image)
				return { url: 'Campaigns', method: 'POST', body }
			},
			invalidatesTags: ['MyCampaigns'],
		}),
		joinCampaign: builder.mutation<CampaignDto, JoinCampaignRequest>({
			query: body => ({ url: 'Campaigns/join', method: 'POST', body }),
			invalidatesTags: ['Campaign', 'MyCampaigns'],
		}),
		deleteCampaign: builder.mutation<void, number>({
			query: id => ({ url: `Campaigns/${id}`, method: 'DELETE' }),
			invalidatesTags: ['Campaign', 'MyCampaigns'],
		}),
		leaveCampaign: builder.mutation<void, number>({
			query: id => ({ url: `Campaigns/${id}/leave`, method: 'DELETE' }),
			invalidatesTags: ['Campaign', 'MyCampaigns'],
		}),
	}),
})

export const {
	useGetActiveCampaignsQuery,
	useGetMyCampaignsQuery,
	useGetCampaignByIdQuery,
	useLazyGetCampaignByCodeQuery,
	useLazyGetCampaignByIdQuery,
	useCreateCampaignMutation,
	useJoinCampaignMutation,
	useDeleteCampaignMutation,
	useLeaveCampaignMutation,
} = campaignApi
