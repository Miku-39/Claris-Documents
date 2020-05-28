import React, { Component } from 'react'
import { View,
  LayoutAnimation,
  NativeModules } from 'react-native'
import { Colors } from '../theme'
import Ticket from '../components/Ticket'
import { connect } from 'react-redux'

const fieldsProperties = [
{
  state:              { name: 'Статус', type: 'list' },
  actualCreationDate: { name: 'Дата', type: 'date' },
  registrationDate:   { name: 'Создана', type: 'date' },
  finishDate:         { name: 'Завершить к', type: 'date' },
  expirationDate:     { name: 'Действует до', type: 'date' },
}, {
  kind:               { name: 'Вид документа', type: 'list' },
  category:           { name: 'Тип документа', type: 'list' },
  author:             { name: 'Автор', type: 'list' },
  company:            { name: 'Компания', type: 'list' },
}, {
  content:            { name: 'Содержание', type: 'text' },
  file:               { name: 'Файл', type: 'file'},
  scan:               { name: 'Скан', type: 'file' },
}, {
  whereHappened:      { name: 'Где произошло', type: 'text' },
  whatHappened:       { name: 'Что сделать', type: 'text' },
  description:        { name: 'Что сделать', type: 'text' },
  responsible:        { name: 'Ответственный', type: 'list' },
}, {
  note:               { name: 'Примечание', type: 'text' },
}
]

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

/*
@connect(
    store => ({
        session: selectors.getSession(store)
    })
)*/

export default class TicketScreen extends Component {
    static navigationOptions = ({navigation}) => {
        const { ticket } = navigation.state.params

        return ({
            title: (ticket.number ? ('№' + ticket.number + ' - ') : '') + (ticket.state ? ticket.state.name : ticket.status.name)
        })
    }

    componentWillMount(){
      const { ticket, type } = this.props.navigation.state.params
      this.setState({ticket: ticket, type: type})
    }

    componentWillReceiveProps(nextProps) {
      const { ticket, type } = this.props.navigation.state.params
      this.setState({ticket: ticket, type: type})
    }

    updateItem = (ticket) => {
      const { updateItem } = this.props.navigation.state.params
      updateItem(ticket)
      LayoutAnimation.easeInEaseOut();
      this.setState({ticket: ticket})
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Ticket ticket={this.state.ticket}
                        type={this.state.type}
                        fieldsProperties={fieldsProperties}
                        updateItem={this.updateItem}
                        goBack={this.props.navigation.goBack}/>
            </View>
        )
    }
}
