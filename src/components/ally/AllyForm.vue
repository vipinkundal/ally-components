<script setup lang="ts">
import { ref, provide, computed } from 'vue';
import { AllyFormKey, type AllyFormError } from './allyFormKeys';

// Define emits
const emit = defineEmits(['submit']);

// Define props
const props = withDefaults(defineProps<{ 
  showErrorSummary?: boolean;
}>(), {
  showErrorSummary: false, // Default to false
});

const formErrors = ref<AllyFormError[]>([]);

// Function for children to report/clear their error state
function updateErrorState(id: string, errorMessage: string) {
  const existingErrorIndex = formErrors.value.findIndex(err => err.id === id);

  if (errorMessage) { // If there is an error message
    const newError = { id, message: errorMessage };
    if (existingErrorIndex > -1) {
      // Update existing error
      formErrors.value.splice(existingErrorIndex, 1, newError);
    } else {
      // Add new error
      formErrors.value.push(newError);
    }
  } else if (existingErrorIndex > -1) {
    // If no error message, remove existing error
    formErrors.value.splice(existingErrorIndex, 1);
  }
}

// Function for children to remove themselves on unmount
function clearErrorState(id: string) {
  const existingErrorIndex = formErrors.value.findIndex(err => err.id === id);
  if (existingErrorIndex > -1) {
    formErrors.value.splice(existingErrorIndex, 1);
  }
}

// Provide only the necessary functions
provide(AllyFormKey, {
  updateErrorState,
  clearErrorState,
});

// Computed property to check if there are any errors
const hasErrors = computed(() => formErrors.value.length > 0);

// Handle form submission
function handleSubmit(event: Event) {
  // The .prevent modifier already handled event.preventDefault()
  emit('submit', event); // Emit the submit event for the parent component
}

</script>

<template>
  <form @submit.prevent="handleSubmit">
    <!-- Error Summary Box -->
    <div v-if="hasErrors && props.showErrorSummary" role="alert" class="alert alert-danger ally-form-error-summary">
      <h5>Please correct the following errors:</h5>
      <ul>
        <li v-for="error in formErrors" :key="error.id">
          <!-- Optional: Could link to the input using #error.id -->
          {{ error.message }}
        </li>
      </ul>
    </div>

    <slot />
  </form>
</template>

<style scoped>
/* Add some spacing for the error summary */
.ally-form-error-summary {
  margin-bottom: 1.5rem;
}

.ally-form-error-summary h5 {
  margin-bottom: 0.75rem;
  font-size: 1.1rem; /* Adjust as needed */
}

.ally-form-error-summary ul {
  margin-bottom: 0;
  padding-left: 1.2rem; /* Indent list */
}
</style>
