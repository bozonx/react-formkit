import * as React from 'react';
import { newForm, Form, Field } from 'formkit';
const isEqual = require('lodash/isEqual');
const clone = require('lodash/clone');
const get = require('lodash/get');
const set = require('lodash/set');
const each = require('lodash/each');
const isPlainObject = require('lodash/isPlainObject');
const trimStart = require('lodash/trimStart');
const defaultsDeep = require('lodash/defaultsDeep');

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
export default function FormkitConnect(config: Config): (Target: any) => any {
  // TODO: задать тип для Target
  //React.ReactNode

  return function decorator(Target): new(...args:any[]) => void {
    const config = Target.formConfig;

    class Wrapper extends React.PureComponent<Props, State> {
      private _form?: Form;

      get form(): Form {
        return this._form as Form;
      }

      // TODO: doesn't need
      static contextTypes = Target.contextTypes;

      state = {
        formState: {} as FormState,
        fieldsState: {},
        wasStateInited: false,
      };

      componentWillReceiveProps(nextProps: Props): void {

        // TODO: review

        if (isEqual(nextProps.initialValues, this.props.initialValues)) return;

        this.updateSavedValues(nextProps);
      }

      componentWillMount(): void {
        if (!config)
          throw new Error(`You have to specify at least fields definition for formkit connector's config!`);
        if (!config.fields)
          throw new Error(`You have to specify fields definition for formkit connector's config!`);
        if (config.validate && typeof config.validate !== 'function')
          throw new Error(`validate callback has to be a function!`);

        // get instance of form
        this._form = this.instantiateForm(config);
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

        return newForm(connectorConfig.config);
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

        // TODO: нужно знать какое поле изменилось и изменить только его
        // TODO: remake

        const fieldsState = clone(this.state.fieldsState);

        const recursively = (container, path: string) => {
          if (isPlainObject(container)) {
            // go deeper
            each(container, (field, name) => {
              const curPath = trimStart(`${path}.${name}`, '.');
              recursively(field, curPath);
            });

            return;
          }

          const currentState = get(fieldsState, path);

          if (typeof currentState === 'undefined') {
            // make a new field
            set(fieldsState, path, generateInitialStateOfField(container));
          }
          else {
            // update existed
            // TODO: remake - решить что делать с onChange - он не должен постоянно создаваться новый
            set(fieldsState, path, defaultsDeep(makeFieldState(container), currentState));
          }

        };

        recursively(this.form.fields, '');

        this.setState({ fieldsState });
      }

      /**
       * Place this to onSubmit prop of <form>
       */
      private handleSubmit = (event?: Event): Promise<void> => {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }

        return this.form.handleSubmit();
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
