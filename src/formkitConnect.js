import { Component, createElement } from 'react';


export default function formkitConnect(config) {
  return function decorator(Target) {
    return class extends Component {
      constructor(props) {
        super(props);

        this.state = {
          formStorage: {},
        };
      }

      componentWillMount() {
        if (!config || !config.getForm) return;

        const form = config.getForm(this.props, this._reactInternalInstance._context);

        this.setState({
          formStorage: form.$getWholeStorageState(),
        });
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
