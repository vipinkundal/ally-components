import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import AllyTextarea from '../AllyTextarea.vue';
import { AllyFormKey, type AllyFormContext } from '../allyFormKeys';
import { ref, readonly } from 'vue';

const mockUpdateErrorState = vi.fn();
const mockClearErrorState = vi.fn();
const mockAllyFormContext = (): Partial<AllyFormContext> => ({
  updateErrorState: mockUpdateErrorState,
  clearErrorState: mockClearErrorState,
});

describe('AllyTextarea', () => {
  beforeEach(() => {
    mockUpdateErrorState.mockClear();
    mockClearErrorState.mockClear();
  });

  it('renders label and textarea with id', () => {
    const wrapper = mount(AllyTextarea, {
      props: {
        id: 'test-textarea',
        label: 'Test Label',
        modelValue: '',
      },
    });
    expect(wrapper.find('label').exists()).toBe(true);
    expect(wrapper.find('label').text()).toContain('Test Label');
    expect(wrapper.find('label').attributes('for')).toBe('test-textarea');
    expect(wrapper.find('textarea').exists()).toBe(true);
    expect(wrapper.find('textarea').attributes('id')).toBe('test-textarea');
  });

  it('updates modelValue on input', async () => {
    const wrapper = mount(AllyTextarea, {
      props: {
        id: 'test-textarea',
        label: 'Test Label',
        modelValue: '',
        'onUpdate:modelValue': (e: string) => wrapper.setProps({ modelValue: e }),
      },
    });
    const textarea = wrapper.find('textarea');
    await textarea.setValue('hello\nworld');
    expect(wrapper.props('modelValue')).toBe('hello\nworld');
    expect(textarea.element.value).toBe('hello\nworld');
  });

  it('applies required attributes and indicator', () => {
    const wrapper = mount(AllyTextarea, {
      props: {
        id: 'test-textarea',
        label: 'Test Label',
        modelValue: '',
        required: true,
      },
    });
    const label = wrapper.find('label');
    const textarea = wrapper.find('textarea');
    expect(label.find('span[aria-hidden="true"]').exists()).toBe(true);
    expect(label.find('span[aria-hidden="true"]').text()).toBe('*');
    expect(textarea.attributes('aria-required')).toBe('true');
  });

  it('applies placeholder attribute', () => {
    const wrapper = mount(AllyTextarea, {
      props: {
        id: 'test-textarea',
        label: 'Test Label',
        modelValue: '',
        placeholder: 'Enter text here',
      },
    });
    expect(wrapper.find('textarea').attributes('placeholder')).toBe('Enter text here');
  });

  it('applies rows attribute', () => {
    const wrapper = mount(AllyTextarea, {
      props: {
        id: 'test-textarea',
        label: 'Test Label',
        modelValue: '',
        rows: 5,
      },
    });
    expect(wrapper.find('textarea').attributes('rows')).toBe('5');
  });

  it('applies maxlength attribute', () => {
    const wrapper = mount(AllyTextarea, {
      props: {
        id: 'test-textarea',
        label: 'Test Label',
        modelValue: '',
        maxlength: 500,
      },
    });
    expect(wrapper.find('textarea').attributes('maxlength')).toBe('500');
  });

  it('displays character counter when showCounter and maxlength are set', () => {
    const wrapper = mount(AllyTextarea, {
      props: {
        id: 'test-textarea',
        label: 'Test Label',
        modelValue: 'abcde\nfghij',
        maxlength: 100,
        showCounter: true,
      },
    });
    const counter = wrapper.find(`#${wrapper.props('id')}-counter`);
    expect(counter.exists()).toBe(true);
    expect(counter.text()).toBe('11 / 100');
    expect(wrapper.find('textarea').attributes('aria-describedby')).toContain(`${wrapper.props('id')}-counter`);
  });

  it('displays error message and applies invalid state when errorMessage is provided', () => {
    const wrapper = mount(AllyTextarea, {
      props: {
        id: 'test-textarea',
        label: 'Test Label',
        modelValue: 'invalid data',
        errorMessage: 'This field is required',
      },
    });
    const textarea = wrapper.find('textarea');
    const error = wrapper.find(`#${wrapper.props('id')}-error`);

    expect(textarea.classes()).toContain('is-invalid');
    expect(textarea.attributes('aria-invalid')).toBe('true');
    expect(error.exists()).toBe(true);
    expect(error.text()).toBe('This field is required');
    expect(textarea.attributes('aria-describedby')).toContain(`${wrapper.props('id')}-error`);
    expect(wrapper.find('.form-group').classes()).toContain('ally-has-error');
  });

  it('renders help text slot and links via aria-describedby', () => {
    const wrapper = mount(AllyTextarea, {
      props: {
        id: 'test-textarea',
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
    expect(wrapper.find('textarea').attributes('aria-describedby')).toContain(`${wrapper.props('id')}-help`);
  });

  it('links external description, help text, error message and counter via aria-describedby', () => {
    const wrapper = mount(AllyTextarea, {
      props: {
        id: 'test-complex',
        label: 'Complex Textarea',
        modelValue: 'data',
        ariaDescribedby: 'external-description',
        errorMessage: 'Something is wrong',
        maxlength: 100,
        showCounter: true,
      },
      slots: {
        helptext: 'Some useful hint',
      },
    });
    const textarea = wrapper.find('textarea');
    const describedby = textarea.attributes('aria-describedby');
    expect(describedby).toContain('external-description');
    expect(describedby).toContain(`${wrapper.props('id')}-help`);
    expect(describedby).toContain(`${wrapper.props('id')}-error`);
    expect(describedby).toContain(`${wrapper.props('id')}-counter`);
  });

  it('calls updateErrorState on mount with initial error message (when in form)', () => {
    mount(AllyTextarea, {
      props: { id: 'err-mount', label: 'Test', modelValue: '', errorMessage: 'Initial Error' },
      global: { provide: { [AllyFormKey as symbol]: mockAllyFormContext() } }
    });
    expect(mockUpdateErrorState).toHaveBeenCalledWith('err-mount', 'Initial Error');
  });

  it('calls clearErrorState on unmount (when in form)', () => {
    const wrapper = mount(AllyTextarea, {
      props: { id: 'err-unmount', label: 'Test', modelValue: '', errorMessage: 'Some Error' },
      global: { provide: { [AllyFormKey as symbol]: mockAllyFormContext() } }
    });
    mockUpdateErrorState.mockClear();
    mockClearErrorState.mockClear();
    wrapper.unmount();
    expect(mockClearErrorState).toHaveBeenCalledWith('err-unmount');
  });
}); 