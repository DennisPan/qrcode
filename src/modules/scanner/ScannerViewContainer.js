import { Vibration } from 'react-native';
import {
  compose, withState, withHandlers, lifecycle,
} from 'recompose';
import { connect } from 'react-redux';
import Sound from 'react-native-sound';

import { addItemToHistory } from '../history/HistoryState';

import ScannerView from './ScannerView';

Sound.setCategory('Playback');

export default compose(
  connect(
    state => ({
      settings: state.settings,
      history: state.history.items,
    }),
    dispatch => ({
      addItemToHistory: data => dispatch(addItemToHistory(data)),
    }),
  ),
  withState('isFlashlightOn', 'setFlashlight', false),
  withState('focusedScreen', 'setFocusedScreen', ''),
  withHandlers({
    playSound: () => () => {
      const beep = new Sound('beep.wav', Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          // eslint-disable-next-line
          console.log('failed to load the sound');
        } else {
          beep.play();
        }
      });
    },
  }),
  withHandlers({
    toggleFlashlight: props => () => {
      props.setFlashlight(!props.isFlashlightOn);
    },
    onCodeScanned: props => (codeData: { data: string }) => {
      if (props.settings.batch) {
        if (!props.history[0] || props.history[0].data !== codeData.data) {
          if (!props.history.find(item => item.data === codeData.data)) {
            props.addItemToHistory(codeData);
            if (props.settings.vibrate) {
              Vibration.vibrate(200);
            }
            if (props.settings.beep) {
              props.playSound();
            }
          }
        }
      } else {
        props.navigation.navigate('ScannedCode', codeData);
        if (props.settings.history) {
          if (props.settings.duplicate) {
            props.addItemToHistory(codeData);
            props.navigation.navigate('ScannedCode', codeData);
          } else {
            const notInHistory = !props.history.find(item => item.data === codeData.data);
            if (notInHistory) {
              props.addItemToHistory(codeData);
              props.navigation.navigate('ScannedCode', codeData);
            }
          }
        }
        if (props.settings.vibrate) {
          Vibration.vibrate(200);
        }
        if (props.settings.beep) {
          props.playSound();
        }
      }
    },
  }),
  lifecycle({
    componentDidMount() {
      const { navigation } = this.props;
      navigation.addListener('willFocus', () => this.props.setFocusedScreen(true));
      navigation.addListener('willBlur', () => this.props.setFocusedScreen(false));
    },
  }),
)(ScannerView);
