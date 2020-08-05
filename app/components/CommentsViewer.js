import React, { Component } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  NativeModules
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Colors } from '../theme'

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export default class CommentsViewer extends Component {
  constructor(props) {
    super(props);
      this.state = {
        comments: this.props.comments,
        showComments: false
      }
  }

  render () {
    const commentsRenderer = (comment) => {
      try {
      comments.document = null
      console.log(comment)
      if(comment.comment || comment.description){
        var first; var second; var last;

        switch(this.props.type){
            case "documents":
              first = comment.author.name ? comment.author.name : "";

              second = comment.comment

              last = comment.date.substring(0, 10) +
              (comment.agreed ? ", Не согласовано" : ", Согласовано");

              break;

          case "tasks":
            first = comment.author.name ? comment.author.name : "";

            second = comment.description

            last = "Затрачено часов: " + comment.duration

            break;
        }
        return(
                <View style={styles.fieldsContainer}>
                  <View>
                    <Text style={styles.fieldTitle}>
                      {first}
                    </Text>
                    <Text style={styles.field}>
                      {second}
                    </Text>
                    <Text style={styles.fieldTitle}>
                      {last}
                    </Text>
                  </View>
                  <View style={{marginBottom: 10}}/>
                </View>
        )
      }
    }catch(err){console.log(err.message)}
      return(null)
    }

    var commentsRender = []
    const { comments } = this.state

    comments.forEach((comment) => {
      commentsRender.push(commentsRenderer(comment))
    })

    return (
        <View style={styles.mainContainer}>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    LayoutAnimation.easeInEaseOut();
                    this.setState({showComments: !this.state.showComments})
                  }}>
                      <View style={styles.buttonLabelContainer}>
                        <Text style={[styles.field,
                           {marginBottom: 10,
                            marginRight: 5}]}>
                           Комментарии</Text>
                      </View>
                </TouchableOpacity>
            </View>
            {this.state.showComments &&
            <View>
              <View style={{marginBottom: 10}}/>
              { commentsRender }
            </View>}
        </View>
    )
  }
}const styles = StyleSheet.create({
    mainContainer:{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      marginBottom: 10,
      width: "100%"
    },
    fieldsContainer: {
      backgroundColor: Colors.fieldsColor,
      borderRadius: 20,
      marginBottom: 10,
      borderWidth: 5,
      borderColor: Colors.accentColor,
      alignSelf: 'center',
      width: "95%"
    },
    fieldTitle: {
      marginLeft: 10,
      marginTop: 10,
      fontSize: 18,
      color: Colors.textColor
    },
    field: {
      marginLeft: 10,
      marginTop: 10,
      fontSize: 20
    },
    buttonsContainer: {
      width: '100%',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      flexDirection: 'row'
    },
    button: {
      height: 60,
      width: '95%',
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.buttonColor
    },
    buttonLabelContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    }
})
