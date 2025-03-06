import React, { useState } from "react";
import {Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';

function TextInputItem({image1,image2,placeHolderHint,maxLength,keyboardType,secureTextEntry}:any){
      const [hidepassword,setHidePassword] = useState(secureTextEntry)
    return(
      <View style={styles.container}>
          <View style={styles.containerImage}>
            <Image source={image1} style={styles.imageStyle}/>
          </View>

          <TextInput 
              style={styles.inputStyle} 
              placeholder={placeHolderHint}
              placeholderTextColor={"#ADA4A5"}
              maxLength={maxLength}
              keyboardType={keyboardType}
              secureTextEntry={hidepassword}/>

          <TouchableOpacity onPress={()=>setHidePassword(!hidepassword)}>
            <View style={styles.containerImage}>
              <Image source={image2} style={styles.imageStyle2}/>
            </View>
          </TouchableOpacity>
      </View>
        
    )


}

export default TextInputItem;

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
    flex: 1,
    marginLeft:9,
    color: "#ADA4A5",
    // fontFamily:"Poppins",

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
