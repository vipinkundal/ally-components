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
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <h1>Actionable Ally Components</h1>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
          <ul class="navbar-nav">
            <li class="nav-item">
              <RouterLink to="/" class="nav-link">Demo Form</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/textbox" class="nav-link">Textbox</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/checkbox" class="nav-link">Checkbox</RouterLink>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </header>

  <main class="container mt-4">
    <RouterView />
  </main>
</template>

<style scoped>
main {
  margin-top: 2rem;
}

.form-group + .form-group {
  margin-top: 1rem;
}

header {
  line-height: 1.5;
  padding-bottom: 1rem;
  border-bottom: 1px solid #ccc;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 1rem;
  text-align: center;
  margin-top: 1rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
  font-weight: bold;
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
    align-items: center;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;
    padding: 1rem 0;
    margin-top: 0;
  }
}
</style>
