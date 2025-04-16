import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import AllyForm from '../AllyForm.vue';
import { defineComponent, nextTick, h, inject, ref, onUnmounted, provide, readonly } from 'vue';
import { AllyFormKey, type AllyFormContext } from '../allyFormKeys';

// Mock child component that uses the provide/inject context
const MockAllyInput = defineComponent({
  props: { 
    inputId: { type: String, required: true },
    initialError: { type: String, default: '' }
  },
  setup(props) {
    const allyForm = inject(AllyFormKey);
    if (allyForm && props.initialError) {
      allyForm.updateErrorState(props.inputId, props.initialError);
    }
    onUnmounted(() => {
      if (allyForm) {
        allyForm.clearErrorState(props.inputId);
      }
    });
    return {
      updateError: (msg: string) => allyForm?.updateErrorState(props.inputId, msg)
    };
  },
  render() { // Need a basic render function
    return h('div', `MockInput-${this.inputId}`);
  }
});

describe('AllyForm', () => {
  it('renders a form element', () => {
    const wrapper = mount(AllyForm);
    expect(wrapper.find('form').exists()).toBe(true);
  });

  it('renders default slot content', () => {
    // Create a simple component to render in the slot
    const SlotContent = defineComponent({
      template: '<div id="slot-content">Hello Form</div>',
    });

    const wrapper = mount(AllyForm, {
      slots: {
        default: SlotContent,
      },
    });

    const form = wrapper.find('form');
    expect(form.exists()).toBe(true);
    const slotDiv = form.find('#slot-content');
    expect(slotDiv.exists()).toBe(true);
    expect(slotDiv.text()).toBe('Hello Form');
  });

  it('does not display error summary initially (by default)', () => {
    const wrapper = mount(AllyForm);
    expect(wrapper.find('.ally-form-error-summary').exists()).toBe(false);
  });

  it('does not display error summary when showErrorSummary is false, even with errors', async () => {
    const wrapper = mount(AllyForm, {
      props: { showErrorSummary: false }, // Explicitly false
      slots: {
        default: h(MockAllyInput, { inputId: 'test1', initialError: 'Error One' })
      }
    });
    await nextTick();
    expect(wrapper.find('.ally-form-error-summary').exists()).toBe(false);
  });

  it('displays error summary when showErrorSummary is true and a child reports an error', async () => {
    const wrapper = mount(AllyForm, {
      props: { showErrorSummary: true }, // Set prop to true
      slots: {
        default: h(MockAllyInput, { inputId: 'test1', initialError: 'Error One' })
      }
    });
    await nextTick(); 
    const summary = wrapper.find('.ally-form-error-summary');
    expect(summary.exists()).toBe(true);
    expect(summary.text()).toContain('Error One');
  });

  it('updates error summary when showErrorSummary is true and child error changes', async () => {
    const wrapper = mount(AllyForm, {
      props: { showErrorSummary: true }, // Set prop to true
      slots: {
        default: h(MockAllyInput, { inputId: 'test1', initialError: 'Error One' })
      }
    });
    await nextTick(); 
    expect(wrapper.find('.ally-form-error-summary').text()).toContain('Error One');

    const childComponent = wrapper.findComponent(MockAllyInput);
    await childComponent.vm.updateError('Error Two');
    await nextTick(); 

    const summary = wrapper.find('.ally-form-error-summary');
    expect(summary.exists()).toBe(true);
    expect(summary.text()).not.toContain('Error One');
    expect(summary.text()).toContain('Error Two');
  });

  it('removes error from summary when showErrorSummary is true and child clears error', async () => {
    const wrapper = mount(AllyForm, {
      props: { showErrorSummary: true }, // Set prop to true
      slots: {
        default: h(MockAllyInput, { inputId: 'test1', initialError: 'Error One' })
      }
    });
    await nextTick(); 
    expect(wrapper.find('.ally-form-error-summary').exists()).toBe(true);

    const childComponent = wrapper.findComponent(MockAllyInput);
    await childComponent.vm.updateError('');
    await nextTick(); 

    expect(wrapper.find('.ally-form-error-summary').exists()).toBe(false);
  });

  it('removes error from summary when showErrorSummary is true and child is unmounted', async () => {
    const show = ref(true);
    const TestWrapper = defineComponent({
        components: { AllyForm, MockAllyInput },
        setup() { 
          // Provide only the necessary context for error reporting
          provide(AllyFormKey, {
            updateErrorState: vi.fn(), 
            clearErrorState: vi.fn(),
            // No reserveErrorSpace here
          });
          return { show }; 
        },
        template: `
          <AllyForm :show-error-summary="true">
            <MockAllyInput v-if="show" inputId="test1" initialError="Error One" />
          </AllyForm>
        `
    });
    const wrapper = mount(TestWrapper);
    await nextTick();
    expect(wrapper.findComponent(AllyForm).find('.ally-form-error-summary').exists()).toBe(true);

    show.value = false;
    await nextTick();
    expect(wrapper.findComponent(AllyForm).find('.ally-form-error-summary').exists()).toBe(false);
  });

  // Add more tests here later if AllyForm gets props or emits (e.g., submit handling)
}); 