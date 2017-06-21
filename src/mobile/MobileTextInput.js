import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';


export default class MobileTextInput extends React.Component {
  static propTypes = {
    field: PropTypes.object.isRequired,
    component: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    onKeyPress: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
  };

  static defaultProps = {
  };

  constructor(props) {
    super(props);

    this.state = {
      value: this._normalizeValue(this.props.field.value),
    };

    this.Component = this.props.component;
  }

  componentWillMount() {
    this.props.field.on('anyChange', () => this.setState({
      value: this._normalizeValue(this.props.field.value),
    }));
  }

  _getElementProps() {
    return _.omit(this.props, [
      'field',
      'component',
      'onChange',
      'onKeyPress',
      'onFocus',
      'onBlur',
    ]);
  }

  _handleChange(value) {
    this.props.field.handleChange(value);
    this.props.onChange && this.props.onChange({}, value);
  }

  // _handleKeyPress(event) {
  //   // TODO: check it
  //   console.log(5555555, 'event.key', event.key)
  //
  //   if (event.key == 'Enter') this.props.field.handlePressEnter();
  //   this.props.onKeyPress && this.props.onKeyPress(event);
  // }

  _handleFocus(event) {
    // rise focus on formkit's field in any way
    this.props.field.handleFocusIn();
    this.props.onFocus && this.props.onFocus(event);
  }

  _handleBlur(event) {
    // rise blur on formkit's field in any way
    this.props.field.handleBlur();
    this.props.onBlur && this.props.onBlur(event);
  }

  _normalizeValue(value) {
    if (_.isString(value) || _.isNumber(value)) return value;

    return '';
  }

  render() {
    const { Component } = this;

    return <Component {...this._getElementProps()}
                      //blurOnSubmit={false}
                      value={this._normalizeValue(this.props.field.value)}
                      onChangeText={(value) => this._handleChange(value)}
                      onFocus={(e) => this._handleFocus(e)}
                      onBlur={(e) => this._handleBlur(e)}
    />;
  }
}
