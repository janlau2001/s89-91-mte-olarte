import { reactive } from 'vue'

function decode(token) {
  try {
    return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
  } catch {
    return null
  }
}

const token = localStorage.getItem('token')
const user = token ? decode(token) : null

export const auth = reactive({
  token: user ? token : null,
  user,
  login(newToken) {
    localStorage.setItem('token', newToken)
    this.token = newToken
    this.user = decode(newToken)
  },
  logout() {
    localStorage.removeItem('token')
    this.token = null
    this.user = null
  },
})
