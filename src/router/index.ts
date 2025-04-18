import { createRouter, createWebHistory } from 'vue-router'
import DemoFormView from '../views/DemoFormView.vue'
import TextboxDemoView from '../views/TextboxDemoView.vue'
import CheckboxDemoView from '../views/CheckboxDemoView.vue'

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
    }
    // Add routes for other components here
  ]
})

export default router 