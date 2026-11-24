import { auth } from '../store/auth'

const baseUrl = import.meta.env.VITE_API_URL

export async function request(path, method = 'GET', body) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth.token) headers.Authorization = `Bearer ${auth.token}`

  let res
  try {
    res = await fetch(baseUrl + path, {
      method,
      headers,
      body: body && JSON.stringify(body),
    })
  } catch {
    throw new Error('Cannot reach the server. Please try again later.')
  }

  const data = await res.json().catch(() => ({}))

  if (res.status === 401 && auth.token) auth.logout()
  if (!res.ok) throw new Error(data.error || data.message || 'Something went wrong')
  return data
}
