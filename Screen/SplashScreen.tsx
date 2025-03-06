import { DefaultTheme } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { useEffect } from "react"
import { Image, Text, View } from "react-native"
import { RootStackParamList } from "../type/type"

type SplashScreenProps = NativeStackScreenProps<RootStackParamList,'SplashScreen'>

const SplashScreen = ({navigation} : SplashScreenProps) =>{
    useEffect(()=>{
        const timer = setTimeout( ()=>{navigation.replace('MyTabsScreen')} ,1500)
        return (
            ()=>clearTimeout(timer)
        )
    } , [])

    return(
        <View style={{justifyContent:"center",flex:1,alignItems:"center"}}>
                <Image source={require('../assets/highland.png')} style={{width:150,height:100}} resizeMode="contain"/>
        </View>
    )
}

export default SplashScreen