import { Image, StyleSheet, Text, View } from "react-native";

function InforAcc ({text,image1}:any) {
    return(
        <View style={styles.container}>
            <Image style={styles.image1} source={image1}/>
            <View style={{marginLeft:10,flex:1}}>
                <Text>{text}</Text>
            </View>
            <Image style={styles.image2} source={require('../assets/iconback.png')}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width:'auto',
        height:40,
        borderRadius:16,
        backgroundColor:'#ffffffff',
        alignItems:'center',
        flexDirection:'row',
        marginVertical:7
    },
    image1:{
        width:20,
        height:20,
        borderWidth:0,
        marginLeft:10
    },
    image2:{
        width:20,
        height:20,
        marginRight:10
    }
})

export default InforAcc