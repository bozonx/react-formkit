const formkitConnect = require('../src/formkitConnect').default;
const WebForm = require('./web/WebForm').default;
const WebTextInput = require('./web/WebTextInput').default;
const WebTextArea = require('./web/WebTextArea').default;
const WebCheckbox = require('./web/WebCheckbox').default;
const WebSelect = require('./web/WebSelect').default;
//const MobileTextInput = require('./mobile/MobileTextInput').default;

module.exports = {
  formkitConnect,
  WebForm,
  WebTextInput,
  WebTextArea,
  WebCheckbox,
  WebSelect,
  //MobileTextInput,
};
