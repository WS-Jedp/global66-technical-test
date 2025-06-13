import { beforeEach, vi } from 'vitest'

// Mock global fetch
global.fetch = vi.fn()

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks()
})
