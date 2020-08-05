import {  View,
  ScrollView,
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

export const fieldGroupRenderer = (fieldGroup) => {
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
      }
    }catch(err){console.error(err.message)}})

      return(fields[0] ?
              <View style={styles.fieldsContainer}>
                { fields }
                <View style={{marginBottom: 10}}/>
              </View> : null)
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
