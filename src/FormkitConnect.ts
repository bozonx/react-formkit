import * as React from 'react';
import * as _ from 'lodash';
import formkit, { Form, Field } from 'formkit';

import {
  fillFieldsState,
  generateFieldsInitParams,
  generateInitialStateOfField,
  makeFormState,
  makeFieldState,
} from './helpers';
import FormState from './interfaces/FormState';
import Config from './interfaces/Config';
import {ClassType} from 'react';


type Values = {[index: string]: any};

interface Props {
  initialValues?: Values,
}

interface State {
  formState: FormState;
  fieldsState: {[index: string]: Field};
  wasStateInited: boolean;
}


//export default function FormkitConnect<T extends {new(...args:any[]):{}}>(constructor: T) {
export default function FormkitConnect(config): React.ReactNode {
  console.log(111111)
  // TODO: задать тип для Target

  return function decorator(Target) {
    const config = Target.formConfig;
    console.log(2222222)

    class Wrapper extends React.PureComponent<Props, State> {
      private form: Form;

      // TODO: doesn't need
      static contextTypes = Target.contextTypes;

      state = {
        formState: {} as FormState,
        fieldsState: {},
        wasStateInited: false,
      };

      componentWillReceiveProps(nextProps: Props): void {

        // TODO: review

        if (_.isEqual(nextProps.initialValues, this.props.initialValues)) return;

        this.updateSavedValues(nextProps);
      }

      componentWillMount(): void {
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

      componentWillUnmount(): void {
        this.form.destroy();
      }

      handleStorageChange = (data): void => {

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
        const validateWrapper = (errors, values) => {
          return config.validate && config.validate(errors, values, this.props);
        };
        const fieldsInitial = generateFieldsInitParams(config.fields, this.props.initialValues);

        this.form.init(fieldsInitial, config.validate && validateWrapper);

        // set state of form and fields
        this.initState();
      }

      private initState(): void {
        const formState = makeFormState(this.form);
        const fieldsState = fillFieldsState(this.form.fields);

        this.setState({ formState, fieldsState }, () => {
          // it needs for componentWillMount of underlying component receives form and field state in props
          this.setState({ wasStateInited: true });
        });
      }

      private updateSavedValues(props: Props): void {
        let initialValues: Values = props.initialValues || {};

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

        // TODO: remake

        const fieldsState = _.clone(this.state.fieldsState);

        const recursively = (container, path: string) => {
          if (_.isPlainObject(container)) {
            // go deeper
            _.each(container, (field, name) => {
              const curPath = _.trimStart(`${path}.${name}`, '.');
              recursively(field, curPath);
            });

            return;
          }

          const currentState = _.get(fieldsState, path);

          if (_.isUndefined(currentState)) {
            _.set(fieldsState, path, generateInitialStateOfField(container));
          }
          else {
            _.set(fieldsState, path, _.defaultsDeep(makeFieldState(container), currentState));
          }

        };

        recursively(this.form.fields, '');

        this.setState({ fieldsState });
      }

      /**
       * Place this to onSubmit prop of <form>
       */
      private handleSubmit = (event: Event): void => {
        event.preventDefault();
        event.stopPropagation();
        this.form.handleSubmit();
      };


      render(): React.ReactNode {
        if (this.state.wasStateInited) {

          return React.createElement(Target, {
            // TODO: use create ref
            ref: 'instance',
            form: this.form,
            fields: this.state.fieldsState,
            handleSubmit: this.handleSubmit,
            ...this.state.formState,
            ...this.props,
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
