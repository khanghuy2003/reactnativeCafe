import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native"
import { CartItem, COLOR_RED, Product, RootStackParamList } from "../type/type"
import { SafeAreaView } from "react-native-safe-area-context"
import { useEffect, useState } from "react"
import ButtonItem from "../Component/ButtonItem"
import database from "@react-native-firebase/database";
import storage from '@react-native-firebase/storage';
import { useAuth } from "../firebase/AuthContext"
import Toast from 'react-native-toast-message';

type DetailProductScreen = NativeStackScreenProps<RootStackParamList,"DetailProductScreen">


const DetailProductScreen = ({navigation , route}:DetailProductScreen) => {
    const {product_id} = route.params
    const {user}:any = useAuth()
    const [isProcessingATC,setIsProcessingATC] = useState(false)

    const [productObject,setProductObject] = useState({
        product_categoryid: 0,
        product_id: product_id,
        product_imageurl: '',
        product_name: '',
        product_price: 0,
        product_salescount: 0
    })

    const fetchDataProduct = () => {
        const reference = database().ref(`/products/${product_id}`)
        reference.once('value')
        .then((snapshot)=>{
            if(snapshot.exists()){
                const productData = snapshot.val()
                setProductObject(productData)
                setPriceProduct(productData.product_price)
            }
        })
        .catch(error => {console.log('Lỗi lấy dữ liệu!',error)})
    }

    const width = useWindowDimensions().width
    const [sizePressed_S,setSizePressed_S] = useState(true)
    const [sizePressed_M,setSizePressed_M] = useState(false)
    const [sizePressed_L,setSizePressed_L] = useState(false)
    
    const [quantity,setQuantity] = useState<number> (1)
    const [size,setSize] = useState<string>('S')
    const [priceProduct,setPriceProduct] = useState<number>(0)
    const [totalAmount,setTotalAmount] = useState<number>(priceProduct)

    const [imageURL, setImageURL] = useState<string | null>(null);

    const handleChangeInputQuantity = (text: string) => {
        let number = parseInt(text, 10);
        if (isNaN(number) || text.trim() === "") {
          setQuantity(1);
        }
        else {
          setQuantity(number);
        }
      };

    const handlePressSize = (size: string) => {
        setSizePressed_S(size === 'S');
        setSizePressed_M(size === 'M');
        setSizePressed_L(size === 'L');
        setSize(size)
        return size
      };

      const getImageURL = async (path: string) => {
        try {
            const url = await storage().ref(path).getDownloadURL();
            return url;
        } catch (error) {
            console.error("Error getting image URL:", error);
            return null;
        }
    };

    const formatNumber = (num: number) => {
        return num.toLocaleString("vi-VN"); 
    };
    

    const increaseQuantity = () => setQuantity ( quantity + 1 )

    const decreaseQuantity = () => {quantity > 1 ? setQuantity ( quantity - 1 ) : quantity}

    useEffect(()=>{
        const fetchImage = async () => {
            if (productObject.product_imageurl) {
                const url = await getImageURL(productObject.product_imageurl);
                setImageURL(url);
            }
        };
        
        fetchDataProduct()
        fetchImage();

    },[productObject.product_imageurl])

    useEffect(()=>{
        setTotalAmount(priceProduct*quantity)
    })

    useEffect(()=>{
        if(sizePressed_S){
            setPriceProduct(productObject.product_price)
        }else if(sizePressed_M){
            setPriceProduct(productObject.product_price+7000)
        }else{
            setPriceProduct(productObject.product_price+14000)
        }
    },[handlePressSize])


    //khi nhấn addtocart
    const handleAddToCart = () =>{
        setIsProcessingATC(true)
        const reference = database().ref(`/users/${user.uid}/cart`)
        reference.once(`value`).then((snapshot) => {
            const data = snapshot.val()
            let found:boolean = false

            if(data){
                Object.keys(data).forEach((key)=>{
                    const item:CartItem = data[key]
                    //kiem tra cung sp cung size
                    if(item.cartItemId === productObject.product_id && item.cartItemSize === size){
                        found = true;
                        const updateCartItemQuantity = quantity + item.cartItemQuantity
                        const updateCartItemAmount = totalAmount + item.cartItemTotalPrice
                        //update cartItem
                        reference.child(key)
                        .update({
                                cartItemQuantity:updateCartItemQuantity,
                                cartItemTotalPrice:updateCartItemAmount
                            })
                        .then(()=>{

                            Alert.alert('Thông báo', 'Update sp trong giỏ hàng thành công!', [
                                {text: 'OK'},
                              ]);
                              setIsProcessingATC(false)

                        })
                    } 
                })
            }

            if(!found){
                addNewCartItem()
            }

        })
    }
    //nếu chưa có sản phẩm và size thì thêm một CartItem mới
    const addNewCartItem = () => {
        const reference = database().ref(`/users/${user.uid}/cart`).push()
        const keyRef:any = reference.key
        const cartItemObject:CartItem = {
            id: keyRef,
            cartItemId: productObject.product_id.toString(),
            cartItemName: productObject.product_name.toString(),
            cartItemQuantity: quantity,
            cartItemSize: size,
            cartItemTotalPrice: totalAmount,
            cartItemImageUrl: productObject.product_imageurl,
        }
        //insert vao firebase
        reference.set(cartItemObject)
        .then(() => {
            Alert.alert('Thông báo', 'Thêm mới sp vào giỏ hàng thành công!', [
                {text: 'OK'},
            ]);
            setIsProcessingATC(false)
        });
    }

    return(
        <SafeAreaView style={{flex:1}}>

            <ScrollView>
            <View style={{flex:1,alignItems:"center"}}>

                <View style={{ position: 'relative' }}>
                    <Image 
                    source={imageURL ? { uri: imageURL } : require('../assets/test.png')}
                    style={{
                        width: width * 0.9,
                        height: width * 0.9,
                        margin: 10,
                        marginTop: 10,
                        borderRadius: 15,
                    }}
                    resizeMode="cover"
                    />
                    
                    {/* Icon ở góc */}
                    <TouchableOpacity style={styles.icon} onPress={() => navigation.goBack()}>
                        <Image
                            source={require('../assets/iconback.png')}
                            style={{ width: 40, height: 40, tintColor: 'black' }} // Đổi màu icon sang trắng nếu cần
                        />
                    </TouchableOpacity>
                </View>


                {/* Tieu de, gia san pham */}
                <View style={{width:width*0.9,flexDirection:'row',height:50}}>
                    <View style={{width:'70%'}}>
                        <Text style={{fontSize:20}}>{productObject.product_name}</Text>
                    </View>
                    <View style={{width:'30%',alignItems:'center',justifyContent:'center',borderRadius:30,height:40,backgroundColor:'#ffffff'}}>
                        <Text style={{fontSize:20,color:COLOR_RED,fontWeight:'500'}}>{formatNumber(priceProduct)}đ</Text>
                    </View>
                </View>

                {/* Chon size */}
                <View style={{width:width*0.9,height:80,marginTop:10}}>
                    <Text style={{marginLeft:5,fontSize:15}}>Size:</Text>
                    <View style={{flexDirection:'row',justifyContent:'center'}}>

                        <TouchableOpacity onPress={()=>{handlePressSize('S')}}>
                            <View style={[
                                styles.SizeStyles,
                                {
                                    backgroundColor:sizePressed_S? COLOR_RED : '#ffffff',
                                }
                                ]}>
                                <Text style={[styles.textSize,{color:sizePressed_S? '#ffffff': COLOR_RED,}]}>Small</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=>{handlePressSize('M')}}>
                            <View style={[
                                styles.SizeStyles,
                                {
                                    backgroundColor:sizePressed_M? COLOR_RED : '#ffffff',
                                }
                                ]}>
                                <Text style={[styles.textSize,{color:sizePressed_M? '#ffffff': COLOR_RED,}]}>Medium</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=>{handlePressSize('L')}}>
                            <View style={[
                                styles.SizeStyles,
                                {
                                    backgroundColor:sizePressed_L? COLOR_RED : '#ffffff',
                                }
                                ]}>
                                <Text style={[styles.textSize,{color:sizePressed_L? '#ffffff': COLOR_RED,}]}>Large</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* So luong */}
                <View style={{width:width*0.9,height:80,marginTop:10}}>
                    <Text style={{marginLeft:5,fontSize:15,}}>Số lượng:</Text>
                    <View style={{flexDirection:'row',justifyContent:'center'}}>

                        <TouchableOpacity onPress={increaseQuantity}>
                            <View style={styles.buttonQuantityStyles}>
                                <Text style={{fontSize:25,color:'#ffffff'}}>+</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity>
                            <View style={styles.TextInputQuantity}>
                                <TextInput maxLength={2} keyboardType="numeric" defaultValue={quantity.toString()} onChangeText={handleChangeInputQuantity}/>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={decreaseQuantity}>
                            <View style={styles.buttonQuantityStyles}>
                                <Text style={{fontSize:25,color:'#ffffff'}}>-</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{width:width*0.9,height:30,marginTop:10,flexDirection:'row'}}>
                    <Text style={{fontSize:20,fontWeight:'500'}}>Tổng tiền:  </Text>
                    <Text style={{fontSize:20,fontWeight:'500'}}>{formatNumber(totalAmount)}đ</Text>
                </View>
                {/* Button add to cart */}
                {
                    (user!=null)
                    ?
                    (
                        (isProcessingATC)
                        ?
                        (<View style={styles.view2}>
                            <ActivityIndicator size="large"/>
                        </View>)
                        :
                        (<TouchableOpacity onPress={handleAddToCart}>
                            <View style={{marginTop:10,}}>
                                <ButtonItem textButton={'Thêm vào giỏ hàng  '} iconButton={require('../assets/addtocart.png')} tintColor={'white'}/>
                            </View>
                        </TouchableOpacity>)
                    )
                    :
                    (<View style={styles.view1}>
                        <Text style={styles.text1}>Bạn cần phải đăng nhập để thêm sp vào giỏ hàng!</Text>
                    </View>)
                }
                

            </View>
        </ScrollView>
        </SafeAreaView>
    )
}

const styles=StyleSheet.create({
    SizeStyles:{
        borderWidth:1,
        width:80,
        height:40,
        margin:5,
        borderRadius:10,
        alignItems:'center',
        justifyContent:'center',
    },
    textSize:{
        fontWeight:'800'
    },
    buttonQuantityStyles:{
        width:50,
        height:40,
        borderRadius:10,
        backgroundColor:COLOR_RED,
        alignItems:'center',
        justifyContent:'center',
        margin:5
    },
    TextInputQuantity:{
        borderWidth:1,
        width:50,
        height:40,
        borderRadius:10,
        alignItems:'center',
        justifyContent:'center',
        margin:5
    },
    icon: {
        width: 40,
        height: 40,
        position: 'absolute', 
        top: 20, 
        left: 20, 
      },
      view2:{
        borderWidth:0,
        width:300,
        height:50,
        justifyContent:'center'
      },
      view1:{
        borderWidth:0,
        marginTop:20,
        width:'auto',
        justifyContent:'center'
      },
      text1:{
        textAlign:'center',
        fontStyle:'italic'
      }
})

export default DetailProductScreen