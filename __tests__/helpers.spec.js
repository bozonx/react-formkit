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

});
