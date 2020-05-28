import React, { Component } from 'react'
import { View,
  DatePickerAndroid,
  DatePickerIOS,
  Alert,
  TouchableOpacity,
  Text,
  NativeModules,
  LayoutAnimation,
  Keyboard
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons'

import ServiceTicketEditor from '../components/ServiceTicketEditor'
import Loader from '../components/Loader'
import { add, addFile, dismiss } from '../middleware/redux/actions/Ticket'

const headerButtonsHandler = { save: () => null }


const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

@connect(
    store => ({
        employeeId: store.session.get('userId'),
        companyId: store.session.get('companyId'),
        isAdding: store.ticket.get('isAdding'),
        fileIsAdding: store.ticket.get('fileIsAdding'),
        added: store.ticket.get('added'),
        fileAdded: store.ticket.get('fileAdded'),
        fileId: store.ticket.get('fileId'),
        error: store.ticket.get('error'),
        session: store.session.toJS()
    }),
    dispatch => ({
        addTicket: (ticket) => dispatch(add(ticket)),
        addFile: (file) => dispatch(addFile(file)),
        dismiss: () => dispatch(dismiss())
    })
)
export default class ServiceScreen extends Component {
    static navigationOptions = ({navigation}) => {
        return ({
            title: 'Новая задача',
            headerRight: (
                <View style={{flexDirection: 'row', paddingRight: 7}}>
                    <TouchableOpacity onPress={() => headerButtonsHandler.save()}>
                        <Icon name='check' color='#FFF' size={30}/>
                    </TouchableOpacity>
                </View>
            ),
            headerLeft: (<Icon name='chevron-left' color='#FFF' size={40} onPress={ () => { navigation.goBack() } }/> )

        })
    }


    componentWillMount() {
        const { employeeId, companyId, session } = this.props

        var ticket = {
            actualCreationDate: new Date(),
            author: employeeId,
            status: '4285215000',
            type: 'id',
            client: companyId,
            photo: null
        }

        this.setState({ticket: ticket, session: session, fieldsHighlights: {}})
    }

    componentDidMount() {
        headerButtonsHandler.save = this.save
    }

    componentWillReceiveProps(newProps) {
      const { added, error, fileAdded, fileId } = newProps
      const { goBack } = this.props.navigation

      if (added){
          Alert.alert( 'Заявка добавлена успешно', '',
          [{text: 'Закрыть', onPress: () => { goBack() }}])
          this.props.dismiss()
      }

      if (error) {
          Alert.alert( 'Ошибка', 'При сохранении возникла ошибка.',
          [{text: 'Закрыть', onPress: () => { }}])
      }

      if (fileAdded){
          this.updateField(fileId, 'file')
          Alert.alert( 'Файл добавлен успешно')
      }
    }

    save = () => {
        const { ticket } = this.state
        const { session } = this.props

        var fieldsHighlights = {
          description: !ticket.description
        }

        Keyboard.dismiss()
        var passed = true;
        for (var i in fieldsHighlights) {
            if (fieldsHighlights[i]) {
                passed = false;
                break;
            }}

        if(passed){
          //this.props.addTicket(ticket)
        }else{
          Alert.alert('Заполните обязательные поля')
        }

        LayoutAnimation.easeInEaseOut();
        this.setState({'fieldsHighlights': fieldsHighlights})

    }

    saveFile = (file) => {
        this.props.addFile(file)
    }

    addFileId = (fileId) => {
      const { ticket } = this.state
      ticket.photo = fileId
      this.setState({ticket})
    }

    updateField = (data, field) => {
      const { ticket } = this.state
      ticket[field] = data == '' ? null : data
      this.setState({ticket})
    }

    render = () => {
        const { ticket, session} = this.state
        const { isAdding, fileIsAdding } = this.props

        return (
            <Loader message='Сохранение' isLoading={isAdding || fileIsAdding}>
                <ServiceTicketEditor
                    ticket={ticket}
                    updateField={this.updateField}
                    saveFile={this.saveFile}
                    fieldsHighlights={this.state.fieldsHighlights}
                    session={session}
                />
            </Loader>
        )
    }
}
