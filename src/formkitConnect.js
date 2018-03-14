import React from 'react';
import _ from 'lodash';


export default function formkitConnect(config) {
  return function decorator(Target) {
    return class extends React.Component {
      static contextTypes = Target.contextTypes;


      state = {
        formState: {},
        fields: {},
      };

      // TODO: слушать обновления initalState

      componentWillMount() {
        if (!config) return;

        this.form = this._instantiateForm();

        // init form
        if (config.fields) {
          //form.init(config.fields);
          this.form.init(config.fields, config.validate);
        }

        // set initial state
        this.setState({ formState: this._getFormState() });
        this._initFields()
          .then(() => {
            // set initial values
            this.form.setSavedValues(this.props.initialValues);
          });

        // update react state on each change
        this.form.on('anyChange', (aa,dd,ff) => {
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

          _.set(fields, path, this._getFieldState(container));
        };

        recursively(this.form.fields, '');

        return new Promise((resolve) => {
          this.setState({ fields }, resolve);
        });
      }

      _getFieldState(field) {
        const onChange = (event) => {
          if (_.isString(event)) {
            field.handleChange(event);
          }
          else {
            field.handleChange(event.target.value);
          }
        };

        return {
          value: field.value,
          name: field.name,
          path: field.path,
          disabled: field.disabled,
          dirty: field.dirty,
          touched: field.touched,
          valid: field.valid,
          error: field.invalidMsg,
          saving: field.saving,
          focused: field.focused,
          defaultValue: field.defaultValue,
          onChange,
          props: {
            name: field.name,
            //defaultValue: field.value,
            value: field.value,
            disabled: field.disabled,
            onChange,
          }
        }
      }

      _instantiateForm() {
        if (config.getForm) {
          //const form = config.getForm(this.props, this._reactInternalInstance._context);
          return config.getForm(this.props, this.context);
        }
        else if (_.isPlainObject(config.config)) {
          // TODO: use your own formkit
        }
        else {
          throw new Error(`You have to specify a form config or "getForm" callback`);
        }
      }

      _handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.form.handleSubmit();
      };


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
                       invalidMessages={this.state.formState.invalidMessages}
                       handleSubmit={this._handleSubmit} />;
      }
    }
  }

}
