// @flow
import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'react-native-ui-lib';

import { codeTypesList, fieldTypesList } from './NewCodeState';
import { Input, Picker } from '../../components';

type Props = {
  activeCodeType: string,
  updateField: (string) => void,
}

const generateTextInput = (key, onChange, placeholder, keyboardType, secureTextEntry) => (
  <Input
    key={key}
    onChangeText={onChange}
    placeholder={placeholder}
    keyboardType={keyboardType}
    secureTextEntry={secureTextEntry}
  />
);
const CodeGeneratingForm = (props: Props) => {
  switch (props.activeCodeType) {
    case codeTypesList.URL:
      return generateTextInput(0, text => props.updateField(fieldTypesList.TEXT, text), 'URL');
    case codeTypesList.EMAIL:
      return (
        <View>
          {generateTextInput(1, text => props.updateField(fieldTypesList.EMAIL_TO, text), 'To')}
          {generateTextInput(21, text => props.updateField(fieldTypesList.EMAIL_SUBJECT, text), 'Subject')}
          {generateTextInput(22, text => props.updateField(fieldTypesList.EMAIL_BODY, text), 'Message')}
        </View>
      );
    case codeTypesList.TEL:
      return generateTextInput(2, text => props.updateField(fieldTypesList.TEXT, `tel:${text}`), 'Tel', 'numeric');
    case codeTypesList.SMS:
      return (
        <View>
          {generateTextInput(3, text => props.updateField(fieldTypesList.SMS_TO, text), 'Phone number')}
          {generateTextInput(4, text => props.updateField(fieldTypesList.SMS_MESSAGE, text), 'Message')}
        </View>
      );
    case codeTypesList.WIFI:
      return (
        <View>
          {generateTextInput(5, text => props.updateField(fieldTypesList.WIFI_SSID, text), 'SSID')}
          <Picker
            placeholder="Encryption"
            onSetValue={text => props.updateField(fieldTypesList.WIFI_ENCRYPTION, text)}
            items={[
              { id: 1, label: 'None', value: '' },
              { id: 2, label: 'WEP', value: 'WEP' },
              { id: 3, label: 'WPA/WPA2', value: 'WPA' },
            ]}
          />
          {generateTextInput(7, text => props.updateField(fieldTypesList.WIFI_PASSWORD, text), 'Password', null, true)}
        </View>
      );
    case codeTypesList.GEO:
      return (
        <View>
          {generateTextInput(8, text => props.updateField(fieldTypesList.GEO_LONG, text), 'Long', 'numeric')}
          {generateTextInput(9, text => props.updateField(fieldTypesList.GEO_LAT, text), 'Lat', 'numeric')}
        </View>
      );
    case codeTypesList.CONTACT:
      return (
        <View>
          <View row>
            <View flex style={styles.textInputMargin}>
              {generateTextInput(10, text => props.updateField(fieldTypesList.CONTACT_NAME, text), 'First Name')}
            </View>
            <View flex>
              {generateTextInput(11, text => props.updateField(fieldTypesList.CONTACT_SURNAME, text), 'Last Name')}
            </View>
          </View>
          {generateTextInput(12, text => props.updateField(fieldTypesList.CONTACT_PHONE, text), 'Phone')}
          {generateTextInput(13, text => props.updateField(fieldTypesList.CONTACT_EMAIL, text), 'Email')}
        </View>
      );
    case codeTypesList.EVENT:
      return (
        <View>
          {generateTextInput(15, text => props.updateField(fieldTypesList.EVENT_TITLE, text), 'Title')}
          {generateTextInput(16, text => props.updateField(fieldTypesList.EVENT_DESCRIPTION, text), 'Description')}
          {generateTextInput(17, text => props.updateField(fieldTypesList.EVENT_LOCATION, text), 'Location')}
          <View row>
            <View flex style={styles.textInputMargin}>
              <Picker
                type="datetime"
                placeholder="Start"
                onSetValue={text => props.updateField(fieldTypesList.EVENT_START, text)}
              />
            </View>
            <View flex>
              <Picker
                type="datetime"
                placeholder="End"
                minimumDate={props.fieldValues[fieldTypesList.EVENT_START]
                  && props.fieldValues[fieldTypesList.EVENT_START]}
                onSetValue={text => props.updateField(fieldTypesList.EVENT_END, text)}
              />
            </View>
          </View>
        </View>
      );
    default:
      return generateTextInput(20, text => props.updateField(fieldTypesList.TEXT, text), 'Text');
  }
};

const styles = StyleSheet.create({
  textInputMargin: {
    marginRight: 20,
  },
});

export default CodeGeneratingForm;
