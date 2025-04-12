import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Image, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native"
import { RootStackParamList } from "../type/type"


type AdminMainScreenProps = NativeStackScreenProps<RootStackParamList,"AdminMainScreen">
const AdminMainScreen = ({navigation}:AdminMainScreenProps) => {
    
    const handleLogout = () => {
        Alert.alert(
            "Đăng xuất",
            "Bạn có chắc chắn muốn đăng xuất?",
            [
                {
                    text: "Hủy",
                    style: "cancel"
                },
                {
                    text: "Đồng ý",
                    onPress: () => navigation.navigate("AdminLoginScreen")
                }
            ]
        )
    }
    
    return(
        <View style={styles.container}>
            {/* Logout Button */}
            <TouchableOpacity 
                style={styles.logoutButton}
                onPress={handleLogout}
            >
                <Image 
                    source={require('../assets/logout.png')} 
                    style={styles.logoutIcon}
                />
                <Text style={styles.logoutText}>Đăng xuất</Text>
            </TouchableOpacity>

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

                <TouchableOpacity onPress={() => navigation.navigate("AllOrdersScreen")}>
                    <AddProduct 
                        name={'Hóa đơn'} 
                        image={require('../assets/hoadon.png')}/>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("StatisticsScreen")}>
                    <AddProduct 
                        name={'Thống kê'} 
                        image={require('../assets/bieudo.png')}/>
                </TouchableOpacity>
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
        alignItems:'center',
        position: 'relative'
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
    },
    logoutButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f44336',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
        elevation: 3
    },
    logoutIcon: {
        width: 20,
        height: 20,
        tintColor: '#ffffff'
    },
    logoutText: {
        color: '#ffffff',
        marginLeft: 5,
        fontWeight: 'bold'
    }
})