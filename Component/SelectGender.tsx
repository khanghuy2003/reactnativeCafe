import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { Image, StyleSheet, View } from "react-native";

function SelectGender(){
    const [selectedGender, setSelectedGender] = useState("");
    return(
        <View style={styles.container}>
            <View style={styles.image1ContainerStyles}>
                <Image source={require('../assets/2user.png')}/>
            </View>

            <View style={{justifyContent:"center"}}>
                <Picker
                    selectedValue={selectedGender}
                    onValueChange={(itemValue) => setSelectedGender(itemValue)}
                    style={styles.picker}>
                    <Picker.Item label="Choose Gender" value="" />
                    <Picker.Item label="Male" value="male" />
                    <Picker.Item label="Female" value="female" />
                    <Picker.Item label="Other" value="other" />
                </Picker>
            </View>
                
            
        </View>
    )
}

export default SelectGender

const styles = StyleSheet.create({
    container:{
        backgroundColor:"#F7F8F8",
        height:48,
        width:315,
        borderRadius:14,
        marginTop:12,
        flexDirection:"row",

    },
    image1ContainerStyles:{
        height:48,
        width:48,
        justifyContent:"center",
        alignItems: "center", 
    },
    picker:{
        marginLeft:-7,
        height:56,
        width:255,
        color:"#ADA4A5"
    }
})