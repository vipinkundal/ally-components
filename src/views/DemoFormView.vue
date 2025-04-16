<script setup lang="ts">
import { ref } from 'vue'
import AllyForm from '../components/ally/AllyForm.vue'
import AllyTextbox from '../components/ally/AllyTextbox.vue'
// Import other Ally components like Button when ready

// Create refs for data binding
const name = ref('')
const email = ref('')
const comments = ref('') 
const emailError = ref('') 
const commentsError = ref('') // Added error ref for comments

// Example validation function for Email
function validateEmail() {
  if (!email.value) {
      emailError.value = 'Email address is required.';
  } else if (!email.value.includes('@')) {
    emailError.value = 'Please enter a valid email address.';
  } else {
    emailError.value = '' // Clear error
  }
}

// Example validation function for Comments
function validateComments() {
    if (!comments.value) {
        commentsError.value = 'Comments are required.';
    } else {
        commentsError.value = '' // Clear error
    }
}

function submitForm() {
  // Trigger validation on submit attempt
  validateEmail();
  validateComments();

  // Check if any errors exist (alternative to checking AllyForm internal state)
  if (emailError.value || commentsError.value) {
      return; // Prevent actual submission
  }

  // Handle form submission logic (e.g., send data to server)
  alert(`Form Submitted!\nName: ${name.value}\nEmail: ${email.value}\nComments: ${comments.value}`)
}
</script>

<template>
  <div>
    <h2>Demo Form</h2>
    <p>This form demonstrates various components working together, including the error summary.</p>

    <AllyForm 
      @submit.prevent="submitForm"
      :show-error-summary="true" 
    >
      <AllyTextbox
        id="name-input"
        label="Your Name"
        v-model="name"
        placeholder="Enter your name"

        required
      />

      <AllyTextbox
        id="email-input"
        label="Your Email"
        type="email"
        v-model="email"
        placeholder="Enter your email"
        :error-message="emailError"
        @blur="validateEmail" 
        required
      >
        <template #helptext>
          We'll never share your email.
        </template>
      </AllyTextbox>

      <AllyTextbox
        id="long-text-input"
        label="Comments (Max 50 chars)"
        v-model="comments" 
        placeholder="Add comments"
        :maxlength="50"
        :error-message="commentsError" 
        @blur="validateComments"
        required
        show-counter
      />

      <!-- Replace with AllyButton when available -->
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
