const get = require('lodash/get');
const set = require('lodash/set');
const each = require('lodash/each');
const isPlainObject = require('lodash/isPlainObject');
const trimStart = require('lodash/trimStart');
const intersection = require('lodash/intersection');
const isEmpty = require('lodash/isEmpty');

import FieldState from './interfaces/FieldState';


export function fillFieldsState(formFields) {
  const fields = {};

  _eachField(formFields, (field, path) => {
    set(fields, path, generateInitialStateOfField(field));
  });

  return fields;
}

export function generateFieldsInitParams(fields, initialValues) {
  const schema = {};

  if (Array.isArray(fields)) {
    // TODO: use for of
    // convert array to schema notation
    each(fields, (fieldName: string) => {
      const initialValue = get(initialValues, fieldName);
      // set field initial value to saved layer because it means value which was loaded from server.
      schema[fieldName] = { savedValue: initialValue };
    });
  }
  else if (isPlainObject(fields)) {
    _eachField(fields, (field, path) => {
      const initialValue = get(initialValues, path);
      schema[path] = field;
      if (typeof initialValue !== 'undefined') {
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

export function generateInitialStateOfField(field): FieldState {
  const onChange = (param: any) => {
    console.log(44444, param, param.target, param.target.value);

    if (typeof param === 'object' && param.target) {
      if (!param.target) {
        throw new Error(`Event doesn't have a target`);
      }

      // params means event
      field.handleChange(param.target.value);
    }
    else {
      // means just value
      field.handleChange(param);
    }
  };

  return makeFieldState(field, onChange);
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

export function makeFieldState(field, onChange?): FieldState {
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
    // TODO: null не правильно использовать. Но если его не использовать то не будут перерисовываться ошибки
    error: field.invalidMsg || null,
    saving: field.saving,
    savable: field.savable,
    focused: field.focused,
    defaultValue: field.defaultValue,
    handleChange: field.handleChange,
    props: {
      name: field.fullName,
      value: field.value,
      disabled: field.disabled,
      onChange: onChange,
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
    each(container, (field, name) => {
      const curPath = trimStart(`${path}.${name}`, '.');
      recursively(field, curPath);
    });
  };

  recursively(fields, '');
}

function _isField(container) {
  if (typeof container === 'object') {
    if (container.constructor.name === 'Field') return true;
  }

  if (!isPlainObject(container)) return false;

  const lookingParams = [
    'name',
    'initial',
    'disabled',
    'defaultValue',
    'savedValue',
  ];

  const interSection = intersection(Object.keys(container), lookingParams);

  return !isEmpty(interSection);
}
