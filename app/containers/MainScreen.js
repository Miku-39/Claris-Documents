import React, { Component } from 'react'
import {
  View,
  Text,
  Alert,
  StatusBar,
  ScrollView,
  LayoutAnimation,
  NativeModules } from 'react-native'
const { UIManager } = NativeModules;

import { connect } from 'react-redux'
import MainComponent from '../components/MainComponent'
import LoginComponent from '../components/LoginComponent'
import * as selectors from '../middleware/redux/selectors'
import { getSession } from '../middleware/redux/selectors'
import { login } from '../middleware/redux/actions/Session'
import {  storeCredentials,
          loadCredentials,
          clearStorage  } from '../middleware/utils/AsyncStorage'


UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

@connect(
    store => ({
        session: getSession(store)
    }),
    (dispatch) => ({
        login: (user, password) => dispatch(login(user, password))
    })
)

export default class MainScreenContainer extends Component {
    static navigationOptions = ({navigation}) => {
        return ({
            title: 'Документооборот'
        })
    }
    state = {}

     componentWillMount() {
         const { session } = this.props
         LayoutAnimation.easeInEaseOut();
         this.setState({session: session})
     }

     componentDidMount = async () => {
       //await clearStorage()
       LayoutAnimation.spring();
       const { user, password } = await loadCredentials()
       console.log(user)
       if (user && password){
         this.setState({user, password})
         this.props.login(user, password)
       }else{
         this.setState({logged: false, showLogin: true})
       }
     }

     componentWillReceiveProps = async (nextProps) => {
         const { logged, error, userId, roles } = nextProps.session
         const { dispatch } = this.props.navigation
         const { user, password } = this.state
         LayoutAnimation.spring();
         if (logged) {
            await storeCredentials(user, password)
            this.setState({logged: true, showLogin: false})
            //dispatch(resetAction)
         }

         if (error) {
             Alert.alert( 'Ошибка', error, [ {text: 'Закрыть', onPress: () => { }} ])
         }
      }

     _handleUserChange = (user) => this.setState({user})

     _handlePasswordChange = (password) => this.setState({password})

     _handleLogInClick = () => {
         const { user, password } = this.state
         if (!user || !password)
             Alert.alert( 'Ошибка', 'Необходимо заполнить имя пользователя и пароль', [ {text: 'Закрыть', onPress: () => { }} ])
         else this.props.login(user, password)
     }

    render = () => {
        const { navigate } = this.props.navigation
        const { session, logged } = this.state
        const { user, password, isLogging, showLogin } = this.state
        return (
          <View onLayout={() => {LayoutAnimation.easeInEaseOut();}}>
          {showLogin &&
          <LoginComponent
              user={user}
              password={password}
              disabled={isLogging}
              changeUser={this._handleUserChange}
              changePassword={this._handlePasswordChange}
              logIn={this._handleLogInClick}/>}
          <ScrollView
              style={{width: '100%', height: '100%', flexDirection: 'column'}}>
          {logged &&
          <MainComponent
            openTickets={(type) => navigate('Tickets', {type: type})}
            session={session}/>}
          </ScrollView>
          </View>
        )
    }
}
