var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
define("interfaces/FormState", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("interfaces/FieldState", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("helpers", ["require", "exports", "lodash"], function (require, exports, _) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function fillFieldsState(formFields) {
        var fields = {};
        _eachField(formFields, function (field, path) {
            _.set(fields, path, generateInitialStateOfField(field));
        });
        return fields;
    }
    exports.fillFieldsState = fillFieldsState;
    function generateFieldsInitParams(fields, initialValues) {
        var schema = {};
        if (_.isArray(fields)) {
            _.each(fields, function (fieldName) {
                var initialValue = _.get(initialValues, fieldName);
                schema[fieldName] = { savedValue: initialValue };
            });
        }
        else if (_.isPlainObject(fields)) {
            _eachField(fields, function (field, path) {
                var initialValue = _.get(initialValues, path);
                schema[path] = field;
                if (!_.isUndefined(initialValue)) {
                    schema[path].savedValue = initialValue;
                }
            });
        }
        else {
            throw new Error("Incorrect type of fields param");
        }
        return schema;
    }
    exports.generateFieldsInitParams = generateFieldsInitParams;
    function generateInitialStateOfField(field) {
        var onChange = function (param) {
            if (_.isObject(param) && param.target) {
                field.handleChange(param.target.value);
            }
            else {
                field.handleChange(param);
            }
        };
        var fieldState = makeFieldState(field);
        fieldState.handleChange = field.handleChange;
        fieldState.props.onChange = onChange;
        return fieldState;
    }
    exports.generateInitialStateOfField = generateInitialStateOfField;
    function makeFormState(form) {
        return {
            values: form.values,
            savedValues: form.savedValues,
            editedValues: form.editedValues,
            unsavedValues: form.unsavedValues,
            dirty: form.dirty,
            touched: form.touched,
            saving: form.saving,
            submitting: form.submitting,
            submittable: form.submittable,
            valid: form.valid,
            errors: form.invalidMessages,
        };
    }
    exports.makeFormState = makeFormState;
    function makeFieldState(field) {
        return {
            value: field.value,
            savedValue: field.savedValue,
            editedValue: field.editedValue,
            name: field.fullName,
            disabled: field.disabled,
            dirty: field.dirty,
            touched: field.touched,
            valid: field.valid,
            error: field.invalidMsg,
            saving: field.saving,
            savable: field.savable,
            focused: field.focused,
            defaultValue: field.defaultValue,
            handleChange: function (value) { },
            props: {
                name: field.fullName,
                value: field.value,
                disabled: field.disabled,
                onChange: function (event) { },
            }
        };
    }
    exports.makeFieldState = makeFieldState;
    function _eachField(fields, cb) {
        var recursively = function (container, path) {
            if (_isField(container)) {
                cb(container, path);
                return;
            }
            _.each(container, function (field, name) {
                var curPath = _.trimStart(path + "." + name, '.');
                recursively(field, curPath);
            });
        };
        recursively(fields, '');
    }
    function _isField(container) {
        if (_.isObject(container)) {
            if (container.constructor.name === 'Field')
                return true;
        }
        if (!_.isPlainObject(container))
            return false;
        var lookingParams = [
            'name',
            'initial',
            'disabled',
            'defaultValue',
            'savedValue',
        ];
        var interSection = _.intersection(_.keys(container), lookingParams);
        return !_.isEmpty(interSection);
    }
});
define("interfaces/Config", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("FormkitConnect", ["require", "exports", "react", "lodash", "formkit", "helpers"], function (require, exports, React, _, formkit_1, helpers_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function FormkitConnect(config) {
        return function decorator(Target) {
            var Wrapper = (function (_super) {
                __extends(Wrapper, _super);
                function Wrapper() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.state = {
                        formState: {},
                        fieldsState: {},
                        wasStateInited: false,
                    };
                    _this.handleStorageChange = function (data) {
                        _this.updateFields();
                        _this.setState({ formState: helpers_1.makeFormState(_this.form) });
                    };
                    _this.handleSubmit = function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                        _this.form.handleSubmit();
                    };
                    return _this;
                }
                Wrapper.prototype.componentWillReceiveProps = function (nextProps) {
                    if (_.isEqual(nextProps.initialValues, this.props.initialValues))
                        return;
                    this.updateSavedValues(nextProps);
                };
                Wrapper.prototype.componentWillMount = function () {
                    if (!config)
                        throw new Error("You have to specify at least fields definition for formkit connector's config!");
                    if (!config.fields)
                        throw new Error("You have to specify fields definition for formkit connector's config!");
                    if (config.validate && !_.isFunction(config.validate))
                        throw new Error("validate callback has to be a function!");
                    this.form = this.instantiateForm(config);
                    this.initForm();
                    this.form.on('storage', this.handleStorageChange);
                };
                Wrapper.prototype.componentWillUnmount = function () {
                    this.form.destroy();
                };
                Wrapper.prototype.getWrappedInstance = function () {
                    return this.refs.instance;
                };
                Wrapper.prototype.instantiateForm = function (connectorConfig) {
                    if (connectorConfig.getForm) {
                        return config.getForm(this.props, this.context);
                    }
                    return formkit_1.default.newForm(connectorConfig.config);
                };
                Wrapper.prototype.initForm = function () {
                    var _this = this;
                    var validateWrapper = function (errors, values) {
                        return config.validate && config.validate(errors, values, _this.props);
                    };
                    var fieldsInitial = helpers_1.generateFieldsInitParams(config.fields, this.props.initialValues);
                    this.form.init(fieldsInitial, config.validate && validateWrapper);
                    this.initState();
                };
                Wrapper.prototype.initState = function () {
                    var _this = this;
                    var formState = helpers_1.makeFormState(this.form);
                    var fieldsState = helpers_1.fillFieldsState(this.form.fields);
                    this.setState({ formState: formState, fieldsState: fieldsState }, function () {
                        _this.setState({ wasStateInited: true });
                    });
                };
                Wrapper.prototype.updateSavedValues = function (props) {
                    var initialValues = props.initialValues;
                    if (config.mapInitialValues) {
                        initialValues = config.mapInitialValues(initialValues, props);
                    }
                    this.form.setSavedValues(initialValues);
                };
                Wrapper.prototype.updateFields = function () {
                    var fieldsState = _.clone(this.state.fieldsState);
                    var recursively = function (container, path) {
                        if (_.isPlainObject(container)) {
                            _.each(container, function (field, name) {
                                var curPath = _.trimStart(path + "." + name, '.');
                                recursively(field, curPath);
                            });
                            return;
                        }
                        var currentState = _.get(fieldsState, path);
                        if (_.isUndefined(currentState)) {
                            _.set(fieldsState, path, helpers_1.generateInitialStateOfField(container));
                        }
                        else {
                            _.set(fieldsState, path, _.defaultsDeep(helpers_1.makeFieldState(container), currentState));
                        }
                    };
                    recursively(this.form.fields, '');
                    this.setState({ fieldsState: fieldsState });
                };
                Wrapper.prototype.render = function () {
                    if (this.state.wasStateInited) {
                        return React.createElement(Target, __assign({ ref: 'instance', form: this.form, fields: this.state.fieldsState, handleSubmit: this.handleSubmit }, this.state.formState, this.props));
                    }
                    else {
                        return React.createElement('span');
                    }
                };
                Wrapper.contextTypes = Target.contextTypes;
                return Wrapper;
            }(React.PureComponent));
            return Wrapper;
        };
    }
    exports.default = FormkitConnect;
    ;
});
define("index", ["require", "exports", "FormkitConnect"], function (require, exports, FormkitConnect_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FormkitConnect = FormkitConnect_1.default;
});
//# sourceMappingURL=react-formkit.umd.js.map