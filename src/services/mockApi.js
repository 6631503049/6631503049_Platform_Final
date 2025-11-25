const STORAGE_KEY = 'dcc_mock'

function readState() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) return JSON.parse(raw)
  const init = {
    users: [
      { id: 1, name: 'Alice Tenant', email: 'user@example.com', password: 'password', role: 'user' },
      { id: 2, name: 'Admin', email: 'admin@example.com', password: 'admin', role: 'admin' },
    ],
    reports: [],
    nextId: 1,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(init))
  return init
}

function writeState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export const mockApi = {
  login: async ({ email, password }) => {
    const s = readState()
    const u = s.users.find(it => it.email === email && it.password === password)
    if (!u) throw new Error('Invalid credentials')
    return { id: u.id, name: u.name, email: u.email, role: u.role }
  },

  createReport: async (report) => {
    const s = readState()
    const newReport = { id: s.nextId++, status: 'Open', comments: [], createdAt: Date.now(), ...report }
    s.reports.push(newReport)
    writeState(s)
    return newReport
  },

  listReports: async (filter = {}) => {
    const s = readState()
    let out = s.reports.slice().sort((a,b)=>b.createdAt-a.createdAt)
    if (filter.ownerId) out = out.filter(r => r.ownerId === filter.ownerId)
    if (filter.search) out = out.filter(r => r.title.toLowerCase().includes(filter.search.toLowerCase()))
    if (filter.status) out = out.filter(r => r.status === filter.status)
    return out
  },

  getReport: async (id) => {
    const s = readState()
    return s.reports.find(r => r.id === Number(id))
  },

  updateReport: async (id, patch) => {
    const s = readState()
    const idx = s.reports.findIndex(r => r.id === Number(id))
    if (idx === -1) throw new Error('Not found')
    s.reports[idx] = { ...s.reports[idx], ...patch }
    writeState(s)
    return s.reports[idx]
  },

  deleteReport: async (id) => {
    const s = readState()
    const before = s.reports.length
    s.reports = s.reports.filter(r => r.id !== Number(id))
    const after = s.reports.length
    writeState(s)
    return after < before
  },

  addComment: async (reportId, comment) => {
    const s = readState()
    const r = s.reports.find(r => r.id === Number(reportId))
    if (!r) throw new Error('Report not found')
    const c = { id: Date.now(), ...comment }
    r.comments.push(c)
    writeState(s)
    return c
  },
}
