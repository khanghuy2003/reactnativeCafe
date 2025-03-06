import React from "react";
import {Button, Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import LinearGradient from "react-native-linear-gradient";

function QuantitativeIcon({quantitative}:any){
    return(

            <LinearGradient 
                colors={['#EEA4CE','#C58BF2']} 
                style={styles.container}
                start={{ x: 0, y: 0 }} 
                end={{ x: 1, y: 0 }} >
                
                <View style={styles.containerText}>
                      <Text style={styles.textStyle}>{quantitative}</Text>
                </View>
                
            </LinearGradient>

    )


}

export default QuantitativeIcon;

const styles = StyleSheet.create({
    container:{
       width:48,
       height:48,
       justifyContent:"center",
       borderRadius:14,
       marginTop:15,
       marginLeft:15,
    },
    textStyle:{
        // fontFamily:"Poppins",
        color:"#ffffff",
        alignItems:"center",
    },
    containerText:{
        alignItems:"center"
    }

});
