<script setup lang="ts">
import { computed, inject, watch, onUnmounted, ref } from 'vue';
import { AllyFormKey } from './allyFormKeys';

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<{
  id: string;
  label: string;
  modelValue: string | number;
  options: SelectOption[];
  required?: boolean;
  placeholder?: string;
  ariaDescribedby?: string;
  errorMessage?: string;
  reserveErrorSpace?: boolean;
}>(), {
  required: false,
  placeholder: 'Select an option',
  ariaDescribedby: undefined,
  errorMessage: '',
  reserveErrorSpace: true,
});

const emit = defineEmits(['update:modelValue', 'blur']);

// Inject form context
const allyForm = inject(AllyFormKey, null);

// Watch for error message changes and report to parent
watch(() => props.errorMessage, (newMessage, oldMessage) => {
  if (allyForm) {
    allyForm.updateErrorState(props.id, newMessage || '');
  }
}, { immediate: true });

// Watch for ID changes and clean up old errors
watch(() => props.id, (newId, oldId) => {
  if (allyForm && oldId && props.errorMessage) {
    allyForm.clearErrorState(oldId);
  }
  if (allyForm) {
    allyForm.updateErrorState(newId, props.errorMessage || '');
  }
});

// Clean up on unmount
onUnmounted(() => {
  if (allyForm) {
    allyForm.clearErrorState(props.id);
  }
});

// Computed property to handle select event and emit update
const value = computed({
  get: () => props.modelValue,
  set: (newValue) => {
    emit('update:modelValue', newValue);
  }
});

// Generate unique IDs for descriptive elements
const helpTextId = computed(() => `${props.id}-help`);
const errorTextId = computed(() => `${props.id}-error`);

// Compute invalid state based on errorMessage prop
const isInvalid = computed(() => !!props.errorMessage);
</script>

<template>
  <div class="form-group" :class="{ 'ally-has-error': isInvalid }">
    <label :for="id" class="form-label">
      {{ label }}
      <span v-if="required" aria-hidden="true" class="text-danger ms-1">*</span>
      <span v-if="required" class="sr-only"> required</span>
    </label>

    <div class="input-wrapper position-relative">
      <select
        :id="id"
        v-model="value"
        :class="['form-select', { 'is-invalid': isInvalid }]"
        :aria-required="required"
        :aria-invalid="isInvalid ? 'true' : undefined"
        :aria-describedby="[
          props.ariaDescribedby,
          $slots.helptext ? helpTextId : undefined,
          isInvalid ? errorTextId : undefined
        ].filter(Boolean).join(' ') || undefined"
        @blur="$emit('blur', $event)"
      >
        <option value="" disabled>{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>
    </div>

    <!-- Help Text -->
    <small v-if="$slots.helptext" :id="helpTextId" class="form-text text-muted">
      <slot name="helptext" />
    </small>

    <!-- Error Message Area -->
    <div v-if="isInvalid || reserveErrorSpace"
         :id="errorTextId" 
         class="error-text"
         :class="{ 'reserve-space': reserveErrorSpace && !isInvalid }"
         style="color: #B22222 !important;"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<style scoped>
/* Use custom error color for the required asterisk */
.form-label span[aria-hidden="true"] {
  color: #B22222;
  margin-left: 0.25rem;
}

/* Override Bootstrap invalid state colors */
.form-select.is-invalid {
  border-color: #B22222;
}

.form-select.is-invalid:focus {
  border-color: #B22222;
  box-shadow: 0 0 0 0.2rem rgba(178, 34, 34, 0.25);
}

/* Base styles for the error message div */
.error-text {
  display: block;
  color: #B22222 !important;
  margin-top: 0.25rem;
}
</style> 