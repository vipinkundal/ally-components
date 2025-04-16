<script setup lang="ts">
import { computed, inject, watch, onUnmounted, ref, readonly } from 'vue';
import { AllyFormKey } from './allyFormKeys'; // Import the injection key

// Define component props
const props = withDefaults(defineProps<{
  id: string;
  label: string;
  modelValue: string | number; // Support v-model
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number' | 'search';
  required?: boolean;
  placeholder?: string;
  ariaDescribedby?: string; // For linking external descriptions
  errorMessage?: string; // Added error message prop
  maxlength?: number; // Added maxlength prop
  showCounter?: boolean; // Added showCounter prop
  reserveErrorSpace?: boolean; // Added prop back here
}>(), {
  type: 'text',
  required: false,
  placeholder: '',
  ariaDescribedby: undefined,
  errorMessage: '', // Default error message is empty
  maxlength: undefined, // Default maxlength
  showCounter: false, // Default showCounter
  reserveErrorSpace: true, // Default to true
});

// Define emits for v-model support
const emit = defineEmits(['update:modelValue']);

// --- Inject context from AllyForm (only error reporting) --- 
const allyForm = inject(AllyFormKey, null); // Inject with null default

// Helper function to safely call injected methods
// const safeUpdateErrorState = (id: string, msg: string) => {
//   allyForm?.updateErrorState(id, msg);
// };
// const safeClearErrorState = (id: string) => {
//   allyForm?.clearErrorState(id);
// };

// --- Watch for error changes and report to parent --- 
watch(() => [props.id, props.errorMessage], ([newId, newErrorMessage], [oldId, oldErrorMessage] = []) => {
  if (allyForm) { // Explicit check for injected context
    // If the ID changes, clear the old error first (edge case)
    if (newId !== oldId && oldErrorMessage) {
      allyForm.clearErrorState(oldId as string);
    }
    // Report the new state (will handle add/update/remove logic in parent)
    allyForm.updateErrorState(newId as string, newErrorMessage as string);
  }
}, { immediate: true }); // immediate: true ensures initial state is reported

// --- Clean up on unmount --- 
onUnmounted(() => {
  if (allyForm) { // Explicit check for injected context
    allyForm.clearErrorState(props.id);
  }
});

// Computed property to handle input event and emit update
const value = computed({
  get: () => props.modelValue,
  set: (newValue) => {
    emit('update:modelValue', newValue);
  }
});

// Generate unique IDs for descriptive elements
const helpTextId = computed(() => `${props.id}-help`);
const errorTextId = computed(() => `${props.id}-error`);
const counterId = computed(() => `${props.id}-counter`); // Added counter ID

// Compute invalid state based on errorMessage prop
const isInvalid = computed(() => !!props.errorMessage);

// Compute current character length
const currentLength = computed(() => String(props.modelValue || '').length);

// Determine if the counter should be displayed
const shouldShowCounter = computed(() => props.showCounter && props.maxlength !== undefined);

</script>

<template>
  <div class="form-group" :class="{ 'ally-has-error': isInvalid }">
    <label :for="id" class="form-label">
      {{ label }}
      <span v-if="required" aria-hidden="true" class="text-danger ms-1">*</span>
      <span v-if="required" class="sr-only"> required</span>
    </label>
    <!-- New wrapper for input and counter -->
    <div class="input-wrapper position-relative">
      <input
        :id="id"
        v-model="value"
        :type="type"
        :class="['form-control', { 'is-invalid': isInvalid, 'has-counter': shouldShowCounter }]"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :aria-required="required"
        :aria-invalid="isInvalid ? 'true' : undefined"
        :aria-describedby="[
          props.ariaDescribedby,
          $slots.helptext ? helpTextId : undefined,
          isInvalid ? errorTextId : undefined,
          shouldShowCounter ? counterId : undefined
        ].filter(Boolean).join(' ') || undefined"
      />
      <!-- Character Counter (now inside wrapper) -->
      <small v-if="shouldShowCounter" :id="counterId" class="form-text text-muted char-counter">
          {{ currentLength }} / {{ maxlength }}
      </small>
    </div>
    <!-- Help Text (outside input-wrapper) -->
    <small v-if="$slots.helptext" :id="helpTextId" class="form-text text-muted">
      <slot name="helptext" />
    </small>

    <!-- Error Message Area -->
    <!-- Mode 1: Reserve Space (controlled by prop) -->
    <div v-if="props.reserveErrorSpace" 
         :id="errorTextId" 
         class="invalid-feedback reserve-space">
      {{ errorMessage }} 
    </div>
    <!-- Mode 2: Don't Reserve Space (Render only when invalid) -->
    <div v-else-if="isInvalid" 
         :id="errorTextId" 
         class="invalid-feedback">
       {{ errorMessage }}
    </div>

  </div>
</template>

<style scoped>
.input-wrapper {
}

.form-control.has-counter {
  padding-right: 4.5rem;
}

.char-counter {
  position: absolute;
  bottom: 0.25rem;
  right: 0.5rem;
  font-size: 0.75em;
  pointer-events: none;
}

/* Use custom error color for the required asterisk */
.form-label span[aria-hidden="true"] {
  color: #B22222; /* Custom Error Color */
  margin-left: 0.25rem;
}

/* Override Bootstrap invalid state colors */
.form-control.is-invalid {
  border-color: #B22222; /* Custom Error Color */
}

.form-control.is-invalid:focus {
  border-color: #B22222;
  /* Replicate Bootstrap 4 focus shadow with the custom color */
  box-shadow: 0 0 0 0.2rem rgba(178, 34, 34, 0.25); /* rgba(178, 34, 34) is #B22222 */
}

/* Base styles for the error message div */
.invalid-feedback {
  display: block; 
  color: #B22222; 
  margin-top: 0.25rem; 
}

/* Styles specific to reserving space mode */
.invalid-feedback.reserve-space {
  /* Nothing extra needed here; pseudo-element handles space */
}

.invalid-feedback.reserve-space::after {
  content: '\00a0'; 
  display: inline-block; 
  min-height: 1.2em; 
  width: 1px; 
  vertical-align: bottom; 
}

/* Hide text color by default when reserving space */
.invalid-feedback.reserve-space {
  color: transparent;
}

/* Show text color only when reserving space AND parent has error class */
.form-group.ally-has-error .invalid-feedback.reserve-space {
  color: #B22222; 
}

</style>
