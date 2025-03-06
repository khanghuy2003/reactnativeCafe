import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {Alert, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';

function PickBirthDay(){
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(new Date());

    const onChange = (event: any, selectedDate?: Date) => {
      setShow(false);
      if (selectedDate) {
        setDate(selectedDate);
        console.log(selectedDate.toDateString())
      }
     };

    const showDatePicker = () => {
      if (Platform.OS === "android") {
        // Android dùng API `DateTimePickerAndroid`
        DateTimePickerAndroid.open({
          value:date,
          onChange,
          mode: "date",
          display: "calendar",
        });
      } else {
        // iOS hiển thị DatePicker như một component
        setShow(true);
      }
    };

    

    return(
      
            <TouchableOpacity onPress={showDatePicker} style={styles.container}>
              <View style={styles.containerImage} >
                <Image source={require('../assets/calendar.png')} style={styles.imageStyle}/>
              </View>

              <Text
                  style={styles.inputStyle} 
                  > {date ? date.toDateString() : "Chọn ngày"}</Text>

                  {show && Platform.OS === "ios" && (
                          <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => onChange(event, selectedDate)}
                          />
                        )} 
            </TouchableOpacity>  
          
      
    )


}

export default PickBirthDay;

const styles = StyleSheet.create({
  container:{
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor:"#F7F8F8",
    flexDirection: 'row',
    marginTop:15,
    alignSelf: "stretch",

  },
  inputStyle:{
    marginLeft:13,
    color: "#ADA4A5",
    // fontFamily:"Poppins",
    marginTop:13
  },
  imageStyle:{
    width:18,
    height:18,
    marginLeft:15,
  },
  imageStyle2:{
    width:18,
    height:18,
    marginLeft:15,
    marginRight:15
  },
  containerImage:{
    height: 48,
    justifyContent:"center"
  }

});
