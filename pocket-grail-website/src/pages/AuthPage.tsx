import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useLoginMutation, useRegisterMutation, useLazyMeQuery } from '../api/authApi'
import { setUser } from '../redux/slices/authSlice'
import { saveUserCookie } from '../utils/authCookie'
import type { UserRole } from '../types/auth'
import type { AppDispatch } from '../redux/store'

type Tab = 'login' | 'register'

export function AuthPage() {
	const dispatch = useDispatch<AppDispatch>()
	const navigate = useNavigate()
	const [tab, setTab] = useState<Tab>('login')

	const [login, { isLoading: loginLoading }] = useLoginMutation()
	const [register, { isLoading: registerLoading }] = useRegisterMutation()
	const [triggerMe] = useLazyMeQuery()

	// Login form state
	const [loginEmail, setLoginEmail] = useState('')
	const [loginPassword, setLoginPassword] = useState('')

	// Register form state
	const [regEmail, setRegEmail] = useState('')
	const [regUsername, setRegUsername] = useState('')
	const [regPassword, setRegPassword] = useState('')
	const [regRole, setRegRole] = useState<UserRole>('Player')

	const [error, setError] = useState<string | null>(null)

	const handleLogin = async (e: FormEvent) => {
		e.preventDefault()
		setError(null)
		try {
			await login({ email: loginEmail, password: loginPassword }).unwrap()
			const user = await triggerMe().unwrap()
			dispatch(setUser(user))
			saveUserCookie(user)
			navigate('/')
		} catch (err: unknown) {
			setError(getErrorMessage(err) ?? 'Invalid email or password.')
		}
	}

	const handleRegister = async (e: FormEvent) => {
		e.preventDefault()
		setError(null)
		try {
			await register({ email: regEmail, username: regUsername, password: regPassword, role: regRole }).unwrap()
			const user = await triggerMe().unwrap()
			dispatch(setUser(user))
			saveUserCookie(user)
			navigate('/')
		} catch (err: unknown) {
			setError(getErrorMessage(err) ?? 'Registration failed. Try a different email.')
		}
	}

	const isLoading = loginLoading || registerLoading

	const inputClass = 'bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-lg px-4 py-3 sm:py-2 w-full text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-(--color-nb)'
	const labelClass = 'block text-white/60 text-xs mb-1'

	return (
		<div className='min-h-screen flex items-center justify-center bg-(--color-bg) px-4 py-10'>
			<div className='w-full max-w-sm sm:max-w-md bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl'>
				{/* Branding */}
				<h1 className='text-white text-xl sm:text-2xl font-bold text-center mb-6 tracking-wide'>
					⚔️ PocketGrail
				</h1>

				{/* Tabs */}
				<div className='flex mb-6 border-b border-white/10'>
					<button
						className={`flex-1 pb-3 text-sm font-semibold transition-colors ${
							tab === 'login'
								? 'border-b-2 border-(--color-nb) text-white'
								: 'border-b-2 border-transparent text-white/40 hover:text-white/70'
						}`}
						onClick={() => { setTab('login'); setError(null) }}
					>
						Login
					</button>
					<button
						className={`flex-1 pb-3 text-sm font-semibold transition-colors ${
							tab === 'register'
								? 'border-b-2 border-(--color-nb) text-white'
								: 'border-b-2 border-transparent text-white/40 hover:text-white/70'
						}`}
						onClick={() => { setTab('register'); setError(null) }}
					>
						Register
					</button>
				</div>

				{/* Error message */}
				{error && (
					<p className='text-red-400 text-sm mb-4 text-center'>{error}</p>
				)}

				{/* Login Form */}
				{tab === 'login' && (
					<form onSubmit={handleLogin} className='flex flex-col gap-4'>
						<div>
							<label className={labelClass}>Email</label>
							<input
								type='email'
								required
								value={loginEmail}
								onChange={e => setLoginEmail(e.target.value)}
								placeholder='you@example.com'
								className={inputClass}
							/>
						</div>
						<div>
							<label className={labelClass}>Password</label>
							<input
								type='password'
								required
								value={loginPassword}
								onChange={e => setLoginPassword(e.target.value)}
								placeholder='••••••••'
								className={inputClass}
							/>
						</div>
						<button
							type='submit'
							disabled={isLoading}
							className='mt-2 bg-(--color-nb) text-white font-semibold py-3 sm:py-2 rounded-lg w-full text-base sm:text-sm hover:brightness-110 transition-[filter] disabled:opacity-50 disabled:cursor-not-allowed'
						>
							{loginLoading ? 'Signing in…' : 'Sign In'}
						</button>
					</form>
				)}

				{/* Register Form */}
				{tab === 'register' && (
					<form onSubmit={handleRegister} className='flex flex-col gap-4'>
						<div>
							<label className={labelClass}>Email</label>
							<input
								type='email'
								required
								value={regEmail}
								onChange={e => setRegEmail(e.target.value)}
								placeholder='you@example.com'
								className={inputClass}
							/>
						</div>
						<div>
							<label className={labelClass}>Username</label>
							<input
								type='text'
								required
								value={regUsername}
								onChange={e => setRegUsername(e.target.value)}
								placeholder='YourAdventurerName'
								className={inputClass}
							/>
						</div>
						<div>
							<label className={labelClass}>Password</label>
							<input
								type='password'
								required
								value={regPassword}
								onChange={e => setRegPassword(e.target.value)}
								placeholder='••••••••'
								className={inputClass}
							/>
						</div>
						<div>
							<label className={labelClass}>Role</label>
							<select
								value={regRole}
								onChange={e => setRegRole(e.target.value as UserRole)}
								className={inputClass}
							>
								<option value='Player' className='bg-(--color-bg)'>Player</option>
								<option value='DungeonMaster' className='bg-(--color-bg)'>Dungeon Master</option>
							</select>
						</div>
						<button
							type='submit'
							disabled={isLoading}
							className='mt-2 bg-(--color-nb) text-white font-semibold py-3 sm:py-2 rounded-lg w-full text-base sm:text-sm hover:brightness-110 transition-[filter] disabled:opacity-50 disabled:cursor-not-allowed'
						>
							{registerLoading ? 'Creating account…' : 'Create Account'}
						</button>
					</form>
				)}
			</div>
		</div>
	)
}

function getErrorMessage(err: unknown): string | null {
	if (!err || typeof err !== 'object') return null
	const e = err as Record<string, unknown>
	if (typeof e['data'] === 'string') return e['data']
	if (e['data'] && typeof e['data'] === 'object') {
		const d = e['data'] as Record<string, unknown>
		if (typeof d['message'] === 'string') return d['message']
	}
	if (typeof e['message'] === 'string') return e['message']
	return null
}
