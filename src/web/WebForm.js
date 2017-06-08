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

    this.state = {
      formStorage: {},
    };

    this.props.form.on('anyChange', () => {
      this.setState({ formStorage: this.props.form.$getWholeStorageState() });
    });
  }

  componentWillMount() {
  }

  _handleSubmit(event) {
    event.preventDefault();
    if (this.props.onSubmit) {
      this.props.onSubmit(event);
    }
    else {
      this.props.form.handleSubmit();
    }
  }

  render() {
    // TODO: обработать все остальные параметры
    return <form onSubmit={(event) => this._handleSubmit(event)}>{this.props.children}</form>;
  }
}
