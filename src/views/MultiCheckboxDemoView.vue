<script setup lang="ts">
import { ref } from 'vue';
import AllyMultiCheckbox from '../components/ally/AllyMultiCheckbox.vue';

const options = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
  { label: 'Option 4 (Disabled)', value: 'option4', disabled: true },
];

const basic = ref([]);
const prechecked = ref(['option2', 'option3']);
const required = ref([]);
const errorState = ref([]);
const requiredError = ref('');
const disabled = ref([]);
const withHelp = ref([]);
const min2 = ref([]);
const min2Error = ref('');
const max2 = ref([]);
const max2Error = ref('');
const min1max2 = ref([]);
const min1max2Error = ref('');

function checkRequired() {
  requiredError.value = required.value.length === 0 ? 'At least one option is required.' : '';
}

function checkMin2() {
  min2Error.value = min2.value.length < 2 ? 'Please select at least 2 options.' : '';
}

function checkMax2() {
  max2Error.value = max2.value.length > 2 ? 'Please select no more than 2 options.' : '';
}

function checkMin1Max2() {
  if (min1max2.value.length < 1) min1max2Error.value = 'Select at least 1.';
  else if (min1max2.value.length > 2) min1max2Error.value = 'No more than 2.';
  else min1max2Error.value = '';
}
</script>

<template>
  <div>
    <h2>AllyMultiCheckbox States</h2>
    <p>Demonstrating different configurations and states of the multi-checkbox component.</p>

    <hr>

    <div class="demo-section">
      <h4>Basic Usage</h4>
      <AllyMultiCheckbox
        id="multi-basic"
        label="Choose options"
        :options="options"
        v-model="basic"
      />
      <p>State: {{ basic }}</p>
    </div>

    <hr>

    <div class="demo-section">
      <h4>Pre-checked</h4>
      <AllyMultiCheckbox
        id="multi-prechecked"
        label="Pre-checked options"
        :options="options"
        v-model="prechecked"
      />
      <p>State: {{ prechecked }}</p>
    </div>

    <hr>

    <div class="demo-section">
      <h4>Required (with validation check)</h4>
      <AllyMultiCheckbox
        id="multi-required"
        label="Required MultiCheckbox"
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
      <AllyMultiCheckbox
        id="multi-error"
        label="MultiCheckbox with Error"
        :options="options"
        v-model="errorState"
        error-message="This field has an external error."
      />
      <p>State: {{ errorState }}</p>
    </div>

    <hr>

    <div class="demo-section">
      <h4>Disabled Options</h4>
      <AllyMultiCheckbox
        id="multi-disabled"
        label="MultiCheckbox with Disabled Option"
        :options="options"
        v-model="disabled"
        disabled
      />
      <p>State: {{ disabled }}</p>
    </div>

    <hr>

    <div class="demo-section">
      <h4>With Help Text</h4>
      <AllyMultiCheckbox
        id="multi-help"
        label="MultiCheckbox with Help"
        :options="options"
        v-model="withHelp"
        helptext="You can select multiple options."
      />
      <p>State: {{ withHelp }}</p>
    </div>

    <hr>

    <div class="demo-section">
      <h4>Min Selected Items (at least 2)</h4>
      <AllyMultiCheckbox
        id="multi-min2"
        label="Select at least 2 options"
        :options="options"
        v-model="min2"
        :min-selected-items="2"
        :error-message="min2Error"
        @blur="checkMin2"
      />
      <button class="btn btn-secondary btn-sm mt-2" @click="checkMin2">Check Validation</button>
      <p>State: {{ min2 }}</p>
    </div>

    <hr>

    <div class="demo-section">
      <h4>Max Selected Items (at most 2)</h4>
      <AllyMultiCheckbox
        id="multi-max2"
        label="Select no more than 2 options"
        :options="options"
        v-model="max2"
        :max-selected-items="2"
        :error-message="max2Error"
        @blur="checkMax2"
      />
      <button class="btn btn-secondary btn-sm mt-2" @click="checkMax2">Check Validation</button>
      <p>State: {{ max2 }}</p>
    </div>

    <hr>

    <div class="demo-section">
      <h4>Min 1, Max 2 Selected Items</h4>
      <AllyMultiCheckbox
        id="multi-min1max2"
        label="Select 1 or 2 options"
        :options="options"
        v-model="min1max2"
        :min-selected-items="1"
        :max-selected-items="2"
        :error-message="min1max2Error"
        @blur="checkMin1Max2"
      />
      <button class="btn btn-secondary btn-sm mt-2" @click="checkMin1Max2">Check Validation</button>
      <p>State: {{ min1max2 }}</p>
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