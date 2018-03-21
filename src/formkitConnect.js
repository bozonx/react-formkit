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


      componentWillUpdate(nextProps) {
        if (_.isEqual(nextProps.initialValues, this.props.initialValues)) return;

        this._processInitialValues(nextProps);
      }

      componentWillMount() {
        if (!config) return;

        this.form = this._instantiateForm();

        // init form
        if (config.fields) {
          const realValidate = (errors, values) => {
            config.validate(errors, values, this.props);
          };
          this.form.init(config.fields, config.validate && realValidate);
        }

        // set initial state
        this.setState({ formState: this._getFormState() });
        this._initFields()
          .then(() => this._processInitialValues(this.props));

        // update react state on each change
        this.form.on('anyChange', (data) => {
          // TODO: обновлять только то что изменилось - see data.field
          this._updateFields();
          this.setState({ formState: this._getFormState() });
        });
      }

      _processInitialValues(props) {
        let initialValues = props.initialValues;
        if (config.mapInitialValues) {
          initialValues = config.mapInitialValues(initialValues, props);
        }

        // set initial values
        this.form.setSavedValues(initialValues);
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
        const fields = {};

        const recursively = (container, path) => {
          if (_.isPlainObject(container)) {
            // go deeper
            _.each(container, (field, name) => {
              const curPath = _.trimStart(`${path}.${name}`, '.');
              recursively(field, curPath);
            });

            return;
          }

          _.set(fields, path, this._getInitialFieldState(container));
        };

        recursively(this.form.fields, '');

        return new Promise((resolve) => {
          this.setState({ fields }, resolve);
        });
      }

      _updateFields() {
        const fields = _.clone(this.state.fields);

        const recursively = (container, path) => {
          if (_.isPlainObject(container)) {
            // go deeper
            _.each(container, (field, name) => {
              const curPath = _.trimStart(`${path}.${name}`, '.');
              recursively(field, curPath);
            });

            return;
          }

          const currentState = _.get(fields, path);
          _.set(fields, path, _.defaultsDeep(this._getFieldState(container), currentState));
        };

        recursively(this.form.fields, '');

        this.setState({ fields });
      }

      _getInitialFieldState(field) {
        const onChange = (param) => {
          if (_.isObject(param) && param.target) {
            field.handleChange(param.target.value);
          }
          else {
            field.handleChange(param);
          }
        };

        const fieldState = this._getFieldState(field);
        fieldState.handleChange = field.handleChange;
        fieldState.props.onChange = onChange;

        return fieldState;
      }

      _getFieldState(field) {
        return {
          value: field.value,
          name: field.name,
          path: field.path,
          disabled: field.disabled,
          dirty: field.dirty,
          touched: field.touched,
          valid: field.valid,
          // TODO: do it in formkit inside
          error: (field.valid) ? null : field.invalidMsg,
          saving: field.saving,
          focused: field.focused,
          defaultValue: field.defaultValue,
          props: {
            name: field.name,
            value: field.value,
            disabled: field.disabled,
          }
        }
      }

      _instantiateForm() {
        if (config.getForm) {
          //const form = config.getForm(this.props, this._reactInternalInstance._context);
          return config.getForm(this.props, this.context);
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
