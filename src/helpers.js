const _ = require('lodash');


module.exports = {

  fillFieldsState(formFields) {
    const fields = {};

    const recursively = (container, path) => {
      if (_.isPlainObject(container)) {
        // go deeper
        _.each(container, (field, name) => {
          const curPath = _.trimStart(`${path}.${name}`, '.');
          recursively(field, curPath);
        });

        return;
      }

      _.set(fields, path, this.generateInitialStateOfField(container));
    };

    recursively(formFields, '');

    return fields;
  },

  generateFieldsInitParams(fields, initialValues) {
    const result = {};

    if (_.isArray) {
      _.each(fields, (fieldName) => {
        const initial = _.get(initialValues, fieldName);
        // set field initial value to saved layer because it means value which was loaded from server.
        result[fieldName] = { savedValue: initial };
      });
    }
    else if (_.isPlainObject()) {

      // TODO: !!!! support it

    }
    else {
      throw new Error(`Incorrect type of fields param`);
    }

    return result;
  },

  generateInitialStateOfField(field) {
    const onChange = (param) => {
      if (_.isObject(param) && param.target) {
        // params means event
        field.handleChange(param.target.value);
      }
      else {
        // means just value
        field.handleChange(param);
      }
    };

    const fieldState = this.makeFieldState(field);
    fieldState.handleChange = field.handleChange;
    fieldState.props.onChange = onChange;

    return fieldState;
  },

  makeFormState(form) {
    return {
      values: form.values,
      savedValues: form.savedValues,
      editedValues: form.editedValues,
      unsavedValues: form.unsavedValues,
      dirty: form.dirty,
      touched: form.touched,
      saving: form.saving,
      submitting: form.submitting,
      submittable: form.submittable,
      valid: form.valid,
      invalidMessages: form.invalidMessages,
    };
  },

  makeFieldState(field) {
    return {
      value: field.value,
      savedValue: field.savedValue,
      editedValue: field.editedValue,
      name: field.name,
      fullName: field.path,
      disabled: field.disabled,
      dirty: field.dirty,
      touched: field.touched,
      valid: field.valid,
      // rename invalidMsg to error for more convenience
      error: field.invalidMsg,
      saving: field.saving,
      savable: field.savable,
      focused: field.focused,
      defaultValue: field.defaultValue,
      props: {
        name: field.name,
        value: field.value,
        disabled: field.disabled,
      }
    }
  },

};
