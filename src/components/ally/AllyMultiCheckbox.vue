<script setup lang="ts">
import { computed, watch, inject, onUnmounted } from 'vue';
import AllyCheckbox from './AllyCheckbox.vue';
import { AllyFormKey } from './allyFormKeys';

interface CheckboxOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

const props = withDefaults(defineProps<{
  id: string;
  label: string;
  options: CheckboxOption[];
  modelValue?: Array<string | number>;
  required?: boolean;
  errorMessage?: string;
  helptext?: string;
  disabled?: boolean;
  reserveErrorSpace?: boolean;
  minSelectedItems?: number;
  maxSelectedItems?: number;
}>(), {
  required: false,
  errorMessage: '',
  helptext: '',
  disabled: false,
  reserveErrorSpace: true,
  modelValue: () => [],
  minSelectedItems: 0,
  maxSelectedItems: undefined, // will default to options.length in setup
});

const emit = defineEmits(['update:modelValue', 'blur']);

const allyForm = inject(AllyFormKey, null);

// Default maxSelectedItems to options.length if not provided
const maxSelected = computed(() =>
  props.maxSelectedItems !== undefined ? props.maxSelectedItems : props.options.length
);

const isInvalid = computed(() => !!validationError.value || !!props.errorMessage);

const selectedValues = computed({
  get: () => props.modelValue ?? [],
  set: (val) => emit('update:modelValue', val),
});

const validationError = computed(() => {
  if (props.disabled) return '';
  const count = selectedValues.value.length;
  if (count < props.minSelectedItems) {
    return `Please select at least ${props.minSelectedItems} option${props.minSelectedItems > 1 ? 's' : ''}.`;
  }
  if (count > maxSelected.value) {
    return `Please select no more than ${maxSelected.value} option${maxSelected.value > 1 ? 's' : ''}.`;
  }
  return '';
});

// Error reporting to AllyForm
watch([() => props.errorMessage, validationError], ([newMessage, newValidation]) => {
  if (allyForm) {
    allyForm.updateErrorState(props.id, newMessage || newValidation || '');
  }
}, { immediate: true });

watch(() => props.id, (newId, oldId) => {
  if (allyForm) {
    if (oldId && (props.errorMessage || validationError.value)) {
      allyForm.clearErrorState(oldId);
    }
    allyForm.updateErrorState(newId, props.errorMessage || validationError.value || '');
  }
});

onUnmounted(() => {
  if (allyForm) {
    allyForm.clearErrorState(props.id);
  }
});

function toggleValue(optionValue: string | number) {
  const current = new Set(selectedValues.value);
  if (current.has(optionValue)) {
    current.delete(optionValue);
  } else {
    current.add(optionValue);
  }
  selectedValues.value = Array.from(current);
}

const helpTextId = computed(() => `${props.id}-help`);
const errorTextId = computed(() => `${props.id}-error`);
</script>

<template>
  <fieldset :id="id" class="form-group" :aria-invalid="isInvalid ? 'true' : undefined">
    <legend class="multi-checkbox-legend">
      {{ label }}
      <span v-if="required" aria-hidden="true" class="text-danger ms-1">*</span>
      <span v-if="required" class="sr-only"> required</span>
    </legend>
    <div class="multi-checkbox-group">
      <AllyCheckbox
        v-for="option in options"
        :key="option.value"
        :id="`${id}-${option.value}`"
        :label="option.label"
        :modelValue="selectedValues.includes(option.value)"
        :disabled="disabled || option.disabled"
        :required="false"
        @update:modelValue="val => toggleValue(option.value)"
        @blur="$emit('blur', $event)"
      />
    </div>
    <small v-if="helptext" :id="helpTextId" class="form-text text-muted">
      {{ helptext }}
    </small>
    <div v-if="isInvalid || reserveErrorSpace"
         :id="errorTextId"
         class="error-text"
         :class="{ 'reserve-space': reserveErrorSpace && !isInvalid }"
         >
      {{ errorMessage || validationError }}
    </div>
  </fieldset>
</template>

<style scoped>
.multi-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.multi-checkbox-legend {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}
.error-text {
  display: block;
  color: #B22222;
  margin-top: 0.25rem;
  font-size: 0.875rem;
}

.error-text.reserve-space {
  visibility: hidden;
}
</style> 