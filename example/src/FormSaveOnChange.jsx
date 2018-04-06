import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import formkit from 'formkit';
import formkitConnect from 'react-formkit';


// name of fields which will be used in form
const fields = [
  'userName',
  'aboutMe',
  'sendMeEmails',
];
// validating rules for fields
const validate = (errors, values) => {
  if (!values.userName) errors.userName = 'Required';
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
    const {
      submitting,
      submittable,
      handleSubmit,
      fields: {
        userName,
        aboutMe,
        sendMeEmails,
      },
    } = this.props;

    return (
      <form onSubmit={handleSubmit}>

        <div>
          <input type="text"
                 { ...userName.props } />
          {userName.error && <div>{userName.error}</div>}
        </div>

        <div>
          <textarea { ...aboutMe.props } />
        </div>

        <div>
          <label htmlFor="sendMeEmails">
            <input type="checkbox"
                   { ...sendMeEmails.props } />
          </label>
        </div>

        <div>
          <button type="submit"
                  disabled={submittable}>
            {(submitting) ?
              'Submitting ...'
            :
              'Submit'
            }
          </button>
        </div>
      </form>
    );
  }

}
