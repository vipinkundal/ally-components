<script setup lang="ts">
import { ref } from 'vue';
import AllyRadioButtons from '../components/ally/AllyRadioButtons.vue';

const options = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
  { label: 'Option 4 (Disabled)', value: 'option4', disabled: true },
];

const basic = ref('');
const prechecked = ref('option2');
const required = ref('');
const errorState = ref('');
const requiredError = ref('');
const disabled = ref('');
const withHelp = ref('');

function checkRequired() {
  requiredError.value = !required.value ? 'Selection is required.' : '';
}
</script>

<template>
  <div>
    <h2>AllyRadioButtons States</h2>
    <p>Demonstrating different configurations and states of the radio button component.</p>

    <hr>

    <div class="demo-section">
      <h4>Basic Usage</h4>
      <AllyRadioButtons
        id="radio-basic"
        label="Choose an option"
        :options="options"
        v-model="basic"
      />
      <p>State: {{ basic }}</p>
    </div>

    <hr>

    <div class="demo-section">
      <h4>Pre-checked</h4>
      <AllyRadioButtons
        id="radio-prechecked"
        label="Pre-checked option"
        :options="options"
        v-model="prechecked"
      />
      <p>State: {{ prechecked }}</p>
    </div>

    <hr>

    <div class="demo-section">
      <h4>Required (with validation check)</h4>
      <AllyRadioButtons
        id="radio-required"
        label="Required RadioButtons"
        :options="options"
        v-model="required"
        :error-message="requiredError"
        required
        @blur="checkRequired"
      />
      <button class="btn btn-secondary btn-sm mt-2" @click="checkRequired">Check Validation</button>
      <p>State: {{ required }}</p>
    </div>

    <hr>

    <div class="demo-section">
      <h4>With Error Message</h4>
      <AllyRadioButtons
        id="radio-error"
        label="RadioButtons with Error"
        :options="options"
        v-model="errorState"
        error-message="This field has an external error."
      />
      <p>State: {{ errorState }}</p>
    </div>

    <hr>

    <div class="demo-section">
      <h4>Disabled Options</h4>
      <AllyRadioButtons
        id="radio-disabled"
        label="RadioButtons with Disabled Option"
        :options="options"
        v-model="disabled"
        disabled
      />
      <p>State: {{ disabled }}</p>
    </div>

    <hr>

    <div class="demo-section">
      <h4>With Help Text</h4>
      <AllyRadioButtons
        id="radio-help"
        label="RadioButtons with Help"
        :options="options"
        v-model="withHelp"
        helptext="Select one option."
      />
      <p>State: {{ withHelp }}</p>
    </div>
  </div>
</template>

<style scoped>
.demo-section {
  margin-bottom: 2rem;
}
hr {
  margin: 2rem 0;
}
p {
  margin-top: 0.5rem;
  font-size: 0.9em;
  color: #555;
}
</style>