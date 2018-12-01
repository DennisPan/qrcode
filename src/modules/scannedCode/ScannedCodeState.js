// @flow

import { codeTypesList } from '../newCode/NewCodeState';
import vcard from 'vcard-parser';
import _ from 'lodash';

type ScannedCodeState = {
  +items: Array<{
    content: string,
  }>,
};

type Action = {
  type: string, payload: any,
};

const initialState: ScannedCodeState = {
  items: [],
};

export function convertArrayToKeyValue(array, startIndex = 0) {
  const keyValue = {};
  for (let i = startIndex, j = startIndex + 1; array[i] || array[j]; i += 2, j += 2) {
    if (array[i] && array[j]) keyValue[array[i]] = array[j];
  }
  return keyValue;
}

export function parseScannedString(scannedString: string): {
  type: codeTypesList.CONTACT | codeTypesList.EMAIL | codeTypesList.EVENT | codeTypesList.GEO |
    codeTypesList.SMS | codeTypesList.TEL | codeTypesList.TEXT | codeTypesList.URL | codeTypesList.WIFI,
  fields: Array<{
    title: string,
    value: string,
  }>
} {
  const result = {
    type: codeTypesList.TEXT,
    fields: [],
  };
  console.log(scannedString);
  const splittedInputString = scannedString.split(':');
  switch (scannedString.split(':')[0].toUpperCase()) {
    case 'SMS':
      result.type = codeTypesList.SMS;
      result.fields = [
        { title: 'to', value: splittedInputString[1] || '' },
        { title: 'message', value: splittedInputString[2] || '' },
      ];
      break;
    case 'WIFI':
      result.type = codeTypesList.WIFI;
      const wifiInfo = convertArrayToKeyValue(splittedInputString, 1);
      result.fields = [
        { title: 'ssid', value: wifiInfo['S'] || '' },
        { title: 'encryption', value: wifiInfo['T'] || '' },
        { title: 'password', value: wifiInfo['P'] || '' },
      ];
      break;
    case 'GEO':
      result.type = codeTypesList.GEO;
      const geoString = splittedInputString[1] || '';
      result.fields = [
        { title: 'longitude', value: geoString.split(',')[0] || '' },
        { title: 'latitude', value: geoString.split(',')[1] || '' },
      ];
      break;
    case 'MAILTO':
      result.type = codeTypesList.EMAIL;
      const emailString = splittedInputString[1] || '';
      const emailParams = emailString.split('?')[1] || '';
      const emailParamsArray = emailParams.split('&');
      let emailSubject, emailBody;
      if (emailParamsArray[0].split('=')[0].toLocaleLowerCase() === 'subject') emailSubject = emailParamsArray[0].split('=')[1];
      if (emailParamsArray[0].split('=')[0].toLocaleLowerCase() === 'body') emailBody = emailParamsArray[0].split('=')[1];
      if (emailParamsArray[1] && emailParamsArray[1].split('=')[0].toLocaleLowerCase() === 'subject') emailSubject = emailParamsArray[1].split('=')[1];
      if (emailParamsArray[1] && emailParamsArray[1].split('=')[0].toLocaleLowerCase() === 'body') emailBody = emailParamsArray[1].split('=')[1];
      result.fields = [
        { title: 'to', value: emailString.split('?')[0] || '' },
        { title: 'subject', value: emailSubject || '' },
        { title: 'body', value: emailBody || '' },
      ];
      break;
    case 'TEL':
      result.type = codeTypesList.TEL;
      result.fields = [
        { title: 'number', value: splittedInputString[1] || '' },
      ];
      break;
    case 'BEGIN': {
      switch (scannedString.split(/\r?\n/)[0]) {
        case 'BEGIN:VCARD':
          result.type = codeTypesList.CONTACT;
          const parsedCard = vcard.parse(scannedString);
          result.fields = [
            { title: 'name', value: _.get(parsedCard, 'n[0].value[1]', '') },
            { title: 'surname', value: _.get(parsedCard, 'n[0].value[0]', '') },
            { title: 'full name', value: _.get(parsedCard, 'fn[0].value', '') },
            { title: 'phone', value: _.get(parsedCard, 'tel[0].value', '').replace('tel:', '')},
            { title: 'email', value: _.get(parsedCard, 'email[0].value', '') },
          ];
          break;
        case 'BEGIN:VEVENT':
          result.type = codeTypesList.EVENT;
          const splittedLines = scannedString.split(/\r?\n/);
          const eventData = {};
          splittedLines.forEach(line => {
            if (line[0] === ' ') line = line.slice(1);
            eventData[line.split(':')[0]] = line.split(':')[1];
          });
          result.fields = [
            { title: 'title', value: eventData['SUMMARY'] || '' },
            { title: 'location', value: eventData['LOCATION'] || '' },
            { title: 'description', value: eventData['DESCRIPTION'] || '' },
            { title: 'start', value: eventData['DTSTART'] || '' },
            { title: 'end', value: eventData['DTEND'] || '' },
          ];
          break;
        default:
          result.type = codeTypesList.TEXT;
      }
      break;
    }
    default:
      result.type = codeTypesList.TEXT;
      result.fields = [
        { title: 'text', value: scannedString },
      ];
  }

  if (result.type === codeTypesList.TEXT) {
    const urlRegexp = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);
    if (scannedString.match(urlRegexp)) {
      result.type = codeTypesList.URL;
      result.fields = [
        { title: 'link', value: scannedString },
      ];
    }
  }

  return result;
}

export default function ScannedCodeReducer(state: ScannedCodeState = initialState, action: Action): ScannedCodeState {
  switch (action.type) {
    default:
      return state;
  }
}
