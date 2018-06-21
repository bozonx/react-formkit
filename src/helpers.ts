import * as _ from 'lodash';

import FieldState from './FieldState';


export function fillFieldsState(formFields) {
  const fields = {};

  _eachField(formFields, (field, path) => {
    _.set(fields, path, generateInitialStateOfField(field));
  });

  return fields;
}

export function generateFieldsInitParams(fields, initialValues) {
  const schema = {};

  if (_.isArray(fields)) {
    // convert array to schema notation
    _.each(fields, (fieldName: string) => {
      const initialValue = _.get(initialValues, fieldName);
      // set field initial value to saved layer because it means value which was loaded from server.
      schema[fieldName] = { savedValue: initialValue };
    });
  }
  else if (_.isPlainObject(fields)) {
    _eachField(fields, (field, path) => {
      const initialValue = _.get(initialValues, path);
      schema[path] = field;
      if (!_.isUndefined(initialValue)) {
        // set field initial value to saved layer because it means value which was loaded from server.
        schema[path].savedValue = initialValue;
      }
    });
  }
  else {
    throw new Error(`Incorrect type of fields param`);
  }

  return schema;
}

export function generateInitialStateOfField(field) {
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

  const fieldState: FieldState = makeFieldState(field);
  fieldState.handleChange = field.handleChange;
  fieldState.props.onChange = onChange;

  return fieldState;
}

export function makeFormState(form) {
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
    errors: form.invalidMessages,
  };
}

export function makeFieldState(field): FieldState {
  return {
    value: field.value,
    savedValue: field.savedValue,
    editedValue: field.editedValue,
    // use full name as name like - 'parent.child'
    name: field.fullName,
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
    handleChange: (value: any) => {},
    props: {
      name: field.fullName,
      value: field.value,
      disabled: field.disabled,
      onChange: (event: Event) => {},
    }
  }
}
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

function _eachField(fields, cb) {
  const recursively = (container, path) => {
    // if it isn't field - it means container

    if (_isField(container)) {
      cb(container, path);

      return;
    }

    // go deeper
    _.each(container, (field, name) => {
      const curPath = _.trimStart(`${path}.${name}`, '.');
      recursively(field, curPath);
    });
  };

  recursively(fields, '');
}

function _isField(container) {
  if (_.isObject(container)) {
    if (container.constructor.name === 'Field') return true;
  }

  if (!_.isPlainObject(container)) return false;

  const lookingParams = [
    'name',
    'initial',
    'disabled',
    'defaultValue',
    'savedValue',
  ];

  const interSection = _.intersection(_.keys(container), lookingParams);

  return !_.isEmpty(interSection);
}
