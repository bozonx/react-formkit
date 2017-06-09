import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';


export default class InputText extends React.Component {
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
      value: this.props.field.value,
    };

    this.inputProps = _.omit(this.props, [
      'field',
      'type',
      'onChange',
      'onKeyPress',
      'onFocus',
      'onBlur',
    ]);
  }

  componentWillMount() {
    this.props.field.on('anyChange', () => this.setState({
      value: this.props.field.value,
    }));
  }

  handleChange(event) {
    const value = event.target.value;
    this.props.field.handleChange(value);
    this.props.onChange && this.props.onChange(event, value);
  }

  handleKeyPress(event) {
    if (event.key == 'Enter') this.props.field.handlePressEnter();
    this.props.onKeyPress && this.props.onKeyPress(event);
  }

  handleFocus(event) {
    // rise focus on formkit's field in any way
    this.props.field.handleFocusIn();
    this.props.onFocus && this.props.onFocus(event);
  }

  handleBlur(event) {
    // rise blur on formkit's field in any way
    this.props.field.handleBlur();
    this.props.onBlur && this.props.onBlur(event);
  }

  render() {
    return <input {...this.inputProps}
                  type={this.props.type}
                  value={this.state.value}
                  onChange={(...p) => this.handleChange(...p)}
                  onKeyPress={(...p) => this.handleKeyPress(...p)}
                  onFocus={(...p) => this.handleFocus(...p)}
                  onBlur={(...p) => this.handleBlur(...p)} />;
  }
}
