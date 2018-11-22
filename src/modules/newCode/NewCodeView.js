import React from 'react';
import {
  SafeAreaView,
} from 'react-native';
import {
  View,
  Text,
} from 'react-native-ui-lib';

import { commonStyles } from '../../styles';

type Props = {
  navigation: {
    navigate: (string) => void,
  },
};

export default function NewCodeView(props: Props) {
  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View flex centerV padding-20 bg-white>
        <Text darkBlue h1>NewCode View</Text>
      </View>
    </SafeAreaView>
  )
}
