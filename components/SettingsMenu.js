import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const debug = false;

export default class SettingsModal extends React.Component {
  // Очищает AsyncStorage
  resetData = async () => {
    try {
      await AsyncStorage.clear();
      console.log('Сброшены все данные');
    } catch (error) {
      console.log('Ошибка: ', error);
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.container} behavior="padding">
        {/* Хэдер */}
        <View style={styles.header}>
          <Text style={styles.header}>Настройки</Text>
          <TouchableOpacity
            style={styles.close}
            onPress={this.props.closeModal}>
            <Feather name="x" size={48} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          {/* Кнопка сброса */}
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              this.resetData();
              this.props.closeModal();
            }}>
            <Text style={{ color: '#172D4C', fontWeight: 'bold' }}>Сбросить списки</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#255394',
  },
  header: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  close: {
    position: 'absolute',
    right: 24,
    top: 8,
  },
  setting: {
    color: 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButton: {
    width: '60%',
    maxWidth: 400,
    height: 50,
    marginTop: 24,
    backgroundColor: '#58B2F7',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    // display: 'flex',
    // flexDirection: 'row',
    // backgroundColor: 'white',
    // zIndex: 1,
    // alignItems: 'center',
    // alignSelf: 'center',
    // justifyContent: 'center',
    // borderRadius: 40,
    // width: 180,
    // height: 46,
    // marginBottom: 24,
  },
});
