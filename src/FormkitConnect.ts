import * as React from 'react';
import * as _ from 'lodash';
import formkit from 'formkit';

import {
  fillFieldsState,
  generateFieldsInitParams,
  generateInitialStateOfField,
  makeFormState,
  makeFieldState,
} from './helpers';
import FormState from './FormState';


interface Props {
  initialValues?: object,
}

interface State {
  formState: FormState;
  fields: object;
  wasStateInited: boolean;
}


export default function FormkitConnect(config): React.ReactNode {
  return function decorator(Target): React.ReactNode {
    class Wrapper extends React.PureComponent<Props, State> {
      // TODO: use form class from formkit
      private form: any;

      static contextTypes = Target.contextTypes;

      state = {
        formState: {} as FormState,
        fields: {},
        wasStateInited: false,
      };

      componentWillReceiveProps(nextProps: Props) {
        if (_.isEqual(nextProps.initialValues, this.props.initialValues)) return;

        this.updateSavedValues(nextProps);
      }

      componentWillMount() {
        if (!config)
          throw new Error(`You have to specify at least fields definition for formkit connector's config!`);
        if (!config.fields)
          throw new Error(`You have to specify fields definition for formkit connector's config!`);
        if (config.validate && !_.isFunction(config.validate))
          throw new Error(`validate callback has to be a function!`);

        // get instance of form
        this.form = this.instantiateForm(config);
        // init form with specified fields and initial values
        this.initForm();
        // update react state on each change
        this.form.on('storage', this.handleStorageChange);
      }

      componentWillUnmount() {
        this.form.destroy();
      }

      handleStorageChange = (data) => {

        // TODO: review

        //this.updateField(data);
        this.updateFields();
        this.setState({ formState: makeFormState(this.form) });
      };

      getWrappedInstance(): React.ReactNode {
        return this.refs.instance;
      }


      private instantiateForm(connectorConfig) {
        if (connectorConfig.getForm) {
          return config.getForm(this.props, this.context);
        }

        return formkit.newForm(connectorConfig.config);
      }

      private initForm() {
        // validate wrapper needs to passing props to validate callback
        const validateWrapper = (errors, values) => config.validate(errors, values, this.props);
        const fieldsInitial = generateFieldsInitParams(config.fields, this.props.initialValues);

        this.form.init(fieldsInitial, config.validate && validateWrapper);

        // set state of form and fields
        this.initState();
      }

      private initState() {
        const formState = makeFormState(this.form);
        const fields = fillFieldsState(this.form.fields);

        this.setState({ formState, fields }, () => {
          // it needs for componentWillMount of underlying component receives form and field state in props
          this.setState({ wasStateInited: true });
        });
      }

      private updateSavedValues(props) {

        // TODO: review

        let initialValues = props.initialValues;
        if (config.mapInitialValues) {
          initialValues = config.mapInitialValues(initialValues, props);
        }

        // set initial values
        this.form.setSavedValues(initialValues);
      }

      // // TODO: из за этого получается рассогласование полей если одно поле меняет другое
      // private updateField(eventData) {
      //   if (eventData.target !== 'field') return;
      //
      //   const fields = _.clone(this.state.fields);
      //   const currentState = _.get(fields, eventData.field);
      //   const field = _.get(this.form.fields, eventData.field);
      //   const updatedField = _.defaultsDeep(makeFieldState(field), currentState);
      //
      //   _.set(fields, eventData.field, updatedField);
      //
      //   this.setState({ fields });
      // }

      private updateFields() {
        const fields = _.clone(this.state.fields);

        const recursively = (container, path: string) => {
          if (_.isPlainObject(container)) {
            // go deeper
            _.each(container, (field, name) => {
              const curPath = _.trimStart(`${path}.${name}`, '.');
              recursively(field, curPath);
            });

            return;
          }

          const currentState = _.get(fields, path);

          if (_.isUndefined(currentState)) {
            _.set(fields, path, generateInitialStateOfField(container));
          }
          else {
            _.set(fields, path, _.defaultsDeep(makeFieldState(container), currentState));
          }

        };

        recursively(this.form.fields, '');

        this.setState({ fields });
      }

      private handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.form.handleSubmit();
      };


      render() {
        if (this.state.wasStateInited) {

          return React.createElement(Target, {
            // TODO: use create ref
            ref: 'instance',
            ...this.props,
            form: this.form,
            fields: this.state.fields,
            values: this.state.formState.values,
            savedValues: this.state.formState.savedValues,
            editedValues: this.state.formState.editedValues,
            unsavedValues: this.state.formState.unsavedValues,
            dirty: this.state.formState.dirty,
            touched: this.state.formState.touched,
            saving: this.state.formState.saving,
            submitting: this.state.formState.submitting,
            submittable: this.state.formState.submittable,
            valid: this.state.formState.valid,
            errors: this.state.formState.errors,
            handleSubmit: this.handleSubmit,
          });
        }
        else {
          return React.createElement('span');
        }
      }
    }

    return Wrapper;
  }

};
