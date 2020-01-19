import React, { Component } from 'react'
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native'
import { BlurView } from 'expo-blur';
import { Metrics, Colors } from '../theme'

export default class Loader extends Component {
    render () {
      Text.defaultProps = Text.defaultProps || {};
      //Text.defaultProps.allowFontScaling = false;
        return (
            <View style={{flex: 1}}>
                { this.props.children }
                {
                    this.props.isLoading &&
                    <View style={styles.dialogContainer}>
                        <BlurView tint="light" intensity={50} style={styles.dialog}>
                            <ActivityIndicator color='black' size='large' style={{margin: 5}} />
                            <Text style={{marginRight: 10, color: 'black'}}>{this.props.message}</Text>
                        </BlurView>
                    </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    dialogContainer: {
        position: 'absolute',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    dialog: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: 210,
        height: 50,
        backgroundColor: Colors.accentColor,
        borderRadius: 30,
    }
})
