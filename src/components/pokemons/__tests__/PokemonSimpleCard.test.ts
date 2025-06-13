import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import PokemonSimpleCard from '../PokemonSimpleCard.vue'
import { useFavoritesStore } from '../../../store/favorites'

describe('PokemonSimpleCard', () => {
  let pinia: any

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  const mockPokemon = {
    id: 1,
    name: 'pikachu',
    sprite: 'https://example.com/pikachu.png',
    weight: 60,
    height: 4,
    types: ['electric']
  }

  it('renders pokemon name correctly', () => {
    const wrapper = mount(PokemonSimpleCard, {
      props: {
        pokemon: mockPokemon
      },
      global: {
        plugins: [pinia]
      }
    })

    expect(wrapper.text()).toContain('pikachu')
    expect(wrapper.find('h3').text()).toBe('pikachu')
  })

  it('emits click event when card is clicked', async () => {
    const wrapper = mount(PokemonSimpleCard, {
      props: {
        pokemon: mockPokemon
      },
      global: {
        plugins: [pinia]
      }
    })

    await wrapper.find('.cursor-pointer').trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')).toHaveLength(1)
    expect(wrapper.emitted('click')?.[0]?.[0]).toEqual(mockPokemon)
  })

  it('displays favorite icon when pokemon is in favorites', async () => {
    const wrapper = mount(PokemonSimpleCard, {
      props: {
        pokemon: mockPokemon
      },
      global: {
        plugins: [pinia]
      }
    })

    const favoritesStore = useFavoritesStore()
    favoritesStore.add('pikachu')

    // Wait for Vue to update the DOM after the store change
    await wrapper.vm.$nextTick()

    expect(wrapper.find('img[alt="Fav Icon Active"]').exists()).toBe(true)
  })

  it('displays inactive favorite icon when pokemon is not in favorites', () => {
    const wrapper = mount(PokemonSimpleCard, {
      props: {
        pokemon: mockPokemon
      },
      global: {
        plugins: [pinia]
      }
    })

    expect(wrapper.find('img[alt="Fav Icon Inactive"]').exists()).toBe(true)
  })

  it('toggles favorite when favorite button is clicked', async () => {
    const wrapper = mount(PokemonSimpleCard, {
      props: {
        pokemon: mockPokemon
      },
      global: {
        plugins: [pinia]
      }
    })

    const favoritesStore = useFavoritesStore()
    const favoriteButton = wrapper.find('button')

    // Initially not favorite
    expect(favoritesStore.isFavorite('pikachu')).toBe(false)

    // Click to add to favorites
    await favoriteButton.trigger('click')
    expect(favoritesStore.isFavorite('pikachu')).toBe(true)

    // Click again to remove from favorites
    await favoriteButton.trigger('click')
    expect(favoritesStore.isFavorite('pikachu')).toBe(false)
  })

  it('prevents card click event when favorite button is clicked', async () => {
    const wrapper = mount(PokemonSimpleCard, {
      props: {
        pokemon: mockPokemon
      },
      global: {
        plugins: [pinia]
      }
    })

    const favoriteButton = wrapper.find('button')
    await favoriteButton.trigger('click')

    // Card click event should not be emitted when favorite button is clicked
    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('applies correct CSS classes for styling', () => {
    const wrapper = mount(PokemonSimpleCard, {
      props: {
        pokemon: mockPokemon
      },
      global: {
        plugins: [pinia]
      }
    })

    const cardElement = wrapper.find('.cursor-pointer')
    expect(cardElement.classes()).toContain('bg-white')
    expect(cardElement.classes()).toContain('border')
    expect(cardElement.classes()).toContain('rounded-xl')
    expect(cardElement.classes()).toContain('hover:-translate-y-0.5')
    expect(cardElement.classes()).toContain('hover:shadow-md')
  })

  it('displays pokemon name with proper capitalization', () => {
    const wrapper = mount(PokemonSimpleCard, {
      props: {
        pokemon: { ...mockPokemon, name: 'pikachu' }
      },
      global: {
        plugins: [pinia]
      }
    })

    const nameElement = wrapper.find('h3')
    expect(nameElement.classes()).toContain('capitalize')
  })

  it('sets correct aria-label for favorite button based on state', async () => {
    const wrapper = mount(PokemonSimpleCard, {
      props: {
        pokemon: mockPokemon
      },
      global: {
        plugins: [pinia]
      }
    })

    const favoritesStore = useFavoritesStore()
    const favoriteButton = wrapper.find('button')

    // Initially not favorite
    expect(favoriteButton.attributes('aria-label')).toBe('Add to favorites')

    // Add to favorites
    favoritesStore.add('pikachu')
    await wrapper.vm.$nextTick()

    expect(favoriteButton.attributes('aria-label')).toBe('Remove from favorites')
  })
})
