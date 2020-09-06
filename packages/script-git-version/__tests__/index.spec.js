import delayPromise from '../src'

jest.setTimeout(6000)

describe('a test suit', () => {
  test('delay resolve a promise', async () => {
    const result = await delayPromise('example', 5000)
    expect(result).toBe('example')
  })
})
