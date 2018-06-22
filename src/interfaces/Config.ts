import { Form } from 'formkit';


export default interface Config {
  fields: Array<string> | {[index: string]: object};
  validate?: (
    error: {[index: string]: string},
    values: {[index: string]: any},
    props: {[index: string]: any}
  ) => void;
  getForm: (props: {[index: string]: any}, context: {[index: string]: any}) => Form;
  mapInitialValues: (
    initialValues: {[index: string]: any},
    props: {[index: string]: any}
  ) => {[index: string]: any}
}
