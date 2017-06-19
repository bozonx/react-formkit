import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';


export default class WebTextInput extends React.Component {
  static propTypes = {
    field: PropTypes.object.isRequired,
    type: PropTypes.string,
    onChange: PropTypes.func,
    onKeyPress: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
  };

  static defaultProps = {
    type: 'text',
  };

  constructor(props) {
    super(props);

    this.state = {
      value: this._normalizeValue(this.props.field.value),
    };
  }

  componentWillMount() {
    this.props.field.on('anyChange', () => this.setState({
      value: this._normalizeValue(this.props.field.value),
    }));
  }

  _getElementProps() {
    return _.omit(this.props, [
      'field',
      'type',
      'onChange',
      'onKeyPress',
      'onFocus',
      'onBlur',
    ]);
  }

  _handleChange(event) {
    const value = event.target.value;
    this.props.field.handleChange(value);
    this.props.onChange && this.props.onChange(event, value);
  }

  _handleKeyPress(event) {
    if (event.key == 'Enter') this.props.field.handlePressEnter();
    this.props.onKeyPress && this.props.onKeyPress(event);
  }

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
    return <input {...this._getElementProps()}
                  type={this.props.type}
                  value={this.state.value}
                  onChange={(e) => this._handleChange(e)}
                  onKeyPress={(e) => this._handleKeyPress(e)}
                  onFocus={(e) => this._handleFocus(e)}
                  onBlur={(e) => this._handleBlur(e)} />;
  }
}
