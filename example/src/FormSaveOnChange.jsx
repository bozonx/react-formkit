import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import formkit from 'formkit';
import formkitConnect from 'react-formkit';


const fields = [
  'first_name',
  'last_name'
];

const validate = (errors, values) => {
  if (!first_name) errors.first_name = 'Required';
  if (!last_name) errors.last_name = 'Required';
};


@(formkitConnect({
  getForm: () => formkit.newForm(),
  fields,
  validate,
}))
export default class DriverForm extends React.Component {
  static propTypes = {

  };

  componentWillMount() {
    this.props.form.onSubmit(({ values }) => this.props.onSubmit(values));
  }

  render() {

  }

}
