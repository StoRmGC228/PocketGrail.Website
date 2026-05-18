import type { ReactNode } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useAuthInit } from './hooks/useAuthInit'
import { selectRehydrated, selectIsAuthenticated } from './redux/slices/authSlice'
import { ProtectedLayout } from './components/layout/protected-layout/ProtectedLayout'
import { HomePage } from './pages/HomePage'
import { AuthPage } from './pages/AuthPage'
import { MyCampaignsPage } from './pages/my-campaigns-page/MyCampaignsPage'
import { ActiveCampaignsPage } from './pages/active-campaigns-page/ActiveCampaignsPage'
import { CampaignPage } from './pages/campaign-page/CampaignPage'
import { JoinRedirectPage } from './pages/JoinRedirectPage'
import { MyCharactersPage } from './pages/my-characters-page/MyCharactersPage'
import { CharacterPage } from './pages/character-page/CharacterPage/CharacterPage'

function PublicOnlyRoute({ children }: { children: ReactNode }) {
	const isAuthenticated = useSelector(selectIsAuthenticated)
	return isAuthenticated ? <Navigate to='/' replace /> : <>{children}</>
}

function App() {
	useAuthInit()
	const rehydrated = useSelector(selectRehydrated)

	if (!rehydrated) {
		return (
			<div className='flex h-screen items-center justify-center bg-(--color-bg)'>
				<span className='text-white/50 text-sm'>Loading…</span>
			</div>
		)
	}

	return (
		<Routes>
			<Route
				path='/auth'
				element={
					<PublicOnlyRoute>
						<AuthPage />
					</PublicOnlyRoute>
				}
			/>
			<Route element={<ProtectedLayout />}>
				<Route path='/' element={<HomePage />} />
				<Route path='/news' element={<div>News Page</div>} />
				<Route path='/my-campaigns' element={<MyCampaignsPage />} />
				<Route path='/campaigns' element={<ActiveCampaignsPage />} />
				<Route path='/campaigns/:id' element={<CampaignPage />} />
				<Route path='/join/:code' element={<JoinRedirectPage />} />
				<Route path='/characters' element={<MyCharactersPage />} />
				<Route path='/characters/:id' element={<CharacterPage />} />
			</Route>
		</Routes>
	)
}

export default App
