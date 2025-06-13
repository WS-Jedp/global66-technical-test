import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PrimaryButton from '../PrimaryButton.vue'

describe('PrimaryButton', () => {
  it('renders button with text slot', () => {
    const wrapper = mount(PrimaryButton, {
      slots: {
        text: 'Click me'
      }
    })

    expect(wrapper.text()).toContain('Click me')
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('emits click event when clicked', async () => {
    const wrapper = mount(PrimaryButton, {
      slots: {
        text: 'Click me'
      }
    })

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('does not emit click event when disabled', async () => {
    const wrapper = mount(PrimaryButton, {
      props: {
        disabled: true
      },
      slots: {
        text: 'Click me'
      }
    })

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('applies primary variant classes by default', () => {
    const wrapper = mount(PrimaryButton, {
      slots: {
        text: 'Click me'
      }
    })

    const button = wrapper.find('button')
    expect(button.classes()).toContain('bg-poke-red')
    expect(button.classes()).toContain('hover:bg-poke-red/70')
  })

  it('applies secondary variant classes when variant is secondary', () => {
    const wrapper = mount(PrimaryButton, {
      props: {
        variant: 'secondary'
      },
      slots: {
        text: 'Click me'
      }
    })

    const button = wrapper.find('button')
    expect(button.classes()).toContain('bg-poke-black-100')
    expect(button.classes()).toContain('hover:bg-poke-black-200')
  })

  it('applies full width classes when full prop is true', () => {
    const wrapper = mount(PrimaryButton, {
      props: {
        full: true
      },
      slots: {
        text: 'Click me'
      }
    })

    const button = wrapper.find('button')
    expect(button.classes()).toContain('w-full')
  })

  it('applies minimum width classes when full prop is false', () => {
    const wrapper = mount(PrimaryButton, {
      props: {
        full: false
      },
      slots: {
        text: 'Click me'
      }
    })

    const button = wrapper.find('button')
    expect(button.classes()).toContain('min-w-[150px]')
  })

  it('applies disabled classes when disabled', () => {
    const wrapper = mount(PrimaryButton, {
      props: {
        disabled: true
      },
      slots: {
        text: 'Click me'
      }
    })

    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBeDefined()
    expect(button.classes()).toContain('disabled:opacity-50')
    expect(button.classes()).toContain('disabled:cursor-not-allowed')
  })

  it('renders icon slot when provided', () => {
    const wrapper = mount(PrimaryButton, {
      slots: {
        text: 'Click me',
        icon: '<span class="test-icon">Icon</span>'
      }
    })

    expect(wrapper.find('.test-icon').exists()).toBe(true)
  })

  it('passes mouse event to click handler', async () => {
    const wrapper = mount(PrimaryButton, {
      slots: {
        text: 'Click me'
      }
    })

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
    const emittedEvent = wrapper.emitted('click')?.[0]?.[0]
    expect(emittedEvent).toBeInstanceOf(MouseEvent)
  })
})
