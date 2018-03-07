import React from 'react';
import _ from 'lodash';


export default function formkitConnect(config) {
  return function decorator(Target) {
    return class extends React.Component {
      static contextTypes = Target.contextTypes;

      constructor(props) {
        super(props);

        this.state = {
          formState: {},
          fields: {},
        };
      }

      componentWillMount() {
        if (!config || !config.getForm) return;

        //const form = config.getForm(this.props, this._reactInternalInstance._context);
        this.form = config.getForm(this.props, this.context);

        // init form
        if (config.fields) {
          //form.init(config.fields);
          this.form.init(config.fields, config.validate);
        }

        // set initial state
        this.setState({ formState: this._getFormState() });
        this._initFields();

        // update react state on each change
        this.form.on('anyChange', (aa,dd,ff) => {
          console.log(111111, aa,dd,ff)

          this.setState({
            formState: this._getFormState(),
          }, () => {
            // TODO: обновлять только то что изменилось
            this._initFields();
          });
        });

        //this._injectProps(this.form);
      }

      _getFormState() {
        return {
          dirty: this.form.dirty,
          touched: this.form.touched,
          saving: this.form.saving,
          submitting: this.form.submitting,
          submitable: this.form.submitable,
          valid: this.form.valid,
          invalidMessages: this.form.invalidMessages,
        };
      }

      _initFields() {
        const fields = _.cloneDeep(this.state.fields);

        const recursively = (container, path) => {
          if (_.isPlainObject(container)) {
            // go deeper
            _.each(container, (field, name) => {
              const curPath = _.trimStart(`${path}.${name}`, '.');
              recursively(field, curPath);
            });

            return;
          }

          const field = container;
          _.set(fields, path, {
            value: field.value,
            name: field.name,
            path: field.path,
            disabled: field.disabled,
            dirty: field.dirty,
            touched: field.touched,
            valid: field.valid,
            invalidMsg: field.invalidMsg,
            saving: field.saving,
            focused: field.focused,
            defaultValue: field.defaultValue,
            props: {
              name: field.name,
              value: field.value,
              disabled: field.disabled,
              onChange: (event) => {
                field.handleChange(event.target.value);
              },
            }
          });

        };

        recursively(this.form.fields, '');

        this.setState({ fields });
      }

      // _injectProps(form) {
      //   const recursive = (container) => {
      //     if (_.isPlainObject(container)) {
      //       _.each(container, (item, name) => recursive(item));
      //
      //       return;
      //     }
      //
      //     // else means field
      //     container.props = {
      //       name: container.name,
      //       value: container.value,
      //       disabled: container.disabled,
      //       onChange: (event) => {
      //         container.handleChange(event.target.value) },
      //     };
      //   };
      //
      //   recursive(form.fields);
      // }

      render() {
        return <Target {...this.props}
                       form={this.form}
                       fields={this.state.fields}
                       dirty={this.state.formState.dirty}
                       touched={this.state.formState.touched}
                       saving={this.state.formState.saving}
                       submitting={this.state.formState.submitting}
                       submitable={this.state.formState.submitable}
                       valid={this.state.formState.valid}
                       invalidMessages={this.state.formState.invalidMessages} />;
      }
    }
  }
}
