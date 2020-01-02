import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { StackNavigator } from 'react-navigation'

import MainScreen from './containers/MainScreen'
import TicketScreen from './containers/TicketScreen'
import TicketsScreen from './containers/TicketsScreen'
import { Colors } from './theme'
import store from './middleware/redux'
import { Provider } from 'react-redux'


const styles = StyleSheet.create({
    back: {
        backgroundColor: Colors.accentColor //Colors.accentColor
    },
    title: { color: 'white' }
})

const Navigation = StackNavigator({
    Main: { screen: MainScreen },
    Ticket: { screen: TicketScreen },
    Tickets: { screen: TicketsScreen }
}, {
    initialRouteName: 'Main',
    navigationOptions: {
        headerStyle: styles.back,
        headerTitleStyle: styles.title,
        headerTintColor: 'white'
    }
})

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Navigation />
            </Provider>
        )
    }
}
