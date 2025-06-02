<script setup lang="ts">
import { ref } from 'vue'
import AllySelect from '../components/ally/AllySelect.vue'

const basicSelect = ref('')
const requiredSelect = ref('')
const disabledSelect = ref('')
const errorSelect = ref('')
const helpSelect = ref('')
const helpAndErrorSelect = ref('option1')

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4 (Disabled)', disabled: true },
];

const handleChange = () => {
  console.log('Selected option:', basicSelect.value);
};
</script>

<template>
  <div>
    <h2>AllySelect States</h2>
    <p>Examples of the <code>AllySelect</code> component in different configurations.</p>

    <hr>

    <h4>Basic Select</h4>
    <AllySelect
      id="basic-select"
      label="Select an option"
      v-model="basicSelect"
      :options="options"
      @blur="handleChange"
    >
      <template #helptext>
        Choose an option from the dropdown.
      </template>
    </AllySelect>
    <pre class="mt-2">Model Value: {{ basicSelect }}</pre>

    <hr>

    <h4>Required Select</h4>
    <AllySelect
      id="required-select"
      label="Required Select"
      v-model="requiredSelect"
      :options="options"
      required
    >
      <template #helptext>
        This field is required.
      </template>
    </AllySelect>

    <hr>

    <h4>Disabled Select</h4>
    <AllySelect
      id="disabled-select"
      label="Disabled Select"
      v-model="disabledSelect"
      :options="options"
      disabled
    />

    <hr>

    <h4>Select with Error</h4>
    <AllySelect
      id="error-select"
      label="Select with Error"
      v-model="errorSelect"
      :options="options"
      error-message="This field has an error."
    />

    <hr>

    <h4>Select with Help Text</h4>
    <AllySelect
      id="help-select"
      label="Select with Help"
      v-model="helpSelect"
      :options="options"
    >
      <template #helptext>
        This is helpful text rendered via the slot.
      </template>
    </AllySelect>

    <hr>

    <h4>Select with Help Text and Error</h4>
    <AllySelect
      id="help-error-select"
      label="Select with Help and Error"
      v-model="helpAndErrorSelect"
      :options="options"
      error-message="This field has an error."
    >
      <template #helptext>
        This hint is still visible even when there is an error.
      </template>
    </AllySelect>
  </div>
</template>

<style scoped>
pre {
  background-color: #f8f9fa;
  padding: 10px;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  font-size: 0.9em;
  word-wrap: break-word;
}
hr {
  margin: 2rem 0;
}
h4 {
  margin-bottom: 1rem;
}
</style> 