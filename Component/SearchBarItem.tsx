import { Image, StyleSheet, Text, TextInput, View } from "react-native";

const SearchBarItem = () => {
    return (
        <View style={styles.container}>
            <View>
                <Image source={require('../assets/iconsearch2.png')} style={{width:20,height:20,margin:5,marginLeft:8}}/>
            </View>
            <View>
                <TextInput placeholder="Tìm kiếm" style = {{width:250}}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flexDirection:"row",
        borderWidth:1,
        backgroundColor:"#ffffff",
        alignItems:"center",
        borderRadius:30,
        width:300,
        elevation:0
    }
})

export default SearchBarItem;