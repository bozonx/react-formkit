import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';


export default class Form extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func,
  };

  constructor(params) {
    super(params);

    this.state = {
    }
  }

  componentWillMount() {
  }

  render() {
    return <div>1111</div>;
  }
}
