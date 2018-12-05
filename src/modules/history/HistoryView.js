// @flow
import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  View,
  Text,
  Image,
} from 'react-native-ui-lib';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';

import { codeTypes } from '../newCode/NewCodeView';
import { codeTypesList } from '../newCode/NewCodeState';
import { parseScannedString } from '../scannedCode/ScannedCodeState';
import { commonStyles, colors } from '../../styles';

type Props = {
  navigation: {
    navigate: (string, any) => void,
  },
  items: Array<{
    id: number,
    data: string,
    date: Date,
  }>,
  removeItemFromHistory: (number) => void,
};

export default function HistoryView(props: Props) {
  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <StatusBar
        translucent={false}
        backgroundColor={colors.lightBlue}
      />
      <View centerH marginB-25 marginT-10>
        <Text h1 darkBlue>History</Text>
      </View>
      <ScrollView
        style={styles.historyItemsWrapper}
      >
        {props.items.length === 0 && <Text marginT-20 gray center>You don't have any scanned code</Text>}
        {props.items.map((qrcode) => {
          const parsedQRCode = parseScannedString(qrcode.data);
          const foundCodeType = codeTypes.find(codeType => codeType.label === parsedQRCode.type);
          const whiteIcon = foundCodeType ? `${foundCodeType.icon}-white` : 'text-white';
          return (
            <TouchableOpacity
              onPress={() => props.navigation.navigate('ScannedCode', qrcode)}
              style={styles.historyItemContainer}
              key={qrcode.id}
            >
              <LinearGradient
                style={styles.imageContainer}
                colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
              >
                <Image
                  assetGroup="types"
                  assetName={whiteIcon}
                />
              </LinearGradient>
              <View paddingH-15 flex-1>
                <View row centerV spread>
                  <Text numberOfLines={1} h3 marginB-5 marginR-15>
                    {parsedQRCode.fields[0].value}
                    {(parsedQRCode.type === codeTypesList.CONTACT
                      || parsedQRCode.type === codeTypesList.GEO)
                      && ` ${parsedQRCode.fields[1].value}`}
                  </Text>
                  <TouchableOpacity
                    onPress={() => props.removeItemFromHistory(qrcode.id)}
                    style={styles.deleteIconContainer}
                  >
                    <Image
                      assetGroup="icons"
                      assetName="delete"
                    />
                  </TouchableOpacity>
                </View>
                <Text gray>{moment(qrcode.date).format('DD.MM.YYYY')}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  historyItemsWrapper: {
    paddingHorizontal: 15,
  },
  historyItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    backgroundColor: colors.white,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIconContainer: {
    position: 'absolute',
    right: -25,
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
