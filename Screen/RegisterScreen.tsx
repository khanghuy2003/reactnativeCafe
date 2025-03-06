import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TextInputItem from "../Component/TextInputItem";
import ButtonItem from "../Component/ButtonItem";
import SocialLoginButton from "../Component/SocialLoginButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../type/type";
import { useState } from "react";

type RegisterScreenProps = NativeStackScreenProps<RootStackParamList,'RegisterScreen'>

function RegisterScreen({navigation}:RegisterScreenProps){
    //accept Privacy Policy and Term of Use
    const [accept,setAccept] = useState(false)
    const [hidePassword,setHidePassword] = useState(true)

    return(
        <SafeAreaView style={{flex:1}}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex:1}}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>


                <View style={styles.container}>
                    <View>
                        {/* Text */}
                        <View style={{alignItems:"center", marginTop:40}}>
                            <Text style={styles.textStyle1}>Hey there,</Text>
                            <Text style={styles.textStyle2}>Create an Account</Text>
                        </View>

                        {/* Input */}
                        <View style={styles.inputContainerStyle}>
                            <TextInputItem image1={require('../assets/name.png')} placeHolderHint={"First Name"}/>
                            <TextInputItem image1={require('../assets/name.png')} placeHolderHint={"Last Name"}/>
                            <TextInputItem image1={require('../assets/email.png')} placeHolderHint={"Email"}/>
                            <TextInputItem 
                                image1={require('../assets/password.png')} 
                                placeHolderHint={"Password"} 
                                image2={require("../assets/hidepassword.png")} 
                                secureTextEntry={hidePassword}/>
                            <View style={{width:270,height:30,flexDirection:"row",marginTop:10}}>
                                <TouchableOpacity onPress={() => setAccept(!accept)}>
                                    <View style={{width:16,height:16,borderWidth:0.8,borderColor:"#ADA4A5",borderRadius:3,marginRight:10,alignItems:"center",justifyContent:"center"}}>
                                        {accept && 
                                            <View style={{
                                                backgroundColor:"#ADA4A5",
                                                width:9,
                                                height:9,
                                                borderRadius:3,
                                            }}></View>
                                        }
                                    </View>
                                </TouchableOpacity>

                                <Text style={{
                                    // fontFamily:"Poppins",
                                    fontSize:10,
                                    fontWeight:"400",
                                    lineHeight:15,
                                    color:"#ADA4A5"
                                }}>By continuing you accept our Privacy Policy and Term of Use</Text>
                            </View>
                        </View>

                    </View>


                    {/* Còn lại */}
                    <View>
                        {/* Button */}
                        <View style={{marginBottom:30}}>
                            <TouchableOpacity onPress={()=>{navigation.navigate('MyTabsScreen')}}>
                                <ButtonItem 
                                    textButton={"Register"}/>
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
                            <Text style={styles.textStyle1}>Already have an account? </Text>
                            {/* Dang ki */}
                            <TouchableOpacity onPress={()=>navigation.navigate("LoginScreen")}>
                                <Text style={{color:"#e95cff"}}>
                                    Login
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

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#FFFFFF",
        alignItems:"center",
        justifyContent:"space-around"
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
    inputContainerStyle:{
        width:315,
        height:300,
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
    }
})

export default RegisterScreen