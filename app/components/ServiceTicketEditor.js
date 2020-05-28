import React, { Component } from 'react'
import { View, ScrollView, TextInput, StyleSheet, Text, Platform, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Fumi } from 'react-native-textinput-effects'
import { CheckBox } from 'react-native-elements'
import ImagePickerComponent from '../components/ImagePicker'
import DatePickerComponent from '../components/DatePicker'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Colors } from '../theme'
import PickerComponent from '../components/PickerAlternate'

export default class ServiceScreen extends Component {
  constructor(props) {
     super(props);
     this.state = {
       visitDate: this.props.ticket.visitDate,
       image: null
     }
  }

  updateFile = (uri) => {
    this.props.saveFile(uri)
    //this.setState({image: uri})
  }

  render () {
    Text.defaultProps = Text.defaultProps || {};
    //Text.defaultProps.allowFontScaling = true;
    var finishDate = new Date()
    return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
        <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraHeight={130}
        extraScrollHeight={130}>
            <View style={{
              flexDirection: 'column',
              marginLeft: 5,
              marginRight: 5}}>

                <View style={styles.fieldsContainer}>
                  <DatePickerComponent
                        isHighlighted={this.props.fieldsHighlights.finishDate}
                        date={finishDate}
                        onUpdate={(date) => {this.props.updateField(date, 'finishDate')}}
                        label="Завершить до"
                        placeholder="Выберите дату"
                        />
                </View>

                <View>
                <TextInput
                  placeholder="Что сделать *"
                  underlineColorAndroid='transparent'
                  style={[styles.textInputStyle, {borderColor: this.props.fieldsHighlights.description ? Colors.accentColor : '#FFF'}]}
                  multiline={true}
                  scrollEnabled={true}
                  onChangeText={(text) => {this.props.updateField(text, 'description')}}
                  />
                  <ImagePickerComponent
                    onChoose={this.props.saveFile}/>
                </View>

                </View>
                </KeyboardAwareScrollView>
            </View>
    )
  }
}const styles = StyleSheet.create({
    fumiInput: {
      color: Colors.textColor,
      marginBottom: Platform.OS === 'android' ? 7 : 0
   },
   fumiStyle: {
     borderRadius: 20,
     backgroundColor: Colors.fieldsColor,
     borderWidth: 5,
     borderColor: '#FFF'
   },
   textInputStyle:{
    height: 160,
    borderRadius: 20,
    borderWidth: 5,
    borderColor: '#FFF',
    backgroundColor : "#FFF",
    fontSize: 18,
    color: Colors.textColor,
    padding: 10,
    paddingTop: 10
  },
  field: {
    margin: 10,
    color: Colors.textColor,
    fontSize: 18,
    fontWeight: '500'
  },
  fieldsContainer: {
    backgroundColor: Colors.fieldsColor,
    borderRadius: 20,
    marginBottom: 10
  }
})
