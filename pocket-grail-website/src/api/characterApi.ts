import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { CharacterDto, CreateCharacterFormValues, UpdateCharacterFormValues } from '../types/character'

export const characterApi = createApi({
	reducerPath: 'characterApi',
	baseQuery: fetchBaseQuery({
		baseUrl: import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:7228/api',
		credentials: 'include',
	}),
	tagTypes: ['Character'],
	endpoints: builder => ({
		getMyCharacters: builder.query<CharacterDto[], void>({
			query: () => 'Characters/mine',
			providesTags: ['Character'],
		}),
		getCharacterById: builder.query<CharacterDto, number>({
			query: id => `Characters/${id}`,
			providesTags: ['Character'],
		}),
		createCharacter: builder.mutation<CharacterDto, CreateCharacterFormValues>({
			query: ({ name, race, class: cls, level, campaignId, image }) => {
				const body = new FormData()
				body.append('name', name)
				body.append('race', race)
				body.append('class', cls)
				body.append('level', String(level))
				if (campaignId) body.append('campaignId', String(campaignId))
				if (image) body.append('image', image)
				return { url: 'Characters', method: 'POST', body }
			},
			invalidatesTags: ['Character'],
		}),
		updateCharacter: builder.mutation<CharacterDto, UpdateCharacterFormValues>({
			query: ({ id, name, race, class: cls, level, currentHp, maxHp, campaignId, image }) => {
				const body = new FormData()
				if (name) body.append('name', name)
				if (race) body.append('race', race)
				if (cls) body.append('class', cls)
				if (level !== undefined) body.append('level', String(level))
				if (currentHp !== undefined) body.append('currentHp', String(currentHp))
				if (maxHp !== undefined) body.append('maxHp', String(maxHp))
				if (campaignId !== undefined) body.append('campaignId', String(campaignId))
				if (image) body.append('image', image)
				return { url: `Characters/${id}`, method: 'PUT', body }
			},
			invalidatesTags: ['Character'],
		}),
		deleteCharacter: builder.mutation<void, number>({
			query: id => ({ url: `Characters/${id}`, method: 'DELETE' }),
			invalidatesTags: ['Character'],
		}),
	}),
})

export const {
	useGetMyCharactersQuery,
	useGetCharacterByIdQuery,
	useCreateCharacterMutation,
	useUpdateCharacterMutation,
	useDeleteCharacterMutation,
} = characterApi
