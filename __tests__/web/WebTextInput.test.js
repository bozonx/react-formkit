/* eslint-disable no-unused-vars */

import React from 'react';
import { shallow } from 'enzyme';

import WebTextInput from '../../src/web/WebTextInput';


it('initial snapshot', () => {
  const component = shallow(
    <WebTextInput />
  );

  expect(component).toMatchSnapshot();
});
