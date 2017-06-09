import React from 'react';
import PropTypes from 'prop-types';
//import _ from 'lodash';


export default class WebForm extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    onSubmit: PropTypes.func,
    form: PropTypes.object.isRequired,
  };

  constructor(params) {
    super(params);
  }

  componentWillMount() {
    this.props.onSubmit && this.form.onSubmit((...p) => this.props.onSubmit(...p));
  }

  _handleSubmit(event) {
    event.preventDefault();
    this.props.form.handleSubmit();
  }

  render() {
    // TODO: обработать все остальные параметры
    return <form onSubmit={(event) => this._handleSubmit(event)}>{this.props.children}</form>;
  }
}
