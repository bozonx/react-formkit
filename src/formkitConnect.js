import React from 'react';
import _ from 'lodash';


export default function formkitConnect(config) {
  return function decorator(Target) {
    return class extends React.Component {
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
          ..._.omit(this.props, 'children'),
          form,
        };
      }

      render() {
        return <Target {...this.updatedProps}>{this.updatedProps.children}</Target>;
      }
    }
  }
}
