import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AllyRadioButtons from './AllyRadioButtons.vue';

const options = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
  { label: 'Option 4 (Disabled)', value: 'option4', disabled: true },
];

describe('AllyRadioButtons', () => {
  it('renders all options as radio buttons', () => {
    const wrapper = mount(AllyRadioButtons, {
      props: { id: 'test', label: 'Test', options, modelValue: '' }
    });
    const radios = wrapper.findAll('input[type="radio"]');
    expect(radios.length).toBe(options.length);
    options.forEach((opt, i) => {
      expect(radios[i].attributes('value')).toBe(opt.value);
      expect(wrapper.text()).toContain(opt.label);
    });
  });

  it('syncs v-model when selecting a radio', async () => {
    const wrapper = mount(AllyRadioButtons, {
      props: { id: 'test', label: 'Test', options, modelValue: '' }
    });
    const radios = wrapper.findAll('input[type="radio"]');
    await radios[1].setValue('option2');
    expect((wrapper.emitted()['update:modelValue'] as any)[0][0]).toBe('option2');
  });

  it('shows error message when required and not selected', async () => {
    const wrapper = mount(AllyRadioButtons, {
      props: { id: 'test', label: 'Test', options, modelValue: '', required: true, errorMessage: 'Required!' }
    });
    expect(wrapper.text()).toContain('Required!');
    // No radio selected
    const radios = wrapper.findAll('input[type="radio"]');
    radios.forEach(radio => expect(radio.element.required).toBe(true));
  });

  it('displays help text', () => {
    const wrapper = mount(AllyRadioButtons, {
      props: { id: 'test', label: 'Test', options, modelValue: '', helptext: 'Pick one' }
    });
    expect(wrapper.text()).toContain('Pick one');
  });

  it('disables all radios if disabled prop is set', () => {
    const wrapper = mount(AllyRadioButtons, {
      props: { id: 'test', label: 'Test', options, modelValue: '', disabled: true }
    });
    const radios = wrapper.findAll('input[type="radio"]');
    radios.forEach(radio => expect(radio.element.disabled).toBe(true));
  });

  it('disables only the specified option', () => {
    const wrapper = mount(AllyRadioButtons, {
      props: { id: 'test', label: 'Test', options, modelValue: '' }
    });
    const radios = wrapper.findAll('input[type="radio"]');
    expect(radios[3].element.disabled).toBe(true);
    expect(radios[0].element.disabled).toBe(false);
  });
}); 