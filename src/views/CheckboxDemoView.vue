<script setup lang="ts">
import { ref } from 'vue'
import AllyCheckbox from '../components/ally/AllyCheckbox.vue'

const basic = ref(false)
const checked = ref(true)
const requiredUnchecked = ref(false)
const errorState = ref(false)
const disabledUnchecked = ref(false)
const disabledChecked = ref(true)
const withHelp = ref(false)

const requiredError = ref('')

function checkRequired() {
    requiredError.value = !requiredUnchecked.value ? 'This checkbox is required.' : ''
}

</script>

<template>
    <div>
        <h2>AllyCheckbox States</h2>
        <p>Demonstrating different configurations and states of the checkbox component.</p>

        <hr>

        <div class="demo-section">
            <h4>Basic Usage</h4>
            <AllyCheckbox 
                id="chk-basic" 
                label="Basic Checkbox" 
                v-model="basic" 
            />
            <p>State: {{ basic }}</p>
        </div>

        <hr>

        <div class="demo-section">
            <h4>Pre-checked</h4>
            <AllyCheckbox 
                id="chk-checked" 
                label="Already Checked" 
                v-model="checked" 
            />
            <p>State: {{ checked }}</p>
        </div>

        <hr>

        <div class="demo-section">
            <h4>Required (with validation check)</h4>
            <AllyCheckbox 
                id="chk-required"
                label="Required Checkbox"
                v-model="requiredUnchecked"
                :error-message="requiredError"
                required
                @blur="checkRequired" 
            />
            <button class="btn btn-secondary btn-sm mt-2" @click="checkRequired">Check Validation</button>
            <p>State: {{ requiredUnchecked }}</p>
        </div>
        
        <hr>

        <div class="demo-section">
            <h4>With Error Message</h4>
            <AllyCheckbox 
                id="chk-error"
                label="Checkbox with Error"
                v-model="errorState"
                error-message="This checkbox has an external error."
            />
            <p>State: {{ errorState }}</p>
        </div>

        <hr>

        <div class="demo-section">
            <h4>Disabled</h4>
            <AllyCheckbox 
                id="chk-disabled-unchecked"
                label="Disabled Unchecked"
                v-model="disabledUnchecked"
                disabled
            />
            <br>
             <AllyCheckbox 
                id="chk-disabled-checked"
                label="Disabled Checked"
                v-model="disabledChecked"
                disabled
            />
        </div>

        <hr>

        <div class="demo-section">
            <h4>With Help Text Slot</h4>
            <AllyCheckbox 
                id="chk-help"
                label="Checkbox with Help"
                v-model="withHelp"
            >
                <template #helptext>
                    This is some helpful text provided via the slot.
                </template>
            </AllyCheckbox>
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