<script setup lang="ts">
import { ref, reactive } from 'vue'
import AllyForm from '../components/ally/AllyForm.vue'
import AllyTextbox from '../components/ally/AllyTextbox.vue'
import AllyCheckbox from '../components/ally/AllyCheckbox.vue'
import AllyTextarea from '../components/ally/AllyTextarea.vue'
import AllySelect from '../components/ally/AllySelect.vue'
// Import other Ally components like Button when ready

// Ref for the AllyForm component instance
const myFormRef = ref<InstanceType<typeof AllyForm> | null>(null);

// Use reactive state for form data
const formData = reactive({
  name: '',
  email: '',
  comments: '',
  termsAccepted: false,
  favoriteColor: '',
});

// Use reactive state for field-level errors
const fieldErrors = reactive({
  name: '',
  email: '',
  comments: '',
  termsAccepted: '',
  favoriteColor: '',
});

// Updated form submission handler
async function handleFormSubmit() {
  // --- Clear previous errors ---
  fieldErrors.name = '';
  fieldErrors.email = '';
  fieldErrors.comments = '';
  fieldErrors.termsAccepted = '';
  fieldErrors.favoriteColor = '';
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
  if (!formData.favoriteColor) {
    fieldErrors.favoriteColor = 'Please select your favorite color.';
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
  <div class="demo-form-wrapper">
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

      <AllySelect
        id="color-select"
        label="Favorite Color"
        v-model="formData.favoriteColor"
        :options="[
          { value: 'red', label: 'Red' },
          { value: 'blue', label: 'Blue' },
          { value: 'green', label: 'Green' },
          { value: 'yellow', label: 'Yellow' }
        ]"
        :error-message="fieldErrors.favoriteColor"
        required
      >
        <template #helptext>
          Choose your favorite color from the list.
        </template>
      </AllySelect>

      <AllyTextarea
        id="comments-input"
        label="Comments"
        v-model="formData.comments"
        placeholder="Add your comments here..."
        :maxlength="200"
        :error-message="fieldErrors.comments"
        required
        show-counter
        :rows="4"
      >
        <template #helptext>
          Please provide any additional information or feedback.
        </template>
      </AllyTextarea>

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
.demo-form-wrapper {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 0;
}

.form-group + .form-group, 
.form-group + .btn {
  margin-top: 1rem;
}

p {
  margin-bottom: 1.5rem;
}
</style>
