import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { CartItem, COLOR_RED, Order, RootStackParamList } from "../type/type"
import { SafeAreaView } from "react-native-safe-area-context"
import TextInputItem from "../Component/TextInputItem"
import database from '@react-native-firebase/database';
import { useAuth } from "../firebase/AuthContext"
import { useState } from "react"

type OrderFormScreenProps = NativeStackScreenProps<RootStackParamList,'OrderFormScreen'>

const OrderFormScreen = ({navigation,route}:OrderFormScreenProps) =>{

    const {arrayCartItem,totalAmountCart} = route.params
    const {user}:any = useAuth()

    const [nameInput,setNameInput] = useState('')
    const [phoneInput,setPhoneInput] = useState('')
    const [addressInput,setAddressInput] = useState('')

    const getCurrentDateTime = () => {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    }

    const handleOrder = () => {
        const reference = database().ref(`/users/${user.uid}/orders`).push();
        const keyOrderId:any =  reference.key

        const orderObject : Order = {
            orderId: keyOrderId,
            name: nameInput,
            address: addressInput,
            phone: phoneInput,
            paymentMethod: 'Thanh toán khi nhận hàng',
            orderItems:arrayCartItem,
            orderDateTime: getCurrentDateTime(),
            status: 'Đang xử lý',
            totalPaymentOrder:totalAmountCart.toString()
        }

        reference.set(orderObject)
          .then(
            async () => {
                await database().ref(`/users/${user.uid}/cart`).remove()
                navigation.goBack();
            }
        );
    }

    return(
        <SafeAreaView style={{flex:1}}>
                    <View style={styles.container}>
                        <ScrollView>
                        <Text style={styles.NameOrder}>Đặt hàng</Text>
                        <Text style={styles.text1}>Danh sách order:</Text>
                        <View style={{marginHorizontal:5,borderWidth:1}}>
                            {/* Header */}
                            <View style={[styles.row, styles.header]}>
                                <Text style={[styles.cellSTT, styles.headerText]}>STT</Text>
                                <Text style={[styles.cellTenSP, styles.headerText]}>Tên SP</Text>
                                <Text style={[styles.cellSize, styles.headerText]}>Size</Text>
                                <Text style={[styles.cell, styles.headerText]}>Số lượng</Text>
                                <Text style={[styles.cell, styles.headerText]}>Giá</Text>
                            </View>
                            {/* Data */}
                            <FlatList
                                data={arrayCartItem}
                                keyExtractor={item => item.id.toString()}
                                renderItem={({ item, index }) => (
                                <View style={styles.row}>
                                    <Text style={styles.cellSTT}>{index}</Text>
                                    <Text style={styles.cellTenSP}>{item.cartItemName}</Text>
                                    <Text style={styles.cellSize}>{item.cartItemSize}</Text>
                                    <Text style={styles.cell}>{item.cartItemQuantity}</Text>
                                    <Text style={styles.cell}>{item.cartItemTotalPrice.toLocaleString('vi-VN')} đ</Text>
                                </View>
                                )}
                            />
                            <Text style={{fontSize:15,marginVertical:3,marginLeft:4,textAlign:'right',fontWeight:500}}>Tổng tiền: {totalAmountCart.toLocaleString('vi-vn')} đ</Text>
                        </View>

                        {/* Form dien thong tin */}
                        <View style={styles.view1}>
                            <Text style={styles.text1}>Điền thông tin người nhận</Text>
                            <View style={styles.view2}>
                                <TextInputItem placeHolderHint='Tên người nhận' image1={require('../assets/user2.png')} onChangeText={(text:any)=>{setNameInput(text)}}/>
                                <TextInputItem placeHolderHint='Địa chỉ' image1={require('../assets/earth.png')} onChangeText={(text:any)=>{setAddressInput(text)}}/>
                                <TextInputItem placeHolderHint='Số điện thoại' image1={require('../assets/phone.png')} keyboardType={'numeric'} onChangeText={(text:any)=>{setPhoneInput(text)}}/>
                            </View>
                        </View>
        
                        {/* Các button */}
                        <View style={{flexDirection:'row',marginTop:20,justifyContent:'space-evenly'}}>
                            <TouchableOpacity onPress={handleOrder}>
                                <View style={styles.button}>
                                    <Text style={styles.text5}>Xác nhận</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>navigation.goBack()}>
                                <View style={styles.button}>
                                    <Text style={styles.text5}>Back</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        </ScrollView>
                    </View>
                </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    NameOrder:{
            fontSize:30,
            alignSelf:'center'
    },
    container:{
        flex:1,
    },
    text1:{
        fontWeight:800,
        fontSize:15,
        margin:8
    },
    cell: {
        flex: 0.2,
        textAlign: 'center',
        borderWidth:0,
        marginVertical:10
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 0,
    },
    headerText: {
        fontWeight: 'bold',
    },
    header: {
        backgroundColor: '#ddd',
    },
    cellSize:{
        flex: 0.1,
        textAlign: 'center',
        borderWidth:0,
        marginVertical:10
    },
    cellTenSP:{
        flex: 0.4,
        textAlign: 'center',
        borderWidth:0,
        marginVertical:10
    },
    cellSTT:{
        flex: 0.1,
        textAlign: 'center',
        borderWidth:0,
        marginVertical:10
    },
    text3:{
        fontSize:18,
        fontWeight:700
    },
    text4:{
        fontSize:18
    },
    button:{
        borderWidth:0,
        width:90,
        height:40,
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:COLOR_RED
    },
    text5:{
        color:'#ffffff'
    },
    view1:{

    },
    view2:{
        borderWidth:0,
        height:180,
        width:300,
        alignSelf:'center'
    }
})

export default OrderFormScreen