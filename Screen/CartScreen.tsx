import { useEffect, useState } from "react"
import { ActivityIndicator, Alert, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { CartItem, COLOR_RED, RootStackParamList, User } from "../type/type"
import { useAuth } from "../firebase/AuthContext"
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import { NativeStackScreenProps } from "@react-navigation/native-stack"

type CartScreenProps = NativeStackScreenProps<RootStackParamList,'CartScreen'>

const CartScreen= ({navigation}:CartScreenProps) => {
    const width = useWindowDimensions().width
    const height = useWindowDimensions().height
    const {user}:any = useAuth()

    const [totalAmountCart,setTotalAmountCart] = useState<number>(0)
    const [cartItem,setCartItem] = useState<ArrayLike<any>>([])
    const [isLoadingCart,setIsLoadingCart] = useState(true)

    const fetchCartItem = () => {
        setIsLoadingCart(true)
        const reference = database().ref(`/users/${user.uid}/cart`)
        reference.on('value', async (snapshot) => {
            try {
                const data = snapshot.val()

                if (!data) { // Nếu giỏ hàng rỗng
                    console.log("No cart data found");
                    setCartItem([]); 
                    setTotalAmountCart(0);
                    setIsLoadingCart(false)
                    return;
                }

                const cartItemArray:CartItem[] = Object.values(data)

                //chuyển đường dẫn thư mục trong firestorage thành link
                const updateCartItem = await Promise.all(
                cartItemArray.map(async (item) => {
                        const image_url = await getImageURL(item.cartItemImageUrl.toString())
                        return {...item, cartItemImageUrl : image_url}; 
                    })
                )

                //tinh tong tien totalAmountCart
                const total = cartItemArray.reduce((sum, item:CartItem )=> sum += item.cartItemTotalPrice ,0)
                
                setTotalAmountCart(total)
                setCartItem(updateCartItem as CartItem[])
                setIsLoadingCart(false)
            } catch (error) {
                console.log('Lay du lieu khong thanh cong!',error)
            }
            
        });
    }
    
    useEffect(()=>{
        //check login
        if(user===null){
            return
        }
        fetchCartItem()
    },[])

    const getImageURL = async (path: string) => {
        try {
          const url = await storage().ref(path).getDownloadURL();
          return url;
        } catch (error) {
          console.error("Error getting image URL:", error);
          return null;
        }
    };

    //xu li khi nhan Dat hang
    const handleOrderCart = () =>{
        navigation.navigate('OrderFormScreen',{
            arrayCartItem: cartItem as CartItem[],
            totalAmountCart: totalAmountCart
        })
    }

    const handleDeleteItem = (id: string ) =>{
        const reference = database().ref(`/users/${user.uid}/cart/${id}`)
        Alert.alert('Thông báo', 'Bạn muốn xóa sp khỏi giỏ hàng?', [
        {
            text: 'Cancel',
            style: 'cancel',
        },
        {
            text: 'Xóa', 
            onPress: async () => {
                await reference.remove()
                fetchCartItem()
            }
        },
        ]);
    }

    // Hàm xử lý tăng số lượng sản phẩm
    const handleIncreaseQuantity = async (item: CartItem) => {
        try {
            // Tăng số lượng lên 1
            const newQuantity = item.cartItemQuantity + 1;
            
            // Tính toán lại tổng giá tiền của sản phẩm
            const unitPrice = item.cartItemTotalPrice / item.cartItemQuantity;
            const newTotalPrice = unitPrice * newQuantity;
            
            // Cập nhật dữ liệu trong Firebase
            const reference = database().ref(`/users/${user.uid}/cart/${item.id}`);
            await reference.update({
                cartItemQuantity: newQuantity,
                cartItemTotalPrice: newTotalPrice
            });
            
            // Không cần gọi fetchCartItem vì listener đã được thiết lập
        } catch (error) {
            console.error("Lỗi khi tăng số lượng:", error);
            Alert.alert("Lỗi", "Không thể cập nhật số lượng sản phẩm.");
        }
    };

    // Hàm xử lý giảm số lượng sản phẩm
    const handleDecreaseQuantity = async (item: CartItem) => {
        try {
            if (item.cartItemQuantity <= 1) {
                // // Nếu số lượng = 1 và giảm nữa thì xóa sản phẩm
                // handleDeleteItem(item.cartItemId.toString());
                return;
            }
            
            // Giảm số lượng đi 1
            const newQuantity = item.cartItemQuantity - 1;
            
            // Tính toán lại tổng giá tiền của sản phẩm
            const unitPrice = item.cartItemTotalPrice / item.cartItemQuantity;
            const newTotalPrice = unitPrice * newQuantity;
            
            // Cập nhật dữ liệu trong Firebase
            const reference = database().ref(`/users/${user.uid}/cart/${item.id}`);
            await reference.update({
                cartItemQuantity: newQuantity,
                cartItemTotalPrice: newTotalPrice
            });
            
            // Không cần gọi fetchCartItem vì listener đã được thiết lập
        } catch (error) {
            console.error("Lỗi khi giảm số lượng:", error);
            Alert.alert("Lỗi", "Không thể cập nhật số lượng sản phẩm.");
        }
    };

    return(
        <SafeAreaView style={{flex:1,marginBottom:0}}>
            <View style = {styles.container}>

                    <View style={[styles.body,{height:height*0.8}]}>
                        {/* flatlist */}
                        {
                            (user===null)
                            ?
                            (<View style={styles.view1}>
                                    <Text>Bạn chưa đăng nhập</Text>
                            </View>)
                            :
                            (
                                (isLoadingCart)
                                ?
                                (<View style={styles.view1}>
                                    <ActivityIndicator size={"large"}/>
                                </View>)
                                :
                                (
                                    (cartItem.length===0)
                                    ?
                                    (<View style={styles.view1}>
                                        <Text>Giỏ hàng trống</Text>
                                    </View>)
                                    :
                                    (<FlatList
                                        data={cartItem}
                                        renderItem={({item}:any) => 
                                            <View style={[styles.cartItemContainer,{width:'auto',height:height*0.16}]}>
                                                <Image source={{ uri: item.cartItemImageUrl }} style={[styles.ImageStyles,{width:height*0.14-10}]}/>
                                                <View style={styles.inforCartItem}>
                                                    <Text style={styles.NameCartItem}>{item.cartItemName}</Text>
                                                    <Text>Size: {item.cartItemSize}</Text>
                                                    
                                                    {/* Bộ điều khiển số lượng */}
                                                    <View style={styles.quantityControl}>
                                                        <TouchableOpacity 
                                                            style={styles.quantityButton}
                                                            onPress={() => handleDecreaseQuantity(item)}
                                                        >
                                                            <Text style={styles.quantityButtonText}>-</Text>
                                                        </TouchableOpacity>
                                                        
                                                        <Text style={styles.quantityText}>{item.cartItemQuantity}</Text>
                                                        
                                                        <TouchableOpacity 
                                                            style={styles.quantityButton}
                                                            onPress={() => handleIncreaseQuantity(item)}
                                                        >
                                                            <Text style={styles.quantityButtonText}>+</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                    
                                                    <Text>Thành tiền: {item.cartItemTotalPrice.toLocaleString('vi-VN')} đ</Text>
                                                </View>
                                                <View style={styles.viewDelete}>
                                                    <TouchableOpacity onPress={()=> handleDeleteItem(item.id)}>
                                                        <View style={styles.buttonDelete}>
                                                            <Text style={{fontWeight:700,color:'#ffffff'}}>Xóa</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        }
                                        keyExtractor={item => item.id }
                                    />)
                                )
                            )
                        }
                    </View>

                {
                    (user!=null && cartItem.length!=0)
                    ?
                    (<View style={[styles.bottom,{height:height*0.1}]}>
                        <View style={styles.textTotalAmountCart}>
                            <Text style={{marginLeft:27,fontSize:20}}>Tổng: {totalAmountCart.toLocaleString('vi-VN')} đ</Text>
                        </View>
                        <TouchableOpacity style={styles.button} onPress={handleOrderCart}>
                            <View>
                                <Text style={{fontSize:20,color:'white',fontWeight:800}}>Đặt hàng!</Text>
                            </View>
                        </TouchableOpacity>
                    </View>)
                    :
                    (null)
                }
                

            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    body:{
        borderWidth:0,
        flexGrow:1,
    },
    bottom:{
        borderWidth:1,
        flexDirection:'row',
        borderRadius:15,
    },
    button:{
        borderWidth:0,
        width:140,
        borderRadius:30,
        backgroundColor:COLOR_RED,
        justifyContent:'center',
        alignItems:"center",
        elevation:0,
        marginVertical:10
    },
    textTotalAmountCart : {
        flex:1,
        borderWidth:0,
        justifyContent:'center',
    },
    cartItemContainer: {
        borderBottomWidth: 0,
        borderEndWidth:5,
        marginHorizontal:10,
        borderRadius:10,
        flexDirection:"row",
        marginVertical:5,
        elevation:0,
        backgroundColor:'#ffffff',
        borderColor:'#dbd9d9'
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    emptyCart: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: 'gray'
    },
    ImageStyles:{
        borderWidth:1,
        borderRadius:10
    },
    inforCartItem:{
        borderWidth:0,
        flex:5,
        marginLeft:10,
        justifyContent:'space-around',
        marginVertical:5
    },
    viewDelete:{
        borderWidth:0,
        flex:1.5,
        justifyContent:'center',
        alignItems:'center',
        marginRight:7
    },
    NameCartItem:{
        fontSize:15,
        fontWeight:900
    },
    buttonDelete:{
        borderWidth:0,
        height:40,
        width:40,
        backgroundColor:COLOR_RED,
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center'
    },
    view1:{
        borderWidth:0,
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    // Styles mới cho bộ điều khiển số lượng
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5
    },
    quantityButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: COLOR_RED,
        justifyContent: 'center',
        alignItems: 'center'
    },
    quantityButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold'
    },
    quantityText: {
        marginHorizontal: 15,
        fontSize: 16,
        fontWeight: 'bold'
    }
})

export default CartScreen