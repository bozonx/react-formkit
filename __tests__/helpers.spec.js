import helpers from '../src/helpers';

const testField = {
  value: 1,
  savedValue: 2,
  editedValue: 1,
  name: 'field1',
  fullName: 'parent.field1',
  disabled: false,
  dirty: true,
  touched: true,
  valid: false,
  invalidMsg: 'msg',
  saving: false,
  savable: true,
  focused: true,
  defaultValue: 0,
  handleChange: () => {},
};

const testFieldResult = {
  defaultValue: 0,
  dirty: true,
  disabled: false,
  editedValue: 1,
  error: 'msg',
  focused: true,
  handleChange: testField.handleChange,
  name: 'parent.field1',
  props: {
    disabled: false,
    name: 'parent.field1',
    onChange: () => {},
    value: 1
  },
  savable: true,
  savedValue: 2,
  saving: false,
  touched: true,
  valid: false,
  value: 1
};

describe('helpers', () => {

  it('fillFieldsState', () => {
    const formFields = {
      parent: {
        field1: testField,
      },
    };

    const result = {
      parent: {
        field1: testFieldResult,
      },
    };

    const funcResult = helpers.fillFieldsState(formFields);
    result.parent.field1.props.onChange = funcResult.parent.field1.props.onChange;

    expect(funcResult).toEqual(result);
  });

  it('generateFieldsInitParams - fields as array', () => {
    const fields = [ 'parent.field1' ];
    const initalValues = {
      parent: {
        field1: 1,
      }
    };
    const result = {
      'parent.field1': { savedValue: 1},
    };

    expect(helpers.generateFieldsInitParams(fields, initalValues)).toEqual(result);
  });

  it('generateFieldsInitParams - object', () => {
    const fields = {
      parent: {
        field1: {
          disabled: true,
        },
      }
    };
    const initalValues = {
      parent: {
        field1: 1,
      }
    };
    const result = {
      'parent.field1': {
        disabled: true,
        savedValue: 1,
      },
    };

    expect(helpers.generateFieldsInitParams(fields, initalValues)).toEqual(result);
  });

  it('generateFieldsInitParams - flat object', () => {
    const fields = {
      'parent.field1': {
        disabled: true,
      },
    };
    const initalValues = {
      parent: {
        field1: 1,
      }
    };
    const result = {
      'parent.field1': {
        disabled: true,
        savedValue: 1,
      },
    };

    expect(helpers.generateFieldsInitParams(fields, initalValues)).toEqual(result);
  });

  it('generateInitialStateOfField and makeFieldState', () => {
    const funcResult = helpers.generateInitialStateOfField(testField);
    testFieldResult.props.onChange = funcResult.props.onChange;
    expect(funcResult).toEqual(testFieldResult);
  });

  it('makeFormState', () => {
    const form = {
      values: { field1: 1 },
      savedValues: { field1: 2 },
      editedValues: { field1: 1 },
      unsavedValues: {},
      dirty: true,
      touched: true,
      saving: true,
      submitting: true,
      submittable: true,
      valid: true,
      invalidMessages: { field1: 'err', },
    };

    const result = {
      values: { field1: 1 },
      savedValues: { field1: 2 },
      editedValues: { field1: 1 },
      unsavedValues: {},
      dirty: true,
      touched: true,
      saving: true,
      submitting: true,
      submittable: true,
      valid: true,
      errors: { field1: 'err', },
    };

    expect(helpers.makeFormState(form)).toEqual(result);
  });

});
