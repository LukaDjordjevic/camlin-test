// import { describe, it, expect, beforeEach, beforeAll } from 'vitest'
// import { mount } from '@vue/test-utils'
// import TransformersTable from '@/components/TransformersTable.vue'

// import { useDarkModeStore } from '@/stores/darkMode'
// import { createPinia, setActivePinia } from 'pinia'

// describe('RegionHealthStatus.vue', () => {
//   let wrapper: any
//   const mockData = [
//     {
//       assetId: 1,
//       name: 'Transformer A',
//       region: 'London',
//       health: 'Excellent',
//     },
//     {
//       assetId: 2,
//       name: 'Transformer B',
//       region: 'Manchester',
//       health: 'Good',
//     },
//   ]

//   beforeAll(() => {
//     // Mock matchMedia
//     Object.defineProperty(window, 'matchMedia', {
//       writable: true,
//       value: jest.fn().mockImplementation((query) => ({
//         matches: false, // Default to light mode
//         media: query,
//         onchange: null,
//         addListener: jest.fn(), // Deprecated
//         removeListener: jest.fn(), // Deprecated
//         addEventListener: jest.fn(),
//         removeEventListener: jest.fn(),
//         dispatchEvent: jest.fn(),
//       })),
//     })
//   })

//   beforeEach(() => {
//     setActivePinia(createPinia())

//     wrapper = mount(TransformersTable, {
//       props: {
//         transformersData: mockData,
//         visibilityState: { 1: true, 2: false },
//         searchFilter: '',
//         regionFilter: [],
//         healthFilter: [],
//       },
//     })
//   })

//   it('renders the component title', () => {
//     expect(wrapper.find('h2').text()).toBe('Region Health Status')
//   })

//   it('displays all transformers data in the table', () => {
//     const rows = wrapper.findAll('tbody tr')
//     expect(rows.length).toBe(mockData.length)

//     mockData.forEach((item, index) => {
//       const cells = rows[index].findAll('td')
//       expect(cells[0].text()).toBe(item.name)
//       expect(cells[1].text()).toBe(item.region)
//       expect(cells[2].text()).toBe(item.health)
//     })
//   })

//   it('renders all region filter pills', () => {
//     const regionPills = wrapper.findAll('.pill-container').at(0).findAll('.pill')
//     expect(regionPills.length).toBe(3)
//     expect(regionPills[0].text()).toBe('London')
//     expect(regionPills[1].text()).toBe('Manchester')
//     expect(regionPills[2].text()).toBe('Glasgow')
//   })

//   it('renders all health filter pills', () => {
//     const healthPills = wrapper.findAll('.pill-container').at(1).findAll('.pill')
//     expect(healthPills.length).toBe(5)
//     expect(healthPills[0].text()).toBe('Excellent')
//     expect(healthPills[1].text()).toBe('Good')
//     expect(healthPills[4].text()).toBe('Critical')
//   })

//   it('emits update-visibility event when checkbox is clicked', async () => {
//     const checkbox = wrapper.find('input[type="checkbox"]')
//     await checkbox.setValue(false)

//     expect(wrapper.emitted('update-visibility')).toBeTruthy()
//     expect(wrapper.emitted('update-visibility')[0]).toEqual(['1', false])
//   })

//   it('emits update-search event when search input changes', async () => {
//     const searchInput = wrapper.find('#search-input')
//     await searchInput.setValue('test')

//     expect(wrapper.emitted('update-search')).toBeTruthy()
//     expect(wrapper.emitted('update-search')[0]).toEqual(['test'])
//   })

//   it('emits update-region event when region pill is clicked', async () => {
//     const regionPill = wrapper.findAll('.pill-container').at(0).findAll('.pill').at(0)
//     await regionPill.trigger('click')

//     expect(wrapper.emitted('update-region')).toBeTruthy()
//     expect(wrapper.emitted('update-region')[0]).toEqual(['London'])
//   })

//   it('emits update-health event when health pill is clicked', async () => {
//     const healthPill = wrapper.findAll('.pill-container').at(1).findAll('.pill').at(0)
//     await healthPill.trigger('click')

//     expect(wrapper.emitted('update-health')).toBeTruthy()
//     expect(wrapper.emitted('update-health')[0]).toEqual(['Excellent'])
//   })

//   it('applies correct health badge classes', () => {
//     const healthBadges = wrapper.findAll('.health-badge')
//     expect(healthBadges[0].classes()).toContain('excellent')
//     expect(healthBadges[1].classes()).toContain('good')
//   })

//   it('applies dark mode classes when isDarkMode is true', async () => {
//     const darkModeStore = useDarkModeStore()
//     darkModeStore.isDarkMode = true
//     await wrapper.vm.$nextTick()

//     expect(wrapper.find('.search-input').classes()).toContain('dark-mode-input')
//     expect(wrapper.find('.pill').classes()).toContain('dark-mode-pill')
//   })
// })
