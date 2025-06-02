<script setup lang="ts">
import { ref } from 'vue';
import AllySelect from './AllySelect.vue';

const selectedOption = ref('');
const selectedRequired = ref('');
const selectedDisabled = ref('');
const selectedWithError = ref('');

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4 (Disabled)', disabled: true },
];

const handleChange = () => {
  console.log('Selected option:', selectedOption.value);
};
</script>

<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-2xl font-bold mb-4">Basic Select</h2>
      <div class="space-y-4">
        <AllySelect
          id="basic-select"
          label="Select an option"
          v-model="selectedOption"
          :options="options"
          @blur="handleChange"
        >
          <template #helptext>
            Choose an option from the dropdown.
          </template>
        </AllySelect>
      </div>
    </div>

    <div>
      <h2 class="text-2xl font-bold mb-4">Required Select</h2>
      <div class="space-y-4">
        <AllySelect
          id="required-select"
          label="Required Select"
          v-model="selectedRequired"
          :options="options"
          required
        >
          <template #helptext>
            This field is required.
          </template>
        </AllySelect>
      </div>
    </div>

    <div>
      <h2 class="text-2xl font-bold mb-4">Disabled Select</h2>
      <div class="space-y-4">
        <AllySelect
          id="disabled-select"
          label="Disabled Select"
          v-model="selectedDisabled"
          :options="options"
          disabled
        />
      </div>
    </div>

    <div>
      <h2 class="text-2xl font-bold mb-4">Select with Error</h2>
      <div class="space-y-4">
        <AllySelect
          id="error-select"
          label="Select with Error"
          v-model="selectedWithError"
          :options="options"
          error-message="This field is required"
        />
      </div>
    </div>
  </div>
</template> 