import { Image, StyleSheet, TouchableOpacity, View } from "react-native"

function SocialLoginButton ({logoButton}:any) {
    return(
        <TouchableOpacity>
            <View style={styles.container}>
                <Image source={logoButton} style={{width:20,height:20}}/>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container:{
        width:50,
        height:50,
        borderWidth:0.8,
        alignItems:"center",
        justifyContent:"center",
        borderColor:"#DDDADA",
        borderRadius:14
    }
})

export default SocialLoginButton