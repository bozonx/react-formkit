import { Component, createElement } from 'react';
import PropTypes from 'prop-types';


export default function formkitConnect(config) {
  return function decorator(Target) {
    return class extends Component {
      static contextTypes = Target.contextTypes;

      constructor(props) {
        super(props);

        this.state = {
          formStorage: {},
        };
      }

      componentWillMount() {
        if (!config || !config.getForm) return;

        //const form = config.getForm(this.props, this._reactInternalInstance._context);
        const form = config.getForm(this.props, this.context);

        // init form
        if (config.fields) {
          form.init(config.fields);
        }

        // set initial state
        this.setState({
          formStorage: form.$getWholeStorageState(),
        });
        // update react state on each change
        form.on('anyChange', () => {
          this.setState({
            formStorage: form.$getWholeStorageState(),
          });
        });

        this.updatedProps = {
          ...this.props,
          form,
        };
      }

      render() {
        return createElement(Target, this.updatedProps, this.updatedProps.children);
      }
    }
  }
}
