import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { RootStackParamList } from "../type/type"


type AdminMainScreenProps = NativeStackScreenProps<RootStackParamList,"AdminMainScreen">
const AdminMainScreen = ({navigation}:AdminMainScreenProps) => {
    return(
        <View style={styles.container}>
            <View style={styles.view1}>

                <Text
                    style={styles.text2}
                >ADMIN</Text>

                <TouchableOpacity onPress={()=>navigation.navigate("AddProductScreen")}>
                    <AddProduct 
                        name={'Thêm sản phẩm'} 
                        image={require('../assets/addfood.png')}/>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>navigation.navigate("ListProductScreen")}>
                    <AddProduct 
                        name={'List sản phẩm'} 
                        image={require('../assets/listdrink.png')}/>
                </TouchableOpacity>

                {/* <TouchableOpacity>
                    <AddProduct 
                        name={'Thêm danh mục'} 
                        image={require('../assets/categoryadd.png')}/>
                </TouchableOpacity> */}

            </View>
        </View>
    )
}

const AddProduct = ({name,image}:any) =>{
    return(
            <View style={styles.view2}>
                <Image 
                    source={image}
                    style={{width:80,height:80,borderWidth:0,marginLeft:10}}
                    />
                <Text style={styles.text1}>{name}</Text>
            </View>
    )
}

export default AdminMainScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        borderWidth:0,
        justifyContent:'center',
        alignItems:'center'
    },
    view1:{
        borderWidth:0,
    },
    view2:{
        borderWidth:0,
        width:320,
        height:100,
        flexDirection:'row',
        alignItems:'center',
        elevation:5,
        backgroundColor:'#ffffff',
        borderRadius:5,
        marginVertical:5
    },
    text1:{
        fontSize:25,
        marginLeft:20
    },
    text2:{
        alignSelf:'center',
        fontSize:50,
        fontWeight:'500',
        marginBottom:20
    }
})