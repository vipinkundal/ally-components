<script setup lang="ts">
import { ref, reactive } from 'vue'
import AllyForm from '../components/ally/AllyForm.vue'
import AllyTextbox from '../components/ally/AllyTextbox.vue'
import AllyCheckbox from '../components/ally/AllyCheckbox.vue'
// Import other Ally components like Button when ready

// Ref for the AllyForm component instance
const myFormRef = ref<InstanceType<typeof AllyForm> | null>(null);

// Use reactive state for form data
const formData = reactive({
  name: '',
  email: '',
  comments: '',
  termsAccepted: false,
});

// Use reactive state for field-level errors
const fieldErrors = reactive({
  name: '',
  email: '',
  comments: '',
  termsAccepted: '',
});

// Updated form submission handler
async function handleFormSubmit() {
  // --- Clear previous errors ---
  fieldErrors.name = '';
  fieldErrors.email = '';
  fieldErrors.comments = '';
  fieldErrors.termsAccepted = '';
  myFormRef.value?.clearAllErrors();

  // --- Perform Field Validation ---
  let isValid = true;
  if (!formData.name) {
    fieldErrors.name = 'Name is required.';
    isValid = false;
  }
  if (!formData.email) {
    fieldErrors.email = 'Email address is required.';
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    fieldErrors.email = 'Please enter a valid email address.';
    isValid = false;
  }
  if (!formData.comments) {
    fieldErrors.comments = 'Comments are required.';
    isValid = false;
  }
  if (!formData.termsAccepted) {
    fieldErrors.termsAccepted = 'You must accept the terms and conditions.';
    isValid = false;
  }

  // --- Always Simulate API Failure if Field Validation Passes ---
  if (isValid) {
    try {
      // Directly throw the error here for demonstration purposes
      throw new Error("Simulated API Failure: Something went wrong on the server.");

      // This success part will now never be reached in the demo
      // alert(`Form Submitted Successfully!\nName: ${formData.name}\nEmail: ${formData.email}\nComments: ${formData.comments}`);

    } catch (error: any) {
      isValid = false; // Mark as invalid because of the simulated failure
      // Add the form-level error using the exposed method
      myFormRef.value?.addFormError('apiError', `Submission Failed: ${error.message}`);
    }
  }

  if (!isValid) {
    console.log('Form has validation errors or simulated failure.');
  } else {
     // This case should not happen anymore with the forced failure
     console.log('Form submitted successfully (this should not happen in demo).');
  }
}
</script>

<template>
  <div>
    <h2>Demo Form</h2>
    <p>This form demonstrates displaying field-specific errors and a simulated form-level API error in the summary.</p>

    <AllyForm
      ref="myFormRef"
      @submit.prevent="handleFormSubmit"
      :show-error-summary="true"
    >
      <AllyTextbox
        id="name-input"
        label="Your Name"
        v-model="formData.name"
        placeholder="Enter your name"
        :error-message="fieldErrors.name"
        required
      />

      <AllyTextbox
        id="email-input"
        label="Your Email"
        type="email"
        v-model="formData.email"
        placeholder="Enter your email"
        :error-message="fieldErrors.email"
        required
      >
        <template #helptext>
          We'll never share your email.
        </template>
      </AllyTextbox>

      <AllyTextbox
        id="long-text-input"
        label="Comments (Max 50 chars)"
        v-model="formData.comments"
        placeholder="Add comments"
        :maxlength="50"
        :error-message="fieldErrors.comments"
        required
        show-counter
      />

      <AllyCheckbox 
        id="terms-checkbox"
        label="I accept the terms and conditions"
        v-model="formData.termsAccepted"
        :error-message="fieldErrors.termsAccepted"
        required
      />

      <button type="submit" class="btn btn-primary mt-3">Submit</button>
    </AllyForm>
  </div>
</template>

<style scoped>
/* Add spacing between form elements */
.form-group + .form-group, 
.form-group + .btn {
  margin-top: 1rem;
}

p {
  margin-bottom: 1.5rem;
}
</style>
