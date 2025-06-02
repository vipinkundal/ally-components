import { createRouter, createWebHistory } from 'vue-router'
import DemoFormView from '../views/DemoFormView.vue'
import TextboxDemoView from '../views/TextboxDemoView.vue'
import CheckboxDemoView from '../views/CheckboxDemoView.vue'
import TextareaDemoView from '../views/TextareaDemoView.vue'
import SelectDemoView from '../views/SelectDemoView.vue'
import MultiCheckboxDemoView from '../views/MultiCheckboxDemoView.vue'
import MultiRadioButtonsDemoView from '../views/MultiRadioButtonsDemoView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'demoForm',
      component: DemoFormView
    },
    {
      path: '/textbox',
      name: 'textboxDemo',
      component: TextboxDemoView
      // component: () => import('../views/TextboxDemoView.vue') // Lazy load example
    },
    {
      path: '/checkbox',
      name: 'checkboxDemo',
      component: CheckboxDemoView
    },
    {
      path: '/textarea',
      name: 'textareaDemo',
      component: TextareaDemoView
    },
    {
      path: '/select',
      name: 'selectDemo',
      component: SelectDemoView
    },
    {
      path: '/multicheckbox',
      name: 'multiCheckboxDemo',
      component: MultiCheckboxDemoView
    },
    {
      path: '/multiradiobuttons',
      name: 'multiRadioButtonsDemo',
      component: MultiRadioButtonsDemoView
    }
    // Add routes for other components here
  ]
})

export default router 