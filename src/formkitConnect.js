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
          //form.init(config.fields);
          form.init(config.fields, config.validate);
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

        this._injectProps(form);
      }

      _injectProps(form) {
        const recursive = (container) => {
          if (_.isPlainObject(container)) {
            _.each(container, (item, name) => recursive(item));

            return;
          }

          // else means field
          container.props = {
            name: container.name,
            value: container.value,
            disabled: container.disabled,
            onChange: (event) => {
              container.handleChange(event.target.value) },
          };
        };

        recursive(form.fields);
      }

      render() {
        return <Target {...this.updatedProps}>{this.updatedProps.children}</Target>;
      }
    }
  }
}
