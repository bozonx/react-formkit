import helpers from '../src/helpers';


describe('helpers', () => {

  it('fillFieldsState', () => {
    const formFields = {
      parent: {
        field1: {
          value: 1
        },
      },
    };

    const result = {
      parent: {
        field1: {
          defaultValue: undefined,
          dirty: undefined,
          disabled: undefined,
          editedValue: undefined,
          error: undefined,
          focused: undefined,
          fullName: undefined,
          handleChange: undefined,
          name: undefined,
          props: {
            disabled: undefined,
            name: undefined,
            value: undefined,
            onChange: () => {},
          },
          savable: undefined,
          savedValue: undefined,
          saving: undefined,
          touched: undefined,
          valid: undefined,
          value: 1,
        },
      },
    };

    expect(helpers.fillFieldsState(formFields)).toBe(result);
  });

  it.only('generateInitialStateOfField and makeFieldState', () => {
    const field = {
      value: 1,
      savedValue: 2,
      editedValue: 1,
      name: 'field1',
      path: 'parent.field1',
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

    const result = {
      defaultValue: 0,
      dirty: true,
      disabled: false,
      editedValue: 1,
      error: 'msg',
      focused: true,
      handleChange: field.handleChange,
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

    const funcResult = helpers.generateInitialStateOfField(field);
    result.props.onChange = funcResult.props.onChange;
    expect(funcResult).toEqual(result);
  });

});
