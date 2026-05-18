import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
	CharacterDto,
	CharacterDetailDto,
	CreateCharacterFormValues,
	UpdateCharacterFormValues,
	UpdateStatsRequest,
	UpdateVitalsRequest,
	UpdateWalletRequest,
	AddItemRequest,
	UpdateItemRequest,
	AddSpellRequest,
	AddFeatRequest,
	AddFeatureRequest,
	AddProficiencyRequest,
	UpdateSpellSlotRequest,
	ItemDto,
	SpellDto,
	FeatDto,
	FeatureDto,
	ProficiencyDto,
	SpellSlotDto,
	AllyDto,
} from '../types/character'

export const characterApi = createApi({
	reducerPath: 'characterApi',
	baseQuery: fetchBaseQuery({
		baseUrl: import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:7228/api',
		credentials: 'include',
	}),
	tagTypes: ['Character', 'CharacterSheet'],
	endpoints: builder => ({
		getMyCharacters: builder.query<CharacterDto[], void>({
			query: () => 'Characters/mine',
			providesTags: ['Character'],
		}),
		getCharacterById: builder.query<CharacterDto, number>({
			query: id => `Characters/${id}`,
			providesTags: ['Character'],
		}),
		getCharacterDetail: builder.query<CharacterDetailDto, number>({
			query: id => `Characters/${id}/sheet`,
			providesTags: ['CharacterSheet'],
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
			query: ({ id, name, race, class: cls, subclass, level, currentHp, maxHp, campaignId, image, alignment, spellAbility, backgroundStory, appearance, notes }) => {
				const body = new FormData()
				if (name) body.append('name', name)
				if (race) body.append('race', race)
				if (cls) body.append('class', cls)
				if (subclass !== undefined) body.append('subclass', subclass)
				if (level !== undefined) body.append('level', String(level))
				if (currentHp !== undefined) body.append('currentHp', String(currentHp))
				if (maxHp !== undefined) body.append('maxHp', String(maxHp))
				if (campaignId !== undefined) body.append('campaignId', String(campaignId))
				if (image) body.append('image', image)
				if (alignment !== undefined) body.append('alignment', alignment)
				if (spellAbility !== undefined) body.append('spellAbility', spellAbility)
				if (backgroundStory !== undefined) body.append('backgroundStory', backgroundStory)
				if (appearance !== undefined) body.append('appearance', appearance)
				if (notes !== undefined) body.append('notes', notes)
				return { url: `Characters/${id}`, method: 'PUT', body }
			},
			invalidatesTags: ['Character', 'CharacterSheet'],
		}),
		deleteCharacter: builder.mutation<void, number>({
			query: id => ({ url: `Characters/${id}`, method: 'DELETE' }),
			invalidatesTags: ['Character'],
		}),
		updateStats: builder.mutation<CharacterDetailDto, { id: number } & UpdateStatsRequest>({
			query: ({ id, ...body }) => ({ url: `Characters/${id}/stats`, method: 'PUT', body }),
			invalidatesTags: ['CharacterSheet'],
		}),
		updateVitals: builder.mutation<CharacterDetailDto, { id: number } & UpdateVitalsRequest>({
			query: ({ id, ...body }) => ({ url: `Characters/${id}/vitals`, method: 'PUT', body }),
			invalidatesTags: ['CharacterSheet'],
		}),
		updateWallet: builder.mutation<CharacterDetailDto, { id: number } & UpdateWalletRequest>({
			query: ({ id, ...body }) => ({ url: `Characters/${id}/wallet`, method: 'PUT', body }),
			invalidatesTags: ['CharacterSheet'],
		}),
		updateCharacterImage: builder.mutation<CharacterDetailDto, { id: number; image: File; cropX: number; cropY: number; cropWidth: number; cropHeight: number }>({
			query: ({ id, image, cropX, cropY, cropWidth, cropHeight }) => {
				const body = new FormData()
				body.append('image', image)
				body.append('cropX', String(cropX))
				body.append('cropY', String(cropY))
				body.append('cropWidth', String(cropWidth))
				body.append('cropHeight', String(cropHeight))
				return { url: `Characters/${id}/image`, method: 'PUT', body }
			},
			invalidatesTags: ['CharacterSheet'],
		}),
		addItem: builder.mutation<ItemDto, { id: number } & AddItemRequest>({
			query: ({ id, ...body }) => ({ url: `Characters/${id}/items`, method: 'POST', body }),
			invalidatesTags: ['CharacterSheet'],
		}),
		updateItem: builder.mutation<ItemDto, { characterId: number; itemId: number } & UpdateItemRequest>({
			query: ({ characterId, itemId, ...body }) => ({ url: `Characters/${characterId}/items/${itemId}`, method: 'PUT', body }),
			invalidatesTags: ['CharacterSheet'],
		}),
		deleteItem: builder.mutation<void, { characterId: number; itemId: number }>({
			query: ({ characterId, itemId }) => ({ url: `Characters/${characterId}/items/${itemId}`, method: 'DELETE' }),
			invalidatesTags: ['CharacterSheet'],
		}),
		addSpell: builder.mutation<SpellDto, { id: number } & AddSpellRequest>({
			query: ({ id, ...body }) => ({ url: `Characters/${id}/spells`, method: 'POST', body }),
			invalidatesTags: ['CharacterSheet'],
		}),
		toggleSpellPrepared: builder.mutation<SpellDto, { characterId: number; spellId: number }>({
			query: ({ characterId, spellId }) => ({ url: `Characters/${characterId}/spells/${spellId}/toggle-prepared`, method: 'PATCH' }),
			invalidatesTags: ['CharacterSheet'],
		}),
		deleteSpell: builder.mutation<void, { characterId: number; spellId: number }>({
			query: ({ characterId, spellId }) => ({ url: `Characters/${characterId}/spells/${spellId}`, method: 'DELETE' }),
			invalidatesTags: ['CharacterSheet'],
		}),
		updateSpellSlot: builder.mutation<SpellSlotDto, { characterId: number } & UpdateSpellSlotRequest>({
			query: ({ characterId, ...body }) => ({ url: `Characters/${characterId}/spell-slots`, method: 'PUT', body }),
			invalidatesTags: ['CharacterSheet'],
		}),
		addFeat: builder.mutation<FeatDto, { id: number } & AddFeatRequest>({
			query: ({ id, ...body }) => ({ url: `Characters/${id}/feats`, method: 'POST', body }),
			invalidatesTags: ['CharacterSheet'],
		}),
		deleteFeat: builder.mutation<void, { characterId: number; featId: number }>({
			query: ({ characterId, featId }) => ({ url: `Characters/${characterId}/feats/${featId}`, method: 'DELETE' }),
			invalidatesTags: ['CharacterSheet'],
		}),
		addFeature: builder.mutation<FeatureDto, { id: number } & AddFeatureRequest>({
			query: ({ id, ...body }) => ({ url: `Characters/${id}/features`, method: 'POST', body }),
			invalidatesTags: ['CharacterSheet'],
		}),
		deleteFeature: builder.mutation<void, { characterId: number; featureId: number }>({
			query: ({ characterId, featureId }) => ({ url: `Characters/${characterId}/features/${featureId}`, method: 'DELETE' }),
			invalidatesTags: ['CharacterSheet'],
		}),
		addProficiency: builder.mutation<ProficiencyDto, { id: number } & AddProficiencyRequest>({
			query: ({ id, ...body }) => ({ url: `Characters/${id}/proficiencies`, method: 'POST', body }),
			invalidatesTags: ['CharacterSheet'],
		}),
		deleteProficiency: builder.mutation<void, { characterId: number; proficiencyId: number }>({
			query: ({ characterId, proficiencyId }) => ({ url: `Characters/${characterId}/proficiencies/${proficiencyId}`, method: 'DELETE' }),
			invalidatesTags: ['CharacterSheet'],
		}),
		getAllies: builder.query<AllyDto[], number>({
			query: id => `Characters/${id}/allies`,
			providesTags: ['CharacterSheet'],
		}),
	}),
})

export const {
	useGetMyCharactersQuery,
	useGetCharacterByIdQuery,
	useGetCharacterDetailQuery,
	useCreateCharacterMutation,
	useUpdateCharacterMutation,
	useDeleteCharacterMutation,
	useUpdateStatsMutation,
	useUpdateVitalsMutation,
	useUpdateWalletMutation,
	useUpdateCharacterImageMutation,
	useAddItemMutation,
	useUpdateItemMutation,
	useDeleteItemMutation,
	useAddSpellMutation,
	useToggleSpellPreparedMutation,
	useDeleteSpellMutation,
	useUpdateSpellSlotMutation,
	useAddFeatMutation,
	useDeleteFeatMutation,
	useAddFeatureMutation,
	useDeleteFeatureMutation,
	useAddProficiencyMutation,
	useDeleteProficiencyMutation,
	useGetAlliesQuery,
} = characterApi
