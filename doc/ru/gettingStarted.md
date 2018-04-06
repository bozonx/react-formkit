# Быстрый старт

    import React from 'react';
    import formkit from 'formkit';
    import formkitConnect from 'react-formkit';
    
    const fields = [
      'first_name',
      'last_name'
    ];
    
    const validate = (errors, values) => {
      if (!first_name) errors.first_name = 'Required';
      if (!last_name) errors.last_name = 'Required';
    };
    
    @(formkitConnect({
      getForm: () => formkit.newForm(),
      fields,
      validate,
    }))
    export default class DriverForm extends React.Component {
    }