import React, { Component } from 'react'
import * as WebBrowser from 'expo-web-browser';
import {  View,
  ScrollView,
  RefreshControl,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  LayoutAnimation,
  NativeModules,
  TextInput,
  Platform
} from 'react-native';
import { Colors } from '../theme'
import { connect } from 'react-redux'
import { update, dismiss, getFile, downloadComments } from '../middleware/redux/actions/Ticket'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CommentsViewer from '../components/CommentsViewer'
//import fieldGroupRenderer from '../components/fieldGroupRenderer'

const statusNames = {
  '2708800028000': 'Отклонен',
  '2708800026000': 'Принята'
}

const REJECTED_STATUS_ID = '2708800028000';
const ACCEPTED_STATUS_ID = '2708800026000';
const ON_CREATE_STATUS_ID = '2340461775000';

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

@connect(
    store => ({
        session: store.session.toJS(),
        error: store.ticket.get('error'),
        fileDownloaded: store.ticket.get('fileDownloaded'),
        link: store.ticket.get('link'),
        //comments: store.ticket.get('comments'),
        //commentsDownloading: store.ticket.get('commentsDownloading'),
        //commentsDownloaded: store.ticket.get('commentsDownloaded'),
        //commentsDownloadingFailed: store.ticket.get('commentsDownloadingFailed'),
        ticketRedux: store.ticket.toJS()
    }),
    dispatch => ({
        dismiss: () => dispatch(dismiss()),
        getFile: (fileId) => dispatch(getFile(fileId)),
        downloadComments: (ticket) => dispatch(downloadComments(ticket)),
        update: (payload) => dispatch(update(payload))
    })
)

export default class Ticket extends React.Component {
  constructor(props) {
     super(props);
     this.state = {
       ticket: this.props.ticket,
       comment: '',
       action: null,
       comments: [],
       commentsDownloading: false,
       commentsDownloaded: false
     }
  }

  componentDidMount(){
      id = this.props.ticket.id
      type = this.props.type
      this.props.downloadComments({type: type, id: id})
  }

  componentWillReceiveProps(newProps) {
    const { error, link, ticketRedux } = newProps

    this.setState({
      commentsDownloaded: ticketRedux.commentsDownloaded,
      commentsDownloading: ticketRedux.commentsDownloading,
      comments: ticketRedux.comments
    })

            if (link){
                    const receiptUrl = link
                    Linking.canOpenURL(receiptUrl).then(supported => {
                    if (supported) {Linking.openURL(receiptUrl);} else {
                        Alert.alert( "Ошибка",
                          "Не удалось найти программу, чтобы открыть файл данного формата",
                          [{ text: "Закрыть", onPress: () => {} }]);}});
            }

            if (ticketRedux.updated) {
                    Alert.alert( 'Изменение статуса', 'Статус заявки успешно изменен', [
                        {text: 'Закрыть', onPress: () => {}}
                    ])
            }

            if (ticketRedux.commentsDownloaded) {
                  console.log(ticketRedux.comments[0])
                  console.log('Comments Downloaded')
                  const commentsDownloaded = ticketRedux.comments[0] ? true : false
                  LayoutAnimation.easeInEaseOut();
                  this.setState({commentsDownloaded: commentsDownloaded, comments: ticketRedux.comments})
            }

            if (ticketRedux.commentsDownloadingFailed) {
                  console.log('Comments Downloading Failed')
            }

            if (ticketRedux.updatingFailed) {
                    console.error(error)
                    Alert.alert( 'Ошибка', 'При сохранении возникла ошибка.',
                    [{text: 'Закрыть', onPress: () => { }}])
            }
  }

  _comments_refresh = () => {
    id = this.props.ticket.id
    type = this.props.type
    this.props.downloadComments({type: type, id: id})
  }

