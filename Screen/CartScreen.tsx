import { useEffect, useState } from "react"
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { CartItem, COLOR_RED, User } from "../type/type"
import { useAuth } from "../firebase/AuthContext"
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';

const CartScreen= () =>{
    const width = useWindowDimensions().width
    const height = useWindowDimensions().height
    const {user}:any = useAuth()

    const [totalAmountCart,setTotalAmountCart] = useState<number>(0)
    const [cartItem,setCartItem] = useState<ArrayLike<any>>([])

    
    useEffect(()=>{

        //check login
        if(user===null){
            return
        }

        const fetchCartItem = () => {
            const reference = database().ref(`/users/${user.uid}/cart`)
            reference.on('value',async (snapshot) => {
                try {
                    const data = snapshot.val()
                    const cartItemArray:CartItem[] = Object.values(data)

                    if (!data) {
                        console.log("No cart data found");
                        setCartItem([]);
                        setTotalAmountCart(0);
                        return;
                      }
        
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
                } catch (error) {
                    console.log('Lay du lieu khong thanh cong!',error)
                }
                
            });
    
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

    const handleOrderCart = () =>{
        console.log('OrderCart')
    }

    const handleDeleteItem = (id: string ) =>{
        console.log('delete CartItem id = ',id)
    }

    return(
        <SafeAreaView style={{flex:1,marginBottom:0}}>
            <View style = {styles.container}>

                    <View style={[styles.body,{height:height*0.8}]}>
                        {/* flatlist */}
                        <FlatList
                            data={cartItem}
                            renderItem={({item}:any) => 
                                <View style={[styles.cartItemContainer,{width:'auto',height:height*0.14}]}>
                                    <Image source={{ uri: item.cartItemImageUrl }} style={[styles.ImageStyles,{width:height*0.14-10}]}/>
                                    <View style={styles.inforCartItem}>
                                        <Text style={styles.NameCartItem}>{item.cartItemName}</Text>
                                        <Text>Size: {item.cartItemSize}</Text>
                                        <Text>Số lượng: {item.cartItemQuantity}</Text>
                                        <Text>Thành tiền: {item.cartItemTotalPrice.toLocaleString('vi-VN')} đ</Text>
                                    </View>
                                    <View style={styles.viewDelete}>
                                        <TouchableOpacity onPress={()=> handleDeleteItem(item.cartItemId)}>
                                            <View style={styles.buttonDelete}>
                                                <Text style={{fontWeight:700,color:'#ffffff'}}>Xóa</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            }
                            keyExtractor={item => item.cartItemId}
                        />
                    </View>

                <View style={[styles.bottom,{height:height*0.1}]}>
                    <View style={styles.textTotalAmountCart}>
                        <Text style={{marginLeft:27,fontSize:20}}>Tổng: {totalAmountCart.toLocaleString('vi-VN')} đ</Text>
                    </View>
                    <TouchableOpacity style={styles.button} onPress={handleOrderCart}>
                        <View>
                            <Text style={{fontSize:20,color:'white',fontWeight:800}}>Đặt hàng!</Text>
                        </View>
                    </TouchableOpacity>
                </View>

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
    }
})

export default CartScreen