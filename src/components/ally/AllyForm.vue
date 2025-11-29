<script setup lang="ts">
import { ref, provide, computed, reactive, nextTick } from 'vue';
import { AllyFormKey } from './allyFormKeys';

// Define emits
const emit = defineEmits(['submit']);

// Define props
const props = withDefaults(defineProps<{
  showErrorSummary?: boolean;
}>(), {
  showErrorSummary: false, // Default to false
});

// --- Error State Management ---
// Use a reactive object to store errors, mapping ID/key to error message
const formErrors = reactive<Record<string, string>>({});
// NEW: Set to track keys added via addFormError
const formLevelErrorKeys = reactive(new Set<string>());

// Function provided for child components (AllyTextbox, etc.) to update their field-specific error
function updateErrorState(id: string, errorMessage: string) {
  if (errorMessage) {
    formErrors[id] = errorMessage;
  } else {
    // If message is empty, remove the error entry for that field
    if (formErrors.hasOwnProperty(id)) {
      delete formErrors[id];
    }
  }
  // Ensure field updates do NOT affect formLevelErrorKeys tracking
  formLevelErrorKeys.delete(id);
}

// Function provided for child components to clear their error state on unmount or ID change
function clearErrorState(id: string) {
  if (formErrors.hasOwnProperty(id)) {
    delete formErrors[id];
  }
  // Ensure field clears do NOT affect formLevelErrorKeys tracking
   formLevelErrorKeys.delete(id);
}

// --- Methods Exposed to Parent Component ---

// Method for parent to add/update a form-level error (not tied to a specific field ID)
function addFormError(key: string, message: string) {
  if (!key) {
    console.warn('AllyForm: addFormError requires a non-empty key.');
    return;
  }
  if (!message) {
     console.warn(`AllyForm: addFormError called for key "${key}" with an empty message. Removing error instead.`);
     removeFormError(key);
     return;
  }
  formErrors[key] = message;
  formLevelErrorKeys.add(key); // Add key to the tracking Set
}

// Method for parent to remove a specific form-level error
function removeFormError(key: string) {
  if (formErrors.hasOwnProperty(key)) {
    delete formErrors[key];
  }
  formLevelErrorKeys.delete(key); // Remove key from the tracking Set
}

// Method for parent to clear all errors (both field-level and form-level)
async function clearAllErrors() {
  for (const key in formErrors) {
    if (formErrors.hasOwnProperty(key)) {
      delete formErrors[key];
    }
  }
  formLevelErrorKeys.clear(); // Clear the tracking Set
  await nextTick(); // Wait for Vue to process the clearing
}

// Method for parent to clear a specific field's error (same as clearErrorState)
function clearFieldError(id: string) {
    clearErrorState(id);
}

// Method to focus the error summary
async function focusErrorSummary() {
  // Only try to focus if the summary is enabled via props
  if (props.showErrorSummary) {
    await nextTick(); // Wait for potential DOM updates (v-if)
    if (errorSummaryRef.value) {
      errorSummaryRef.value.focus();
    }
  }
}

// Helper function to check if an error key is a field ID (not a form-level error)
function isFieldError(key: string): boolean {
  return !formLevelErrorKeys.has(key);
}

// Function to focus a field when clicked from the error summary
async function focusField(fieldId: string, event?: Event) {
  if (event) {
    event.preventDefault();
  }
  
  await nextTick(); // Wait for DOM updates
  
  // Try to find the input/select/textarea element by ID
  const fieldElement = document.getElementById(fieldId) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
  
  if (fieldElement) {
    // Focus the field and scroll it into view
    fieldElement.focus();
    fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    // Fallback: try to find the error text element and scroll to it
    const errorElement = document.getElementById(`${fieldId}-error`);
    if (errorElement) {
      errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Try to find the associated input and focus it
      const associatedField = document.getElementById(fieldId) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
      if (associatedField) {
        associatedField.focus();
      }
    }
  }
}

// Expose methods to the parent component via template refs
defineExpose({
  addFormError,
  removeFormError,
  clearAllErrors,
  clearFieldError,
  focusErrorSummary, // Expose the new method
  // Optionally expose the errors object itself (readonly recommended if so)
  // errors: computed(() => readonly(formErrors))
});

// --- Provide context to children ---
provide(AllyFormKey, {
  updateErrorState,
  clearErrorState,
});

// Computed property to check if there are any errors
const hasErrors = computed(() => Object.keys(formErrors).length > 0);
// NEW: Checks if there are specifically form-level errors
const hasFormLevelErrors = computed(() => formLevelErrorKeys.size > 0);

// Handle form submission
function handleSubmit(event: Event) {
  // Clear all existing errors and hide the error summary before submission
  // This ensures that when re-validation occurs, errors are refreshed and read by screen readers
  await clearAllErrors();  
  emit('submit', event); // Emit the submit event for the parent component
}

// --- Template Refs ---
const errorSummaryRef = ref<HTMLDivElement | null>(null); // Ref for the summary div

</script>

<template>
  <form @submit.prevent="handleSubmit">
    <!-- Error Summary Box: Show if (any errors AND prop is true) OR (there are form-level errors) -->
    <div
      v-if="(hasErrors && props.showErrorSummary) || hasFormLevelErrors"
      ref="errorSummaryRef"
      tabindex="-1"
      role="alert"
      aria-live="assertive"
      class="alert alert-danger ally-form-error-summary">
      <p>Please correct the following errors:</p>
      <ul>
        <!-- Iterate over the error object -->
        <li v-for="(message, key) in formErrors" :key="key">
          <!-- Link to field if it's a field error, otherwise just display the message -->
          <a
            v-if="isFieldError(key)"
            :href="`#${key}`"
            :aria-label="`Go to field with error: ${message}`"
            class="error-summary-link"
            @click="focusField(key, $event)"
          >
            {{ message }}
          </a>
          <span v-else>{{ message }}</span>
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

.ally-form-error-summary p {
  margin-bottom: 0.75rem;
  font-size: 1.1rem; /* Adjust as needed */
}

.ally-form-error-summary ul {
  margin-bottom: 0;
  padding-left: 1.2rem; /* Indent list */
}

.ally-form-error-summary .error-summary-link {
  color: inherit;
  text-decoration: underline;
  cursor: pointer;
}

.ally-form-error-summary .error-summary-link:hover,
.ally-form-error-summary .error-summary-link:focus {
  text-decoration: none;
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
</style>
