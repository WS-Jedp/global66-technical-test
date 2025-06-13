import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useFavoritesStore } from '../favorites'

describe('useFavoritesStore', () => {
  let pinia: any

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  it('initializes with empty favorites', () => {
    const store = useFavoritesStore()
    
    expect(store.favoriteIds).toEqual([])
    expect(store.favoriteCount).toBe(0)
    expect(store.favoriteNames).toEqual([])
  })

  it('adds pokemon to favorites', () => {
    const store = useFavoritesStore()
    
    store.add('pikachu')
    
    expect(store.favoriteIds).toContain('pikachu')
    expect(store.favoriteCount).toBe(1)
    expect(store.isFavorite('pikachu')).toBe(true)
  })

  it('does not add duplicate favorites', () => {
    const store = useFavoritesStore()
    
    store.add('pikachu')
    store.add('pikachu')
    
    expect(store.favoriteIds).toEqual(['pikachu'])
    expect(store.favoriteCount).toBe(1)
  })

  it('removes pokemon from favorites', () => {
    const store = useFavoritesStore()
    
    store.add('pikachu')
    store.remove('pikachu')
    
    expect(store.favoriteIds).not.toContain('pikachu')
    expect(store.favoriteCount).toBe(0)
    expect(store.isFavorite('pikachu')).toBe(false)
  })

  it('toggles pokemon favorite status', () => {
    const store = useFavoritesStore()
    
    // Initially not favorite
    expect(store.isFavorite('pikachu')).toBe(false)
    
    // Toggle to add
    store.toggle('pikachu')
    expect(store.isFavorite('pikachu')).toBe(true)
    expect(store.favoriteCount).toBe(1)
    
    // Toggle to remove
    store.toggle('pikachu')
    expect(store.isFavorite('pikachu')).toBe(false)
    expect(store.favoriteCount).toBe(0)
  })

  it('clears all favorites', () => {
    const store = useFavoritesStore()
    
    store.add('pikachu')
    store.add('charizard')
    store.add('bulbasaur')
    
    expect(store.favoriteCount).toBe(3)
    
    store.clear()
    
    expect(store.favoriteIds).toEqual([])
    expect(store.favoriteCount).toBe(0)
  })

  it('checks if pokemon is favorite correctly', () => {
    const store = useFavoritesStore()
    
    store.add('pikachu')
    
    expect(store.isFavorite('pikachu')).toBe(true)
    expect(store.isFavorite('charizard')).toBe(false)
    expect(store.isFavorite('bulbasaur')).toBe(false)
  })

  it('returns correct favorite names list', () => {
    const store = useFavoritesStore()
    
    store.add('pikachu')
    store.add('charizard')
    store.add('bulbasaur')
    
    expect(store.favoriteNames).toEqual(['pikachu', 'charizard', 'bulbasaur'])
  })

  it('maintains correct count after multiple operations', () => {
    const store = useFavoritesStore()
    
    store.add('pikachu')
    store.add('charizard')
    expect(store.favoriteCount).toBe(2)
    
    store.remove('pikachu')
    expect(store.favoriteCount).toBe(1)
    
    store.toggle('bulbasaur')
    expect(store.favoriteCount).toBe(2)
    
    store.toggle('charizard')
    expect(store.favoriteCount).toBe(1)
  })

  it('handles case sensitivity correctly', () => {
    const store = useFavoritesStore()
    
    store.add('Pikachu')
    
    expect(store.isFavorite('Pikachu')).toBe(true)
    expect(store.isFavorite('pikachu')).toBe(false)
    expect(store.isFavorite('PIKACHU')).toBe(false)
  })

  it('removes non-existent pokemon gracefully', () => {
    const store = useFavoritesStore()
    
    store.add('pikachu')
    const initialCount = store.favoriteCount
    
    store.remove('charizard') // Pokemon not in favorites
    
    expect(store.favoriteCount).toBe(initialCount)
    expect(store.favoriteIds).toEqual(['pikachu'])
  })
})
