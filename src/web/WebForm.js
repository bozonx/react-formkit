import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';


export default class WebForm extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    onSubmit: PropTypes.func,
    form: PropTypes.object.isRequired,
  };

  constructor(params) {
    super(params);

    this.inputProps = _.omit(this.props, [
      'children',
      'onSubmit',
      'form',
    ]);
  }

  componentWillMount() {
    this.props.onSubmit && this.props.form.onSubmit((...p) => this.props.onSubmit(...p));
  }

  _handleSubmit(event) {
    event.preventDefault();
    this.props.form.handleSubmit();
  }

  render() {
    return <form {...this.inputProps}
                 onSubmit={(event) => this._handleSubmit(event)}>{this.props.children}</form>;
  }
}
