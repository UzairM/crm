import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, expect } from 'vitest'
import { toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

// Automatically cleanup after each test
afterEach(() => {
  cleanup()
}) 