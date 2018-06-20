export default interface FieldInterface {
  value: any,
  savedValue: any,
  editedValue: any,
  // use full name as name like - 'parent.child'
  name: string,
  disabled: boolean,
  dirty: boolean,
  touched: boolean,
  valid: boolean,
  // rename invalidMsg to error for more convenience
  error: string,
  saving: boolean,
  savable: boolean,
  focused: boolean,
  defaultValue: any,
  props: {
    name: string,
    value: any,
    disabled: boolean,
    onChange: (event: Event) => void,
  }
}
