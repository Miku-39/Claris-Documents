import React, { Component } from 'react';
import {
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  NativeModules,
  LayoutAnimation,
  AppThemeState } from 'react-native';

import { Colors, Images } from '../theme'
import LoginComponent from '../components/LoginComponent'

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export default class MainComponent extends Component {
    render = () => {
      return (

              <View style={styles.contentContainer} onLayout={() => {LayoutAnimation.easeInEaseOut();}}>

                  {this.props.session.roles.includes('sighting') &&
                  <TouchableOpacity  onPress={() => { this.props.openDocuments('documents') }}>
                      <View style={styles.Button}>
                          <Image resizeMode='contain' source={Images.sign} style={styles.buttonImage}/>
                          <Text style={styles.buttonLabel}>Документы</Text>
                      </View>
                  </TouchableOpacity>}

                  {this.props.session.roles.includes('user') &&
                  <TouchableOpacity onPress={() => { this.props.openDocuments('tasks')}}>
                      <View style={styles.Button}>
                          <Image resizeMode='contain' source={Images.list} style={styles.buttonImage}/>
                          <Text style={styles.buttonLabel}>Задачи</Text>
                      </View>
                  </TouchableOpacity>}

                  {this.props.session.roles.includes('user') &&
                  <TouchableOpacity onPress={() => { this.props.addTicket() }}>
                        <View style={styles.Button}>
                          <Image resizeMode='contain' source={Images.add_task} style={styles.buttonImage} />
                          <Text style={styles.buttonLabel}>Создать задачу</Text>
                        </View>
                  </TouchableOpacity>}

              </View>
      )}
}

const styles = StyleSheet.create({
    contentContainer: {
        flexDirection: 'row',
        //justifyContent: 'space-around',
        flexWrap: 'wrap'
    },
    Button: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: responsiveWidth(42.5),
        height: responsiveWidth(42.5),
        maxWidth: 200,
        maxHeight: 200,
        borderRadius: 15,
        marginTop: responsiveWidth(5) > 25 ? 25 : responsiveWidth(5),
        marginLeft: responsiveWidth(5) > 25 ? 25 : responsiveWidth(5),
        backgroundColor: 'white',
    },
    buttonImage: {
        width: responsiveWidth(27),
        height: responsiveWidth(27),
        maxWidth: 100,
        maxHeight: 100,
        margin: 5
    },
    buttonLabel: {
        fontSize: responsiveFontSize(18) > 20 ? 20 : responsiveFontSize(18),
        margin: 5,
        maxWidth: 150,
        textAlign: 'center'
    }
})
