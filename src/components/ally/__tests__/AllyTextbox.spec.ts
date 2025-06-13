import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import AllyTextbox from '../AllyTextbox.vue';
import { AllyFormKey, type AllyFormContext } from '../allyFormKeys'; // Import key
import { ref, readonly } from 'vue'; // Import ref and readonly

// Mock AllyForm context for testing error reporting injection
const mockUpdateErrorState = vi.fn();
const mockClearErrorState = vi.fn();
const mockAllyFormContext = (): Partial<AllyFormContext> => ({ // Use Partial<> as we only mock parts
  updateErrorState: mockUpdateErrorState,
  clearErrorState: mockClearErrorState,
});

describe('AllyTextbox', () => {
  // Reset mocks before each test
  beforeEach(() => {
    mockUpdateErrorState.mockClear();
    mockClearErrorState.mockClear();
  });

  // Test basic rendering with required props
  it('renders label and input with id', () => {
    const wrapper = mount(AllyTextbox, {
      props: {
        id: 'test-input',
        label: 'Test Label',
        modelValue: '',
      },
    });
    expect(wrapper.find('label').exists()).toBe(true);
    expect(wrapper.find('label').text()).toContain('Test Label');
    expect(wrapper.find('label').attributes('for')).toBe('test-input');
    expect(wrapper.find('input').exists()).toBe(true);
    expect(wrapper.find('input').attributes('id')).toBe('test-input');
  });

  // Test v-model binding
  it('updates modelValue on input', async () => {
    const wrapper = mount(AllyTextbox, {
      props: {
        id: 'test-input',
        label: 'Test Label',
        modelValue: '',
        'onUpdate:modelValue': (e: string) => wrapper.setProps({ modelValue: e }),
      },
    });
    const input = wrapper.find('input');
    await input.setValue('hello');
    expect(wrapper.props('modelValue')).toBe('hello');
    expect(input.element.value).toBe('hello');
  });

  // Test required prop
  it('applies required attributes and indicator', () => {
    const wrapper = mount(AllyTextbox, {
      props: {
        id: 'test-input',
        label: 'Test Label',
        modelValue: '',
        required: true,
      },
    });
    const label = wrapper.find('label');
    const input = wrapper.find('input');
    expect(label.find('span[aria-hidden="true"]').exists()).toBe(true);
    expect(label.find('span[aria-hidden="true"]').text()).toBe('*');
    expect(input.attributes('aria-required')).toBe('true');
  });

  // Test placeholder prop
  it('applies placeholder attribute', () => {
    const wrapper = mount(AllyTextbox, {
      props: {
        id: 'test-input',
        label: 'Test Label',
        modelValue: '',
        placeholder: 'Enter text here',
      },
    });
    expect(wrapper.find('input').attributes('placeholder')).toBe('Enter text here');
  });

  // Test maxlength prop
  it('applies maxlength attribute', () => {
    const wrapper = mount(AllyTextbox, {
      props: {
        id: 'test-input',
        label: 'Test Label',
        modelValue: '',
        maxlength: 50,
      },
    });
    expect(wrapper.find('input').attributes('maxlength')).toBe('50');
  });

  // Test character counter
  it('displays character counter when showCounter and maxlength are set', () => {
    const wrapper = mount(AllyTextbox, {
      props: {
        id: 'test-input',
        label: 'Test Label',
        modelValue: 'abcde',
        maxlength: 10,
        showCounter: true,
      },
    });
    const counter = wrapper.find(`#${wrapper.props('id')}-counter`);
    expect(counter.exists()).toBe(true);
    expect(counter.text()).toBe('5 / 10');
    expect(wrapper.find('input').attributes('aria-describedby')).toContain(`${wrapper.props('id')}-counter`);
  });

  it('does not display character counter by default', () => {
    const wrapper = mount(AllyTextbox, {
      props: {
        id: 'test-input',
        label: 'Test Label',
        modelValue: '',
        maxlength: 10,
      },
    });
    expect(wrapper.find(`#${wrapper.props('id')}-counter`).exists()).toBe(false);
  });

  // Test error message and invalid state
  it('displays error message and applies invalid state when errorMessage is provided', () => {
    const wrapper = mount(AllyTextbox, {
      props: {
        id: 'test-input',
        label: 'Test Label',
        modelValue: 'invalid data',
        errorMessage: 'This field is required',
      },
    });
    const input = wrapper.find('input');
    const error = wrapper.find(`#${wrapper.props('id')}-error`);

    expect(input.classes()).toContain('is-invalid');
    expect(input.attributes('aria-invalid')).toBe('true');
    expect(error.exists()).toBe(true);
    expect(error.text()).toBe('This field is required');
    expect(input.attributes('aria-describedby')).toContain(`${wrapper.props('id')}-error`);
    expect(wrapper.find(`#${wrapper.props('id')}-error`).exists()).toBe(true);
    expect(wrapper.find('.form-group').classes()).toContain('ally-has-error');
  });

  it('does not apply invalid state when errorMessage is empty (default reserveErrorSpace=true)', () => {
    const wrapper = mount(AllyTextbox, {
      props: {
        id: 'test-no-error-reserve', 
        label: 'Test Label',
        modelValue: 'valid data',
        errorMessage: '',
        reserveErrorSpace: true // Explicitly test the default case
      },
    });
    const input = wrapper.find('input');
    // Check input classes and attributes
    expect(input.classes()).not.toContain('is-invalid');
    expect(input.attributes('aria-invalid')).toBeUndefined();
    // Check parent class
    expect(wrapper.find('.form-group').classes()).not.toContain('ally-has-error');
    // The error div exists, but should be visually hidden (handled by CSS)
    expect(wrapper.find('.error-text.reserve-space').exists()).toBe(true); 
  });

  it('does not render error div when errorMessage is empty and reserveErrorSpace is false', () => {
    const wrapper = mount(AllyTextbox, {
      props: {
        id: 'test-no-error-no-reserve', 
        label: 'Test Label',
        modelValue: 'valid data',
        errorMessage: '',
        reserveErrorSpace: false // Test the non-reserving case
      },
    });
    // Parent should not have error class
    expect(wrapper.find('.form-group').classes()).not.toContain('ally-has-error');
    // Error div should not exist in the DOM
    expect(wrapper.find('.error-text').exists()).toBe(false); 
  });

  // Test help text slot and aria-describedby
  it('renders help text slot and links via aria-describedby', () => {
    const wrapper = mount(AllyTextbox, {
      props: {
        id: 'test-input',
        label: 'Test Label',
        modelValue: '',
      },
      slots: {
        helptext: '<span>This is help text</span>',
      },
    });
    const help = wrapper.find(`#${wrapper.props('id')}-help`);
    expect(help.exists()).toBe(true);
    expect(help.find('span').text()).toBe('This is help text');
    expect(wrapper.find('input').attributes('aria-describedby')).toContain(`${wrapper.props('id')}-help`);
  });

    // Test aria-describedby links multiple elements
    it('links external description, help text, error message and counter via aria-describedby', () => {
        const wrapper = mount(AllyTextbox, {
          props: {
            id: 'test-complex',
            label: 'Complex Input',
            modelValue: 'data',
            ariaDescribedby: 'external-description',
            errorMessage: 'Something is wrong',
            maxlength: 10,
            showCounter: true,
          },
          slots: {
            helptext: 'Some useful hint',
          },
        });
        const input = wrapper.find('input');
        const describedby = input.attributes('aria-describedby');
        expect(describedby).toContain('external-description');
        expect(describedby).toContain(`${wrapper.props('id')}-help`);
        expect(describedby).toContain(`${wrapper.props('id')}-error`);
        expect(describedby).toContain(`${wrapper.props('id')}-counter`);
      });

  // --- Tests for Error Reporting (Provide/Inject) ---
  it('calls updateErrorState on mount with initial error message (when in form)', () => {
    mount(AllyTextbox, {
      props: { id: 'err-mount', label: 'Test', modelValue: '', errorMessage: 'Initial Error' },
      global: { provide: { [AllyFormKey as symbol]: mockAllyFormContext() } } 
    });
    expect(mockUpdateErrorState).toHaveBeenCalledWith('err-mount', 'Initial Error');
  });

  it('does not call updateErrorState on mount if not in form', () => {
    mount(AllyTextbox, {
      props: { id: 'ok-mount', label: 'Test', modelValue: '' },
      // No provide
    });
    expect(mockUpdateErrorState).not.toHaveBeenCalled();
  });

  it('calls updateErrorState when errorMessage prop changes (when in form)', async () => {
    const wrapper = mount(AllyTextbox, {
      props: { id: 'err-update', label: 'Test', modelValue: '' },
      global: { provide: { [AllyFormKey as symbol]: mockAllyFormContext() } }
    });
    mockUpdateErrorState.mockClear(); // Clear initial mount call
    await wrapper.setProps({ errorMessage: 'New Error' });
    expect(mockUpdateErrorState).toHaveBeenCalledWith('err-update', 'New Error');
    await wrapper.setProps({ errorMessage: '' });
    expect(mockUpdateErrorState).toHaveBeenLastCalledWith('err-update', '');
  });

  it('calls clearErrorState on unmount (when in form)', () => {
    const wrapper = mount(AllyTextbox, {
      props: { id: 'err-unmount', label: 'Test', modelValue: '', errorMessage: 'Some Error' },
      global: { provide: { [AllyFormKey as symbol]: mockAllyFormContext() } }
    });
    mockUpdateErrorState.mockClear();
    mockClearErrorState.mockClear();
    wrapper.unmount();
    expect(mockClearErrorState).toHaveBeenCalledWith('err-unmount');
  });

  // --- Tests for error rendering based on reserveErrorSpace prop ---

  it('renders error div always when reserveErrorSpace is true (default prop)', () => {
    const wrapper = mount(AllyTextbox, {
      props: { id: 'reserve-true-prop', label: 'Test', modelValue: '' },
      // No provide needed, testing prop default
    });
    expect(wrapper.find('.error-text.reserve-space').exists()).toBe(true);
  });

  it('renders error div only when invalid if reserveErrorSpace prop is false', async () => {
    const wrapper = mount(AllyTextbox, {
      props: { 
        id: 'reserve-false-prop', 
        label: 'Test', 
        modelValue: '', 
        reserveErrorSpace: false // Set prop directly
      },
    });
    expect(wrapper.find('.error-text').exists()).toBe(false);

    await wrapper.setProps({ errorMessage: 'Error Here' });
    expect(wrapper.find('.error-text').exists()).toBe(true);
    expect(wrapper.find('.error-text.reserve-space').exists()).toBe(false);

    await wrapper.setProps({ errorMessage: '' });
    expect(wrapper.find('.error-text').exists()).toBe(false);
  });

  it('does not throw error if not inside an AllyForm', async () => {
    const wrapper = mount(AllyTextbox, {
      props: { id: 'no-form', label: 'Test', modelValue: '' },
      // No provide here
    });
    // Should mount without error
    expect(wrapper.exists()).toBe(true);
    // Changing props should not cause errors
    await expect(wrapper.setProps({ errorMessage: 'Test Error' })).resolves.not.toThrow();
    // Unmounting should not cause errors
    expect(() => wrapper.unmount()).not.toThrow();
  });
}); 