import React, { Component } from 'react'
import { View,
  Alert,
  TouchableOpacity,
  TouchableHighlight,
  Text,
  Keyboard,
  StyleSheet,
  FlatList,
  NativeModules,
  LayoutAnimation,
  Platform
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { SearchBar } from 'react-native-elements'
import { connect } from 'react-redux'

import { Metrics, Colors } from '../theme'
import { fetch } from '../middleware/redux/actions/Tickets'
import { update, dismiss } from '../middleware/redux/actions/Ticket'
import Loader from '../components/Loader'

const headerButtonsHandler = {
    refresh: () => null,
    search: () => null
}

const statusNames = {
  '421575459000': 'Отклонена',
  '12884953000': 'Принята'
}

const status2colors = {
    null: 'gray',
    '12884953000': '#008000',//Принята
    '421575460000': '#214dde',//На территор...
    '421575453000': '#008000',//Выполнена
    '421575459000': '#d12424',//Отклонена
    '4285215000': '#fd9419',//Создана
    '2804833189000': '#d12424',//Повторная
    '4285216000': '#808080',//Закрыта
    '2237210852000': '#00A040',//выполняется
}

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

@connect(
    store => ({
        tickets: store.tickets.toJS(),
        ticket: store.ticket.toJS()
    }),
    { fetch, update, dismiss }
)
export default class TicketsScreen extends Component {
    static navigationOptions = ({navigation}) => {
    const { type } = navigation.state.params
    var title
    switch(type){
      case 'documents':
      title = 'Документы';
      break;

      case 'tasks':
      title = 'Задачи';
      break;
    }
        return ({
            title: title,
            headerRight: (
                <View style={{flexDirection: 'row', paddingRight: 7}}>
                    <TouchableOpacity onPress={() => headerButtonsHandler.refresh()}>
                        <MaterialIcons name='autorenew' size={24} color='white' />
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginLeft: 14, marginRight: 10}} onPress={() => headerButtonsHandler.search()}>
                        <MaterialIcons name='search' size={24} color='white' />
                    </TouchableOpacity>
                </View>
            )
        })
    }

    state = {
        items: [],
        searchBarIsShown: false
    }

    componentDidMount () {
        headerButtonsHandler.search = this._handleShowSearchBarClick
        headerButtonsHandler.refresh = this._handleRefreshClick
        if(Platform.OS != 'android')
          LayoutAnimation.easeInEaseOut();
        this.props.fetch()
    }

    componentWillReceiveProps (nextProps) {
      const { session, tickets, data } = this.props
      const { type } = this.props.navigation.state.params
      if(type == 'documents'){
        items = tickets.documents
        console.log(items)
      }
      if(type == 'tasks'){
        items = tickets.tasks
      }
      items = items ? items : []

      if(Platform.OS != 'android')
        LayoutAnimation.easeInEaseOut();

      this.setState({session: session, items: items})

      const { updated } = nextProps.ticket
      if (updated) {
          Alert.alert( 'Изменение статуса', 'Статус заявки успешно изменен', [
              {text: 'Закрыть', onPress: () => {}}
          ])
      }

    }

    refresh = () => {
      this.props.fetch()
    }

    updateItem = (ticket) => {
      var { items } = this.state
      const itemIndex = items.findIndex(item => item.id == ticket.id)
      items[itemIndex].status = ticket.status
      LayoutAnimation.easeInEaseOut();
      this.setState({items: items})
      this.props.update(ticket)
      this.props.fetch()
      return true
    }

    _handleRefreshClick = () => {
        this._handleHideSearchBarClick()
        this.props.fetch()
    }

    _handleShowSearchBarClick = () => {
        LayoutAnimation.easeInEaseOut();
        const { searchBarIsShown } = this.state
        this.setState({searchBarIsShown: !this.state.searchBarIsShown})
    }

    _handleHideSearchBarClick = () => {
        LayoutAnimation.easeInEaseOut();
        this.setState({searchBarIsShown: false})
        Keyboard.dismiss()
    }

    _handleSearchTextChanged = (text) => {
        const search = text.toLowerCase()
        const tickets = this.props.tickets
        const { type } = this.props.navigation.state.params
        items = tickets[type]

        data = items.filter( item => {
          containsSearch = false
          for(var field in item){
          if(item[field]){
            value = item[field].toString().toLowerCase()
            if(value.includes(search)){containsSearch = true}}
          }
          return !search || containsSearch
        })

        if(Platform.OS != 'android')
          LayoutAnimation.easeInEaseOut();
        this.setState({items: data})
    }





    renderItem = ({item}) => {
      const { navigation } = this.props
      console.log(item)
      try {

      const header = item.number + ', ' + item.state.name
      const name = item.company ? item.company.name : ''
      const type = item.type && item.type.name + ' ' + item.visitDate.substring(0, 10)

      return(

      <View style={{margin: 5, marginTop: 0}}>
      <TouchableHighlight onPress={() => {navigation.navigate('Ticket', {ticket: item, updateItem: this.updateItem})}} underlayColor={Colors.accentColor} style={{borderRadius: 10}}>
      <View style={{flexDirection: 'row', backgroundColor: 'white', borderRadius: 10}}>
          <View style={{width: 10, backgroundColor: status2colors[item.status && item.status.id], borderBottomLeftRadius: 10, borderTopLeftRadius: 10}}></View>
          <View style={{flexDirection: 'column', marginLeft: 5, marginBottom: 5, width: '90%'}}>

              <Text style={styles.ticketNumber}>{header}</Text>
              <Text style={styles.visitorName}>{name}</Text>
              <Text style={styles.typeName}>{type}</Text>

          </View>
          </View>
      </TouchableHighlight>
      </View>

    )}catch{ return null }
    }

    render() {
        Text.defaultProps = Text.defaultProps || {};
        Text.defaultProps.allowFontScaling = true;
        const { navigation } = this.props
        const { items, searchBarIsShown } = this.state
        const { isFetching, fetched } = this.props.tickets
        const extractKey = ({id}) => id
        return (
            <View style={{flex: 1}}>
                {
                    searchBarIsShown &&
                    <SearchBar
                        lightTheme
                        clearIcon={{color: Colors.textColor, name: 'close'}}
                        inputStyle={{backgroundColor: 'white', fontSize: 20}}
                        containerStyle={{backgroundColor: Colors.accentColor, height: Metrics.navBarHeight, width: '100%', marginTop: -1}}
                        onChangeText={this._handleSearchTextChanged}
                        onClearText={this._handleHideSearchBarClick}
                        placeholder='Поиск...'
                    />
                }
                <Loader message='Обновление заявок' isLoading={isFetching}>
                  <FlatList
                      style={{flex: 1}}
                      data={items}
                      renderItem={this.renderItem}
                      keyExtractor={extractKey} />
                </Loader>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
        width: '100%',
        height: '100%'
    },
    rowBack: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'stretch',
        width: '100%',
        height: '100%',
        backgroundColor: 'white'
    },
    ticketNumber:{
      fontSize: 18,
      marginTop: 5,
      marginBottom: 3,
      color: Colors.textColor,
      //fontStyle: 'italic'
    },
    visitorName:{
      fontSize: 20,
      color: 'black'
    },
    typeName:{
      fontSize: 18,
      marginTop: 3,
      marginBottom: 5,
      color: Colors.textColor
    },
})
