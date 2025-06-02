<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import AllyForm from './components/ally/AllyForm.vue'
import AllyTextbox from './components/ally/AllyTextbox.vue'

const name = ref('')
const email = ref('')
const emailError = ref('')

function validateEmail() {
  if (email.value && !email.value.includes('@')) {
    emailError.value = 'Please enter a valid email address.'
  } else {
    emailError.value = ''
  }
}
</script>

<template>
  <div class="app-layout">
    <aside class="sidebar">
      <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />
      <h1 class="sidebar-title">Actionable Ally Components</h1>
      <nav class="navbar navbar-light bg-light">
        <ul class="navbar-nav flex-column">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link">Demo Form</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/textbox" class="nav-link">Textbox</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/checkbox" class="nav-link">Checkbox</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/textarea" class="nav-link">Textarea</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/select" class="nav-link">Select</RouterLink>
          </li>
        </ul>
      </nav>
    </aside>
    <main class="main-content mt-4">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 260px;
  background: #fff;
  border-right: 1px solid #eee;
  padding: 2rem 1rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
}

.logo {
  margin-bottom: 1rem;
}

.sidebar-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  margin-top: 0;
}

nav {
  width: 100%;
}

nav a.router-link-exact-active {
  color: var(--color-text);
  font-weight: bold;
  background-color: #f8f9fa;
}

nav a.router-link-exact-active:hover {
  background-color: #f8f9fa;
}

nav a {
  display: block;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid var(--color-border);
}

nav a:first-of-type {
  border-top: 1px solid var(--color-border);
}

.main-content {
  flex: 1;
  width: 100%;
  max-width: none;
  padding-left: 3rem;
  padding-right: 0;
}

@media (max-width: 900px) {
  .app-layout {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    min-height: unset;
    border-right: none;
    border-bottom: 1px solid #eee;
    flex-direction: row;
    align-items: center;
    padding: 1rem;
  }
  .sidebar-title {
    margin-bottom: 0;
    margin-right: 2rem;
  }
  nav {
    width: auto;
  }
  .main-content {
    padding-left: 1rem;
    padding-right: 1rem;
    max-width: 100%;
  }
}
</style>
