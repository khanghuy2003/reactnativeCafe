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


type LoginScreenProps= NativeStackScreenProps<RootStackParamList,"LoginScreen">
function LoginScreen({navigation}:LoginScreenProps) {

    const [hidePassword,setHidePassword] = useState(true)
    const [email,setEmail] = useState<string>('')
    const [password,setPassWord] = useState<string>('')
    const [error,setError] = useState('')

    const handleLogin = async () => {
        try {
          await auth().signInWithEmailAndPassword(email, password);
          navigation.navigate('MyTabsScreen');
        } catch (err: any) {
          setError('Email hoặc password không hợp lệ!');
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

            <TouchableOpacity
                onPress={()=>navigation.navigate('AdminLoginScreen')}
                >
                <View style={styles.admin1}>
                    <Text style={{fontSize:17}}>Admin</Text>
                </View>
            </TouchableOpacity>

                {/* Text */}
                <View style={{alignItems:"center", marginTop:40}}>
                    <Text style={styles.textStyle1}>Hey there,</Text>
                    <Text style={styles.textStyle2}>Welcome Back</Text>
                </View>
                
                {/* Input */}
                <View style={styles.inputContainer}>
                    <TextInputItem 
                        image1={require('../assets/email.png')} 
                        image2={null} 
                        placeHolderHint={"Email"}
                        onChangeText={setEmail}/>
                    <TextInputItem 
                        image1={require('../assets/password.png')} 
                        image2={require('../assets/hidepassword.png')} 
                        placeHolderHint={"Password"} 
                        secureTextEntry={hidePassword}
                        onChangeText={setPassWord}/>
                        
                        <TouchableOpacity>
                            <View style={{alignItems:"center",marginTop:3}}>
                                <Text style={styles.textStyles3}>Forgot your password?</Text>
                            </View>
                        </TouchableOpacity>
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
                {/* -------- Or --------- */}
                <View style={{
                        flexDirection:"row",
                        width:315,
                        height:18,
                        justifyContent:"center",
                        alignItems:"center",
                        // marginTop:20
                        }}>
                    <View style={styles.line}></View>
                    <Text style={{marginHorizontal:10}}>Or</Text>
                    <View style={styles.line}></View>
                </View>
                {/* Nut google, facebook  (Social login buttons)*/}
                <View style={{alignItems:"center",marginTop:30,marginBottom:20}}>
                    <View style={styles.socialButtonContainer}>
                            <SocialLoginButton logoButton={require('../assets/logogoogle.png')}/>
                            <SocialLoginButton logoButton={require('../assets/logofacebook.png')}/>
                    </View>
                </View>
                {/* Don’t have an account yet? Register */}
                <View style={{alignItems:"center",marginBottom:10,marginTop:10,flexDirection:"row",justifyContent:"center"}}>
                    <Text style={styles.textStyle1}>Don’t have an account yet? </Text>
                    {/* Dang ki */}
                    <TouchableOpacity onPress={()=> navigation.navigate("RegisterScreen")}>
                        <Text style={{color:"#e95cff"}}>
                            Register
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
            justifyContent:"space-around",
            borderWidth:0
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
            height:160,
            width:315,
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
export default LoginScreen