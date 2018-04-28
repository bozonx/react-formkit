const React = require('react');
const _ = require('lodash');
const helpers = require('./helpers');
const formkit = require('formkit');


module.exports = function formkitConnect(config) {
  return function decorator(Target) {
    return class extends React.Component {
      static contextTypes = Target.contextTypes;

      state = {
        formState: {},
        fields: {},
        wasStateInited: false,
      };

      componentWillReceiveProps(nextProps) {
        if (_.isEqual(nextProps.initialValues, this.props.initialValues)) return;

        this._updateSavedValues(nextProps);
      }

      componentWillMount() {
        if (!config)
          throw new Error(`You have to specify at least fields definition for formkit connector's config!`);
        if (!config.fields)
          throw new Error(`You have to specify fields definition for formkit connector's config!`);
        if (config.validate && !_.isFunction(config.validate))
          throw new Error(`validate callback has to be a function!`);

        // get instance of form
        this._form = this._instantiateForm(config);
        // init form with specified fields and initial values
        this._initForm();
        // update react state on each change
        this._form.on('storage', this.handleStorageChange);
      }

      componentWillUnmount() {
        this._form.destroy();
      }

      handleStorageChange = (data) => {

        // TODO: review

        //this._updateField(data);
        this._updateFields();
        this.setState({ formState: helpers.makeFormState(this._form) });
      };

      getWrappedInstance() {
        return this.refs.instance;
      }

      _instantiateForm(connectorConfig) {
        if (connectorConfig.getForm) {
          return config.getForm(this.props, this.context);
        }

        return formkit.newForm(connectorConfig.config);
      }

      _initForm() {
        // validate wrapper needs to passing props to validate callback
        const validateWrapper = (errors, values) => config.validate(errors, values, this.props);
        const fieldsInitial = helpers.generateFieldsInitParams(config.fields, this.props.initialValues);

        this._form.init(fieldsInitial, config.validate && validateWrapper);

        // set state of form and fields
        this._initState();
      }

      _initState() {
        const formState = helpers.makeFormState(this._form);
        const fields = helpers.fillFieldsState(this._form.fields);

        this.setState({ formState, fields }, () => {
          // it needs for componentWillMount of underlying component receives form and field state in props
          this.setState({ wasStateInited: true });
        });
      }

      _updateSavedValues(props) {

        // TODO: review

        let initialValues = props.initialValues;
        if (config.mapInitialValues) {
          initialValues = config.mapInitialValues(initialValues, props);
        }

        // set initial values
        this._form.setSavedValues(initialValues);
      }

      // TODO: из за этого получается рассогласование полей если одно поле меняет другое
      _updateField(eventData) {
        if (eventData.target !== 'field') return;

        const fields = _.clone(this.state.fields);
        const currentState = _.get(fields, eventData.field);
        const field = _.get(this._form.fields, eventData.field);
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

        recursively(this._form.fields, '');

        this.setState({ fields });
      }

      _handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this._form.handleSubmit();
      };


      render() {
        if (this.state.wasStateInited) {
          return <Target ref="instance"
                         {...this.props}
                         form={this._form}
                         fields={this.state.fields}
                         values={this.state.formState.values}
                         savedValues={this.state.formState.savedValues}
                         editedValues={this.state.formState.editedValues}
                         unsavedValues={this.state.formState.unsavedValues}
                         dirty={this.state.formState.dirty}
                         touched={this.state.formState.touched}
                         saving={this.state.formState.saving}
                         submitting={this.state.formState.submitting}
                         submittable={this.state.formState.submittable}
                         valid={this.state.formState.valid}
                         errors={this.state.formState.errors}
                         handleSubmit={this._handleSubmit} />;
        }
        else {
          return <span />;
        }
      }
    }
  }

};
