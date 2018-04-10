const React = require('react');
const _ = require('lodash');
const helpers = require('./helpers');


module.exports = function formkitConnect(config) {
  return function decorator(Target) {
    return class extends React.Component {
      static contextTypes = Target.contextTypes;

      state = {
        formState: {},
        fields: {},
        wasStateInited: false,
      };

      getWrappedInstance() {
        return this.refs.instance;
      }

      componentWillReceiveProps(nextProps) {
        if (_.isEqual(nextProps.initialValues, this.props.initialValues)) return;

        this._updateSavedValues(nextProps);
      }

      componentWillMount() {
        if (!config) return;

        this.form = this._instantiateForm();

        // init form
        if (config.fields) {
          const realValidate = (errors, values) => {
            config.validate(errors, values, this.props);
          };
          const fieldsInitial = helpers.generateFieldsInitParams(config.fields, this.props.initialValues);
          this.form.init(fieldsInitial, config.validate && realValidate);
        }

        // set initial state
        Promise.all([
          new Promise((resolve) => this.setState({ formState:  helpers.makeFormState(this.form) }, resolve)),
          this._initFields(),
        ])
          // it needs for componentWillMount of underlying component receives form and field state in props
          .then(() => this.setState({ wasStateInited: true }));

        // update react state on each change
        this.form.on('storage', (data) => {
          //this._updateField(data);
          this._updateFields();
          this.setState({ formState: helpers.makeFormState(this.form) });
        });
      }

      componentWillUnmount() {
        this.form.destroy();
      }

      _updateSavedValues(props) {
        let initialValues = props.initialValues;
        if (config.mapInitialValues) {
          initialValues = config.mapInitialValues(initialValues, props);
        }

        // set initial values
        this.form.setSavedValues(initialValues);
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

          _.set(fields, path, helpers.generateInitialStateOfField(container));
        };

        recursively(this.form.fields, '');

        return new Promise((resolve) => {
          this.setState({ fields }, resolve);
        });
      }

      // TODO: из за этого получается рассогласование полей если одно поле меняет другое
      _updateField(eventData) {
        if (eventData.target !== 'field') return;

        const fields = _.clone(this.state.fields);
        const currentState = _.get(fields, eventData.field);
        const field = _.get(this.form.fields, eventData.field);
        const updatedField = _.defaultsDeep(helpers.makeFieldState(field), currentState);

        _.set(fields, eventData.field, updatedField);

        this.setState({ fields });
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
          _.set(fields, path, _.defaultsDeep(helpers.makeFieldState(container), currentState));
        };

        recursively(this.form.fields, '');

        this.setState({ fields });
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
        if (this.state.wasStateInited) {
          return <Target ref="instance"
                         {...this.props}
                         form={this.form}
                         fields={this.state.fields}
                         values={this.state.formState.values}
                         savedValues={this.state.formState.savedValues}
                         editedValues={this.state.formState.editedValues}
                         dirty={this.state.formState.dirty}
                         touched={this.state.formState.touched}
                         saving={this.state.formState.saving}
                         submitting={this.state.formState.submitting}
                         submittable={this.state.formState.submittable}
                         valid={this.state.formState.valid}
                         invalidMessages={this.state.formState.invalidMessages}
                         handleSubmit={this._handleSubmit} />;
        }
        else {
          return <span />;
        }
      }
    }
  }

};
