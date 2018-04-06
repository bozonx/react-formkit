import _ from 'lodash';


export default {

  generateFieldsInitParams(fields, initialValues) {
    const result = {};

    if (_.isArray) {
      _.each(fields, (fieldName) => {
        const initial = _.get(initialValues, fieldName);
        result[fieldName] = { initial };
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
        field.handleChange(param.target.value);
      }
      else {
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
