import React from 'react';
import _ from 'lodash';
import { Keyboard } from 'react-native';


export default function formkitConnect(config) {
  return function decorator(Target) {
    return class extends React.Component {
      static contextTypes = Target.contextTypes;

      constructor(props) {
        super(props);

        this.state = {
          formStorage: {},
          keyboardOpened: false,
        };

        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () =>
          this.setState({keyboardOpened: true}));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () =>
          this.setState({keyboardOpened: false}));
      }

      componentWillMount() {
        if (!config || !config.getForm) return;

        //const form = config.getForm(this.props, this._reactInternalInstance._context);
        const form = config.getForm(this.props, this.context);

        // init form
        if (config.fields) {
          form.init(config.fields);
        }

        // set initial state
        this.setState({
          formStorage: form.$getWholeStorageState().formState,
        });
        // update react state on each change
        form.on('anyChange', () => {
          this.setState({
            formStorage: form.$getWholeStorageState().formState,
          });
        });

        this.updatedProps = {
          ..._.omit(this.props, 'children'),
          form,
          keyboardOpened: this.state.keyboardOpened,
        };
      }

      shouldComponentUpdate(nextProps, nextState) {
        return !nextState.keyboardOpened;
      }

      componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
      }

      render() {
        return <Target {...this.updatedProps}>{this.updatedProps.children}</Target>;
      }
    }
  }
}
