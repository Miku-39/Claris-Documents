import React, { Component } from 'react'
import {
  View,
  Text,
  Alert,
  StatusBar,
  ScrollView,
  LayoutAnimation,
  NativeModules,
  Platform,
  TouchableOpacity } from 'react-native'
const { UIManager } = NativeModules;
import { MaterialIcons } from '@expo/vector-icons'

import { connect } from 'react-redux'
import MainComponent from '../components/MainComponent'
import LoginComponent from '../components/LoginComponent'
import Loader from '../components/Loader'
import { login } from '../middleware/redux/actions/Session'
import {  storeCredentials,
          loadCredentials,
          clearStorage  } from '../middleware/utils/AsyncStorage'


UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const headerButtonsHandler = {
    login: () => null
}

@connect(
    store => ({
        session: store.session.toJS()
    }),
    (dispatch) => ({
        login: (user, password) => dispatch(login(user, password))
    })
)

export default class MainScreenContainer extends Component {
    static navigationOptions = ({navigation}) => {
        return ({
            title: 'Документооборот',
            headerRight: (
                <View style={{flexDirection: 'row', paddingRight: 7}}>
                    <TouchableOpacity
                            style={{marginLeft: 14, marginRight: 10}}
                            onPress={() => headerButtonsHandler.login()}>
                        <MaterialIcons name='person' size={28} color='white' />
                    </TouchableOpacity>
                </View>
            )
        })
    }
    state = {}

     componentWillMount() {
         const { session } = this.props
         if (Platform.OS == 'ios')
            LayoutAnimation.easeInEaseOut();
         this.setState({session: session, logout: false})
     }

     componentDidMount(){
       headerButtonsHandler.login = this._handleBarClick
       this._autoLogin()
     }

     _autoLogin = async () => {
       if (Platform.OS == 'ios'){
         LayoutAnimation.spring();
       }
       const { user, password } = await loadCredentials()
       if (user && password){
         this.setState({user, password, wasLogged: true})
         this.props.login(user, password)
       }else{
         this.setState({logged: false, showLogin: true})
       }
     }

     _logout = async (clear) => {
       await clearStorage()
       LayoutAnimation.easeInEaseOut();
       if(clear != 'noClear'){
         this.setState({user: '', password: '', logout: false, logged: false})
       }
     }

     componentWillReceiveProps = async (nextProps) => {
         const { logged, error, userId, roles } = nextProps.session
         const { dispatch } = this.props.navigation
         const { user, password } = this.state
         if (Platform.OS == 'ios'){
           LayoutAnimation.spring();
         }
         if (logged) {
            await storeCredentials(user, password)
            this.setState({ logged: true, showLogin: false, logout: true,
                            session: nextProps.session })
            //dispatch(resetAction)
         }

         if (error) {
             Alert.alert( 'Ошибка', error, [ {text: 'Закрыть', onPress: () => { }} ])
         }
      }

      _handleBarClick = () => {
        if(this.state.logged){
          LayoutAnimation.spring();
          const { showLogin } = this.state;
          this.setState({ showLogin: !showLogin, logout: true });
        }else{
          this.setState({ showLogin: true });
        }
      }

     _handleUserChange = (user) => {
       LayoutAnimation.easeInEaseOut();
       this._logout('noClear');
       this.setState({user, password: '', logged: false, logout: false})
     }

     _handlePasswordChange = (password) => {
       this.setState({password, logged: false, logout: false})
     }

     _handleLogInClick = () => {
         const { user, password } = this.state
         if (!user || !password)
             Alert.alert( 'Ошибка', 'Необходимо заполнить имя пользователя и пароль', [ {text: 'Закрыть', onPress: () => { }} ])
         else if (this.state.logout)
             this._logout()
         else this.props.login(user, password)
     }

    render = () => {
        const { navigate } = this.props.navigation
        const { session, logged, logout } = this.state
        const { user, password, isLogging, showLogin } = this.state
        const logging = this.props.session.isLogging
        return (
          <Loader message='Вход в систему...' isLoading={logging}>
          <View onLayout={() => {LayoutAnimation.easeInEaseOut();}}>
          <ScrollView
              style={{width: '100%', height: '100%', flexDirection: 'column'}}>
          {showLogin &&
          <LoginComponent
              user={user}
              password={password}
              disabled={isLogging}
              logged={logged}
              logout={logout}
              changeUser={this._handleUserChange}
              changePassword={this._handlePasswordChange}
              logIn={this._handleLogInClick}/>}

          {logged &&
          <MainComponent
            openDocuments={(type) => navigate('Tickets', {type: type})}
            addTicket={() => navigate('Service')}
            session={session}/>}
          </ScrollView>
          </View>
          </Loader>
        )
    }
}
