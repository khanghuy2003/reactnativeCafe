import React, { useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, Touchable, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import TextInputItem from "../Component/TextInputItem";
import ButtonItem from "../Component/ButtonItem";
import SocialLoginButton from "../Component/SocialLoginButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../type/type";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';
import { getDatabase } from '@react-native-firebase/database';
import { getStorage } from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

type AdminLoginScreenProps= NativeStackScreenProps<RootStackParamList,"AdminLoginScreen">
function AdminLoginScreen({navigation}:AdminLoginScreenProps) {

    const [hidePassword,setHidePassword] = useState(true)
    const [adminName,setAdminName] = useState<string>('')
    const [password,setPassWord] = useState<string>('')
    const [error,setError] = useState('')


    const handleLogin = async () => {
        
            try {
                database().ref(`/admin`).once('value').then(async (snapshot) => {
                    const admin = snapshot.val()
                    if(admin.admin === adminName && admin.password === password){
                        navigation.navigate('AdminMainScreen')
                    }else{
                        setError("Sai tài khoản hoặc mật khẩu!")
                    }
                })
            } catch (error) {
                console.log('error')
            }
        
      };
      
      

    return(
    <SafeAreaView style={{flex:1}}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex:1}}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">


            <View style={styles.container}>
            {/* 2 dòng chữ và 2 ô input */}
            <View >
                {/* Text */}
                <View style={{alignItems:"center", marginTop:40}}>
                    <Text style={styles.textStyle2}>Admin Login</Text>
                </View>
                
                {/* Input */}
                <View style={styles.inputContainer}>
                    <TextInputItem 
                        image1={require('../assets/email.png')} 
                        image2={null} 
                        placeHolderHint={"Tên đăng nhập"}
                        onChangeText={setAdminName}/>
                    <TextInputItem 
                        image1={require('../assets/password.png')} 
                        image2={require('../assets/hidepassword.png')} 
                        placeHolderHint={"Mật khẩu"} 
                        secureTextEntry={hidePassword}
                        onChangeText={setPassWord}/>
                </View>

                <View style={{width:'auto',alignItems:'center',marginTop:10}}>
                    {error ? <Text style={styles.error}>{error}</Text> : null}
                </View>
                
            </View>



            {/* Còn lại */}
            <View>
                {/* Button */}
                <View style={{marginBottom:30}}>
                    <TouchableOpacity onPress={handleLogin}>
                        <ButtonItem 
                            textButton={"Login"} 
                            iconButton={require('../assets/iconlogin.png')}/>
                    </TouchableOpacity>
                </View>
                
                {/* Don’t have an account yet? Register */}
                <View style={{alignItems:"center",marginBottom:10,marginTop:10,flexDirection:"row",justifyContent:"center"}}>
                    <Text style={styles.textStyle1}>Quay lại màn hình </Text>
                    {/* Dang ki */}
                    <TouchableOpacity onPress={()=> navigation.navigate("LoginScreen")}>
                        <Text style={{color:"#e95cff"}}>
                            Đăng nhập khách hàng
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>

                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    </SafeAreaView>
        
    )
}


    const styles= StyleSheet.create({
        scrollContainer:{ 
            flex:1,
            flexGrow: 1, 
        },
        container:{
            flex:1,
            alignItems:"center",
            backgroundColor:"#ffffff",
            // justifyContent:"space-around",
            borderWidth:0,
            justifyContent:'center'
        },
        textStyle1:{
            // fontFamily:"Poppins",
            fontWeight:"400",
            fontSize:16,
            lineHeight:24,
        },
        textStyle2:{
            // fontFamily:"Poppins",
            fontWeight:"700",
            fontSize:20,
            lineHeight:30
        },
        textStyles3:{
            alignItems:"center",
            fontSize:14,
            lineHeight:18,
            fontWeight:"500",
            color:"#ADA4A5",
            fontFamily:"Poppins",
            textDecorationLine:"underline",
            textDecorationStyle:"solid",
            marginTop:10

        },
        inputContainer:{
            height:130,
            width:315,
            marginBottom:30
        },
        line:{
            borderWidth:0.5,
            height:1,
            flex:1,
            borderColor:"#DDDADA"
        },
        socialButtonContainer:{
            flexDirection:"row",
            width:130,
            justifyContent:"space-between",
        },
        error: {
            color: 'red',
            marginBottom: 10,
          },
          admin1:{
            borderWidth:0,
            width:80,
            height:40,
            borderRadius:5,
            backgroundColor:'#f2f2f2',
            justifyContent:'center',
            alignItems:'center',
            alignSelf:'flex-end'
          }
    })
export default AdminLoginScreen