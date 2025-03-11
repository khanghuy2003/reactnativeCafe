import { useEffect, useState } from "react"
import { FlatList, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLOR_RED, Order, RootStackParamList } from "../type/type"
import  database  from "@react-native-firebase/database"
import { useAuth } from "../firebase/AuthContext"
import { NativeStackScreenProps } from "@react-navigation/native-stack"

type OrdersScreenProps = NativeStackScreenProps<RootStackParamList,'OrdersScreen'>

const OrdersScreen=( {navigation}:OrdersScreenProps )=>{
    const {user}:any = useAuth()
    const [orderItem,setOrderItem] = useState<ArrayLike<any>>([])

    useEffect(() => {
        //fetch danh sach order
        const fetchOrderItem = async () => {
            try {
                const reference = database().ref(`/users/${user.uid}/orders`)
                await reference.once('value').then(async (snapshot)=>{
                const data = await snapshot.val()
                    if (data) {
                        const array: Order[] = Object.values(data);
                        setOrderItem(array);
                    } else {
                        console.log('Không lấy được dữ liệu!')
                    }
                })
            } catch (error) {
                console.log('Lỗi khi kết nối CSDL', error)
            }
        }
        fetchOrderItem()
    },[])

    const handleColorStatus = (status: string): StyleProp<TextStyle> => {
        switch (status.toLowerCase()) {
            case "đã hủy": return { color: "red" };
            case "đang xử lý": return { color: "blue" };
            default: return { color: "black" };
        }
    };
    const handleViewDetail = (item:Order) =>{
        console.log('View detail OrderItem id: ', item.orderId)
        navigation.navigate('DetailOrderScreen', {orderItem:item} )
    }

    const renderItem = (item:Order) => {
        return(
            <View style={styles.orderItem}>
                <View style={{borderWidth:0,flex:4,justifyContent:'space-evenly',marginLeft:20}}>
                    <Text>Tên người nhận: <Text style={styles.textNameOrder}>{item.name}</Text></Text>
                    <Text>Thời gian: {item.orderDateTime}</Text>
                    <Text>Trạng thái: 
                        <Text style = {handleColorStatus(item.status.toString())}>
                            <> </>{item.status}
                        </Text>
                    </Text>
                </View>
                <View style={{borderWidth:0,flex:2,alignItems:'center',justifyContent:'center'}}>
                    <TouchableOpacity onPress={()=>handleViewDetail(item)}>
                        <View style={styles.button}>
                            <Text style={styles.textButton}>Chi tiết</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }


    return(
        <SafeAreaView style={{flex:1}}>
            <FlatList
            data={orderItem}
            renderItem={({item}) => renderItem(item)}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{

    },
    orderItem:{
        borderBottomWidth:5,
        borderRightWidth:5,
        borderRadius:8,
        height:85,
        marginHorizontal:7,
        flexDirection:'row',
        marginVertical:5,
        borderColor:'#c7c6c5',
        borderLeftWidth:1,
        borderTopWidth:1
    },
    button:{
        width:70,
        borderWidth:0,
        height:35,
        borderRadius:6,
        backgroundColor:COLOR_RED,
        justifyContent:'center',
        alignItems:'center'
    },
    textButton:{
        color:'#ffffff'
    },
    textNameOrder:{
        fontWeight:800
    }
})

export default OrdersScreen