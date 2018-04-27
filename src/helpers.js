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
    const schema = {};

    if (_.isArray) {
      // convert array to schema notation
      _.each(fields, (fieldName) => {
        const initialValue = _.get(initialValues, fieldName);
        // set field initial value to saved layer because it means value which was loaded from server.
        schema[fieldName] = { savedValue: initialValue };
      });
    }
    else if (_.isPlainObject()) {
      this._eachField(fields, (field, path) => {
        const initialValue = _.get(initialValues, path);
        schema[path] = {
          ...field,
          // set field initial value to saved layer because it means value which was loaded from server.
          savedValue: initialValue,
        };
      });
    }
    else {
      throw new Error(`Incorrect type of fields param`);
    }

    return schema;
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
  //
  // _generateFieldSchema(rawSchema, initialValues) {
  //   const schema = {};
  //
  //   // convert fields to notation "parent.field"
  //   this._eachField(rawSchema, (field, path) => {
  //     const initialValue = _.get(initialValues, path);
  //     schema[path] = {
  //       ...field,
  //       // set field initial value to saved layer because it means value which was loaded from server.
  //       savedValue: initialValue
  //     };
  //   });
  //
  //   return schema;
  // },

  _eachField() {
    // TODO: recusively
  },

};
