export default interface FormInterface {
  values: {[index: string]: any},
  savedValues: {[index: string]: any},
  editedValues: {[index: string]: any},
  unsavedValues: {[index: string]: any},
  dirty: boolean,
  touched: boolean,
  saving: boolean,
  submitting: boolean,
  submittable: boolean,
  valid: boolean,
  errors: {[index: string]: any},
}
