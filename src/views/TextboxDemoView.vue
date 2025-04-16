<script setup lang="ts">
import { ref, computed } from 'vue'
import AllyTextbox from '../components/ally/AllyTextbox.vue'

const basicText = ref('')
const requiredText = ref('')
const placeholderText = ref('')
const emailText = ref('not-an-email')
const emailError = ref('This must be a valid email.')
const helpText = ref('')
const counterText = ref('Initial value')
const externalDescriptionText = ref('')
const helpAndErrorText = ref('Some input')

// Computed error message for the basic textbox
const basicError = computed(() => {
  return basicText.value === 'error' ? 'Input value cannot be \'error\'.' : '';
});
</script>

<template>
  <div>
    <h2>AllyTextbox States</h2>
    <p>Examples of the <code>AllyTextbox</code> component in different configurations.</p>

    <hr>

    <h4>Basic (with conditional error)</h4>
    <AllyTextbox 
      id="basic-textbox"
      label="Basic Textbox"
      v-model="basicText"
      :error-message="basicError"
    />
    <pre class="mt-2">Model Value: {{ basicText }}</pre>

    <hr>

    <h4>Required</h4>
    <AllyTextbox 
      id="required-textbox"
      label="Required Textbox"
      v-model="requiredText"
      required
    />

    <hr>

    <h4>With Placeholder</h4>
    <AllyTextbox 
      id="placeholder-textbox"
      label="Textbox with Placeholder"
      v-model="placeholderText"
      placeholder="Enter something..."
    />

    <hr>

    <h4>Email Type with Error</h4>
    <AllyTextbox 
      id="email-textbox"
      label="Email Input (Invalid Example)"
      type="email"
      v-model="emailText"
      :error-message="emailError" 
      required
    />

    <hr>

    <h4>With Help Text Slot</h4>
    <AllyTextbox 
      id="help-textbox"
      label="Textbox with Help"
      v-model="helpText"
    >
      <template #helptext>
        This is helpful text rendered via the slot.
      </template>
    </AllyTextbox>

    <hr>

    <h4>With Help Text and Error</h4>
    <AllyTextbox 
      id="help-error-textbox"
      label="Textbox with Help and Error"
      v-model="helpAndErrorText"
      error-message="This field has an error."
    >
      <template #helptext>
        This hint is still visible even when there is an error.
      </template>
    </AllyTextbox>

    <hr>

    <h4>With Maxlength and Counter</h4>
    <AllyTextbox 
      id="counter-textbox"
      label="Textbox with Counter"
      v-model="counterText"
      :maxlength="25"
      show-counter
    />

    <hr>

    <h4>With External Description</h4>
    <p id="external-desc">This paragraph provides extra context for the input below.</p>
    <AllyTextbox 
      id="describedby-textbox"
      label="Textbox Linked Externally"
      v-model="externalDescriptionText"
      aria-describedby="external-desc"
    />

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
