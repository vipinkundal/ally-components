<script setup lang="ts">
import { ref, computed } from 'vue'
import AllyTextarea from '../components/ally/AllyTextarea.vue'

const basicText = ref('')
const requiredText = ref('')
const placeholderText = ref('')
const helpText = ref('')
const counterText = ref('Initial value\nwith multiple lines')
const externalDescriptionText = ref('')
const helpAndErrorText = ref('Some input')
const longText = ref('')

// Computed error message for the basic textarea
const basicError = computed(() => {
  return basicText.value === 'error' ? 'Input value cannot be \'error\'.' : '';
});
</script>

<template>
  <div>
    <h2>AllyTextarea States</h2>
    <p>Examples of the <code>AllyTextarea</code> component in different configurations.</p>

    <hr>

    <h4>Basic (with conditional error)</h4>
    <AllyTextarea 
      id="basic-textarea"
      label="Basic Textarea"
      v-model="basicText"
      :error-message="basicError"
    />
    <pre class="mt-2">Model Value: {{ basicText }}</pre>

    <hr>

    <h4>Required</h4>
    <AllyTextarea 
      id="required-textarea"
      label="Required Textarea"
      v-model="requiredText"
      required
    />

    <hr>

    <h4>With Placeholder</h4>
    <AllyTextarea 
      id="placeholder-textarea"
      label="Textarea with Placeholder"
      v-model="placeholderText"
      placeholder="Enter multiple lines of text..."
    />

    <hr>

    <h4>With Help Text Slot</h4>
    <AllyTextarea 
      id="help-textarea"
      label="Textarea with Help"
      v-model="helpText"
    >
      <template #helptext>
        This is helpful text rendered via the slot.
      </template>
    </AllyTextarea>

    <hr>

    <h4>With Help Text and Error</h4>
    <AllyTextarea 
      id="help-error-textarea"
      label="Textarea with Help and Error"
      v-model="helpAndErrorText"
      error-message="This field has an error."
    >
      <template #helptext>
        This hint is still visible even when there is an error.
      </template>
    </AllyTextarea>

    <hr>

    <h4>With Maxlength and Counter</h4>
    <AllyTextarea 
      id="counter-textarea"
      label="Textarea with Counter"
      v-model="counterText"
      :maxlength="100"
      show-counter
    />

    <hr>

    <h4>With External Description</h4>
    <p id="external-desc">This paragraph provides extra context for the textarea below.</p>
    <AllyTextarea 
      id="describedby-textarea"
      label="Textarea Linked Externally"
      v-model="externalDescriptionText"
      aria-describedby="external-desc"
    />

    <hr>

    <h4>Custom Rows</h4>
    <AllyTextarea 
      id="long-textarea"
      label="Long Textarea"
      v-model="longText"
      :rows="6"
      placeholder="This textarea has 6 rows by default"
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
  white-space: pre-wrap;
}
hr {
  margin: 2rem 0;
}
h4 {
  margin-bottom: 1rem;
}
</style> 