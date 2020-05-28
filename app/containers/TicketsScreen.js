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
  '12884953000': 'Принята',

}

const status2colors = {
    null: 'gray',
    '2708800028000': '#00BB22',//'Отклонен',
    '2708800026000': '#FF0000',//'Принята',
    '2340461775000': '#0077FF'
}

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

@connect(
    store => ({
        tickets: store.tickets.toJS(),
        ticket: store.ticket.toJS(),
        session: store.session.toJS()
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
                    <TouchableOpacity
                      onPress={() => headerButtonsHandler.refresh()}>
                        <MaterialIcons name='autorenew' size={24} color='white' />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{marginLeft: 14, marginRight: 10}}
                      onPress={() => headerButtonsHandler.search()}>
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
      const { session, tickets } = this.props
      const { type } = this.props.navigation.state.params

      items = tickets.tickets[type]
      items = items ? items : []

      if(Platform.OS != 'android')
        LayoutAnimation.easeInEaseOut();

      this.setState({ type: type,
                      session: session,
                      items: items,
                      showedItems: items })

    }

    refresh = () => {
      this.props.fetch()
    }

    updateItem = (ticket) => {
      var { showedItems } = this.state
      const items = showedItems
      const itemIndex = items.findIndex(item => item.id == ticket.id)
      items[itemIndex] = ticket
      LayoutAnimation.easeInEaseOut();
      this.setState({showedItems: items})
      this.props.update(ticket)
      this.props.fetch()
      return true
    }

    _handleRefreshClick = () => {
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
        const { items } = this.state

        var data = items.filter( item => {
          var containsSearch = false
          for(var field in item){
          if(item[field]){
            const value = item[field].toString().toLowerCase()
            if(value.includes(search)){containsSearch = true}}
          }
          return !search || containsSearch
        })

        if(Platform.OS != 'android')
          LayoutAnimation.easeInEaseOut();
        this.setState({showedItems: data})
    }


    renderDocument = (item) => {
      const { navigation } = this.props
      const header = (item.number ? item.number : '-') + ', ' + item.state.name + ', ' + item.actualCreationDate.substring(0, 10)
      const amount = item.amount ? item.amount + ' Р' : ''
      return(
        <View style={{margin: 5, marginTop: 0}}>
        <TouchableHighlight
        onPress={() => {navigation.navigate('Ticket', {ticket: item,
                                                       refresh: this._handleRefreshClick,
                                                       type: 'documents'})}}
          underlayColor={Colors.accentColor} style={{borderRadius: 10}}>
        <View style={{flexDirection: 'row', backgroundColor: 'white', borderRadius: 10}}>
            <View style={[styles.mainTicketContainer,
                          {backgroundColor: status2colors[item.state && item.state.id]}]}></View>
            <View style={{flexDirection: 'column', marginLeft: 5, marginBottom: 5, width: '90%'}}>

                <Text style={styles.ticketNumber}>{header}</Text>
                {item.company &&
                <Text style={styles.agent}>{item.company.name}</Text>
                }
                {item.content &&
                <Text style={styles.agent}>{item.content}</Text>
                }

                {item.amount &&
                  <Text style={styles.amount}>{amount}</Text>
                }

            </View>
            </View>
        </TouchableHighlight>
        </View>
    )
    }

    renderTask = (item) => {
      const { navigation } = this.props
      //var registrationDate = new Date(item.registrationDate)
      //console.log(registrationDate.format('dd-mm-yy hh:mm'))
      const header = (item.author ? item.author.name : '-') + ', ' + item.status.name + ', ' + item.registrationDate.substring(0, 10)
      const dates = 'Выполнить до ' + item.finishDate.substring(0, 10)
      return(
        <View style={{margin: 5, marginTop: 0}}>
        <TouchableHighlight
          onPress={() => {navigation.navigate('Ticket', {ticket: item,
                                                         refresh: this._handleRefreshClick,
                                                         type: 'tasks'})}}
          underlayColor={Colors.accentColor} style={{borderRadius: 10}}>
        <View style={{flexDirection: 'row', backgroundColor: 'white', borderRadius: 10}}>
            <View style={[styles.mainTicketContainer,
                          {backgroundColor: status2colors[item.state && item.state.id]}]}></View>
            <View style={{flexDirection: 'column', marginLeft: 5, marginBottom: 5, width: '90%'}}>

                <Text style={styles.ticketNumber}>{header}</Text>

                {item.description &&
                <Text style={styles.agent}>{item.description}</Text>
                }

                <Text style={styles.amount}>{dates}</Text>

            </View>
            </View>
        </TouchableHighlight>
        </View>
    )
    }

    renderItem = ({item}) => {
      const { navigation } = this.props
      try {
      switch(this.state.type){
        case 'documents':
          return(this.renderDocument(item))
          break;
        case 'tasks':
          return(this.renderTask(item))
          break;
      }
      }catch(err){
      console.log(err.message)
      return null
    }
    }

    render() {
        Text.defaultProps = Text.defaultProps || {};
        Text.defaultProps.allowFontScaling = true;
        const { navigation } = this.props
        const { showedItems, searchBarIsShown } = this.state
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
                        containerStyle={{width: '100%'}}
                        onChangeText={this._handleSearchTextChanged}
                        onClearText={this._handleHideSearchBarClick}
                        placeholder='Поиск...'
                    />
                }
                <Loader message='Обновление заявок' isLoading={isFetching}>
                  <FlatList
                      style={{flex: 1}}
                      data={showedItems}
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
    mainTicketContainer: {
      width: 10,
      borderBottomLeftRadius: 10, borderTopLeftRadius: 10
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
    agent:{
      fontSize: 20,
      color: 'black'
    },
    amount:{
      fontSize: 18,
      marginTop: 3,
      marginBottom: 5,
      color: Colors.textColor
    },
})
