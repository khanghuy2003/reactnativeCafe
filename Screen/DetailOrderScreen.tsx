import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Alert, Button, FlatList, StyleProp, StyleSheet, Text, TextStyle, Touchable, TouchableOpacity, View } from "react-native"
import { CartItem, COLOR_RED, RootStackParamList } from "../type/type"
import { SafeAreaView } from "react-native-safe-area-context"
import { useEffect } from "react"
import { getDatabase, ref, update } from "@react-native-firebase/database"
import { useAuth } from "../firebase/AuthContext"


type DetailOrderScreenProps = NativeStackScreenProps<RootStackParamList,'DetailOrderScreen'>
const DetailOrderScreen = ({navigation,route}:DetailOrderScreenProps) =>{
    const {
        orderId,
        name,
        address,
        phone,
        paymentMethod,
        orderItems,
        orderDateTime,
        status,
        totalPaymentOrder
    } = route.params.orderItem

    const {user}:any = useAuth()

    const handleColorStatus = (status: string): StyleProp<TextStyle> => {
        switch (status.toLowerCase()) {
            case "đã hủy": return { color: "red" };
            case "đang xử lý": return { color: "blue" };
            default: return { color: "black" };
        }
    };

    const handleCancelOrder = () => {
        Alert.alert(
          "Xác nhận hủy đơn",
          "Bạn có chắc chắn muốn hủy đơn hàng này không?",
          [
            {
              text: "Không",
              style: "cancel"
            },
            {
              text: "Hủy đơn",
              onPress: async () => {
                try {
                  const db = getDatabase();
                  const userId = user.uid; // <== bạn cần có userId nếu lưu đơn hàng trong node người dùng
                  const orderId = route.params.orderItem.orderId;
      
                  const orderRef = ref(db, `users/${userId}/orders/${orderId}`);
      
                  await update(orderRef, { status: "Đã hủy" });
      
                  Alert.alert("Thành công", "Đơn hàng đã được hủy.");
                  navigation.goBack();
                } catch (error) {
                  console.error("Lỗi khi hủy đơn hàng:", error);
                  Alert.alert("Lỗi", "Không thể hủy đơn hàng. Vui lòng thử lại.");
                }
              }
            }
          ]
        );
      };
      
    

    useEffect(()=>{
        console.log(route.params.orderItem)
    },[])

    return (
        <SafeAreaView style={{flex:1}}>
            <View style={styles.container}>
                <Text style={styles.NameOrder}>Thông tin đơn hàng</Text>
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
                        data={orderItems}
                        renderItem={({ item, index }) => (
                        <View style={styles.row}>
                            <Text style={styles.cellSTT}>{index}</Text>
                            <Text style={styles.cellTenSP}>{item.cartItemName}</Text>
                            <Text style={styles.cellSize}>{item.cartItemSize}</Text>
                            <Text style={styles.cell}>{item.cartItemQuantity}</Text>
                            <Text style={styles.cell}>{item.cartItemTotalPrice.toLocaleString('vi-VN')} đ</Text>
                        </View>
                        )}
                        keyExtractor={(item: CartItem, index: number) => index.toString()}
                    />
                    <Text style={{fontSize:15,marginVertical:3,marginLeft:4,textAlign:'right',fontWeight:500}}>Tổng tiền: {Number(totalPaymentOrder).toLocaleString('vi-VN')}đ</Text>
                </View>

                {/* thong tin nguoi dung dat hang */}
                <View style={{marginLeft:10}}>
                    <Text style={styles.text1}>Thông tin người nhận:</Text>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text style={styles.text3}>ID Đơn hàng: </Text>
                        <Text style={styles.text4}>{orderId}</Text>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text style={styles.text3}>Thời gian đặt hàng: </Text>
                        <Text style={styles.text4}>{orderDateTime}</Text>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text style={styles.text3}>Tên người nhận: </Text>
                        <Text style={styles.text4}>{name}</Text>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text style={styles.text3}>Địa chỉ: </Text>
                        <Text style={styles.text4}>{address}</Text>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text style={styles.text3}>Số điện thoại: </Text>
                        <Text style={styles.text4}>{phone}</Text>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text style={styles.text3}>PTTT: </Text>
                        <Text style={styles.text4}>{paymentMethod}</Text>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text style={styles.text3}>Trạng thái đơn hàng: </Text>
                        <Text style={[
                            handleColorStatus(status.toString()),
                            styles.text4
                            ]}>{status}</Text>
                    </View>
                </View>
                {/* Các button */}
                <View style={{flexDirection:'row',marginTop:20,justifyContent:'space-evenly'}}>
                    {status !== "Đã hoàn thành" && status !== "Đã hủy" && (
                        <>
                            <TouchableOpacity onPress={handleCancelOrder}>
                                <View style={styles.button}>
                                    <Text style={styles.text5}>Hủy order</Text>
                                </View>
                            </TouchableOpacity>

                        </>
                    )}
                    <TouchableOpacity onPress={()=>navigation.goBack()}>
                        <View style={styles.button}>
                            <Text style={styles.text5}>Back</Text>
                        </View>
                    </TouchableOpacity>
                </View>

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
    }
})

export default DetailOrderScreen