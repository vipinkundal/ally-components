import type { InjectionKey, Ref, WritableComputedRef } from 'vue'

export interface AllyFormError {
  id: string;
  message: string;
}

export interface AllyFormContext {
  updateErrorState: (id: string, errorMessage: string) => void;
  clearErrorState: (id: string) => void;
}

export const AllyFormKey: InjectionKey<AllyFormContext> = Symbol('AllyForm'); 