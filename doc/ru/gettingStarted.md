# Быстрый старт

Типовая форма выглядит таким образом:

    import React from 'react';
    import PropTypes from 'prop-types';
    import formkit from 'formkit';
    import formkitConnect from 'react-formkit';
    
    const fields = [
      'first_name',
      'last_name'
    ];
    
    const validate = (errors, values) => {
      if (!values.first_name) errors.first_name = 'Required';
      if (!values.last_name) errors.last_name = 'Required';
    };
    
    @(formkitConnect({
      getForm: () => formkit.newForm(),
      fields,
      validate,
    }))
    export default class DriverForm extends React.Component {
      static propTypes = {
        onSubmit: PropTypes.func,
      };
      
      componentWillMount() {
        // connecting form's submit with onSubmit prop
        this.props.form.onSubmit(({ values }) => this.props.onSubmit(values));
      }
      
      render() {
        
      }
    }
    
Для для удобства в этом примере используются декторатор `@(formkitConnect({ ... }))`.
Синтаксис декораторов можно добавить в свой проект с помощью babel плагина
`babel-plugin-transform-decorators-legacy`.
Но так же можно обойтись и без декоратора:

    module export formkitConnect({
      getForm: () => formkit.newForm(),
      fields,
      validate,
    })(MyClassDefenition)