  render () {
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = true;
    const { fieldsProperties, changeStatus } = this.props
    const { ticket } = this.state
    //ticket.contracts = 'https://apple.com'

    const handleShowFilePress = (fileType) => {
      console.log(fileType)
      this.props.getFile(ticket[fileType].id)
    }

    const handleLinkPress = (link) => {
      console.log(link)
      const receiptUrl = link
      Linking.canOpenURL(receiptUrl).then(supported => {
      if (supported) {Linking.openURL(receiptUrl);} else {
          Alert.alert( "Ошибка",
            "Не удалось найти программу, чтобы открыть ссылку данного формата",
            [{ text: "Закрыть", onPress: () => {} }]);}});
    }

    const agreeTicket = () => {
      //this.props.agreeTicket()
      const { action, comment } = this.state
      LayoutAnimation.easeInEaseOut();
      if(!action){
        this.setState({action: 'agree'})
      }else{
        this.props.update({
          action: 'agree',
          comment: comment ? comment : null,
          ticket: this.props.ticket})
          //this.props.navigation.state.params.onGoBack()
          //this.props.navigation.goBack()
      }
    }

    const disagreeTicket = () => {
      const { action, comment } = this.state
      LayoutAnimation.easeInEaseOut();
      if(!action){
        this.setState({action: 'disagree'})
      }else{
        if(comment){
          this.setState({highlightText: false})
          this.props.update({
            action: 'disagree',
            comment: comment,
            ticket: this.props.ticket})
            //this.props.navigation.state.params.onGoBack();
            //this.props.navigation.goBack();
        }else{
          this.setState({highlightText: true})
          Alert.alert( 'Заполните комментарий',
          'При отклонении заявки поле "комментарий" является обязательным.')
        }
      }
    }

    const updateComment = (comment) => {
      this.setState({comment: comment})
    }

    const cancel = () => {
      LayoutAnimation.easeInEaseOut();
      this.setState({
        action: null,
        comment: '',
        highlightText: false
      })
    }

    const fieldGroupRenderer = (fieldGroup) => {
      var fields = []
      Object.keys(fieldGroup).forEach(function(key) {
        try {
        value = ticket[key]
        if(value){
          if(fieldGroup[key].type == 'text'){
            fields.push(<View>
                            <Text style={styles.fieldTitle}>
                            {fieldGroup[key].name}</Text>
                            <Text style={styles.field}>
                            {value}</Text>
                        </View>)
          }
          if(fieldGroup[key].type == 'list'){
            if(value.name){
            fields.push(<View>
                            <Text style={styles.fieldTitle}>
                            {fieldGroup[key].name}</Text>
                            <Text style={styles.field}>
                            {value.name}</Text>
                        </View>)}
          }
          if(fieldGroup[key].type == 'date'){
            fields.push(<View>
                            <Text style={styles.fieldTitle}>
                            {fieldGroup[key].name}</Text>
                            <Text style={styles.field}>
                            {value.substring(0, 10)}</Text>
                        </View>)
          }
          if(fieldGroup[key].type == 'file'){
            fields.push(<View>
                            <Text style={styles.fieldTitle}>
                            {fieldGroup[key].name}</Text>
                            <Text onPress={() => {handleShowFilePress(key)}}
                            style={[styles.field, {color: '#006699'}]}>
                            {value.name}</Text>
                        </View>)
          }
          if(fieldGroup[key].type == 'link'){
            console.log(value)
            fields.push(<View>
                            <Text style={styles.fieldTitle}>
                            {fieldGroup[key].name}</Text>
                            <Text onPress={() => handleLinkPress(value)}
                            style={[styles.field, {color: '#006699'}]}>
                            {value}</Text>
                        </View>)
          }

      }
    }catch(err){console.error(err.message)}})

      return(fields[0] ?
             <View style={styles.fieldsContainer}>
                 { fields }
                 <View style={{marginBottom: 10}}/>
             </View> : null)
  }

    var fieldGroups = []
    for(fieldGroup in fieldsProperties){
      fieldGroups.push(fieldGroupRenderer(fieldsProperties[fieldGroup]))
    }

    return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
        <ScrollView refreshControl={
          <RefreshControl
              refreshing={this.state.commentsDownloading}
              onRefresh={this._comments_refresh}
              colors={['white']}
              progressBackgroundColor={Colors.accentColor}
              tintColor={Colors.accentColor}
              title="Загрузка комментариев..."
              titleColor={Colors.accentColor}/>
        }>
        <KeyboardAwareScrollView
            enableOnAndroid={true}
            extraHeight={130}
            extraScrollHeight={130}>
            <View style={{marginBottom: 150, marginLeft: 5, marginRight: 5}}>
                { fieldGroups }
                {this.state.commentsDownloaded &&
                <CommentsViewer
                    comments={this.state.comments}
                    type={this.props.type}/>}

                  <View style={[styles.buttonsContainer, {marginBottom: 0}]}>
                      {this.state.action &&
                      <TouchableOpacity
                        style={[styles.button, {backgroundColor: Colors.buttonColor,
                           width: '95%'}]}
                        onPress={() => {cancel()}}>
                            <View style={styles.buttonLabelContainer}>
                              <Text style={[styles.field,
                                 {marginBottom: 5,
                                  marginRight: 5,
                                  fontWeight: 'bold'}]}>
                                  Отмена</Text>
                            </View>
                      </TouchableOpacity>
                      }
                  </View>
                  {(this.props.type == 'documents') &&
                  <View style={styles.buttonsContainer}>
                      {this.state.action &&
                      <TextInput
                        placeholder={this.state.action == 'disagree' ? 'Комментарий *' : 'Комментарий'}
                        underlineColorAndroid='transparent'
                        style={[styles.textInputStyle, {borderColor: this.state.highlightText ? Colors.accentColor : '#FFF'}]}
                        multiline={true}
                        scrollEnabled={true}
                        onChangeText={(text) => {updateComment(text)}}
                        />}
                      {(this.state.action != 'agree') &&
                      <TouchableOpacity
                        style={[styles.button, {backgroundColor: Colors.buttonColor,
                           width: this.state.action ? '95%' : '45%'}]}
                        onPress={() => {disagreeTicket()}}>
                            <View style={styles.buttonLabelContainer}>
                              <Text style={[styles.field,
                                 {marginBottom: 5,
                                  marginRight: 5,
                                  fontWeight: this.state.action ? 'bold' : 'normal'}]}>
                                 Отклонить</Text>
                            </View>
                      </TouchableOpacity>}
                      {(this.state.action != 'disagree') &&
                      <TouchableOpacity
                        style={[styles.button, {backgroundColor: Colors.accentColor,
                           width: this.state.action ? '95%' : '45%'}]}
                        onPress={() => {agreeTicket()}}>
                            <View style={styles.buttonLabelContainer}>
                              <Text style={[styles.field,
                                 {color: 'white',
                                 marginBottom: 5,
                                 marginRight: 5,
                                 fontWeight: this.state.action ? 'bold' : 'normal'}]}>
                                 Согласовать</Text>
                            </View>
                      </TouchableOpacity>}
                  </View>}
            </View>
            </KeyboardAwareScrollView>
            </ScrollView>
        </View>
    )
  }
}

const styles = StyleSheet.create({
   fieldsContainer: {
     backgroundColor: Colors.fieldsColor,
     borderRadius: 20,
     marginBottom: 10
   },
   fieldTitle: {
     marginLeft: 10,
     marginTop: 10,
     fontSize: 18,
     color: Colors.textColor
   },
   field: {
     marginLeft: 10,
     marginTop: 5,
     fontSize: 20
   },
   textInputStyle:{
    height: 160,
    width: '95%',
    borderRadius: 20,
    borderWidth: 5,
    borderColor: '#FFF',
    backgroundColor : "#FFF",
    marginTop: 10,
    marginBottom: 10,
    fontSize: 18,
    color: Colors.textColor,
    padding: 10,
    paddingTop: 10
  },
   buttonsContainer: {
     width: '100%',
     flexWrap: 'wrap',
     justifyContent: 'space-around',
     flexDirection: 'row'
   },
   button: {
     height: 60,
     width: '45%',
     borderRadius: 20,
     justifyContent: 'center',
     alignItems: 'center'
   },
   buttonLabelContainer: {
     flex: 1,
     alignItems: 'center',
     justifyContent: 'center'
   }
})
