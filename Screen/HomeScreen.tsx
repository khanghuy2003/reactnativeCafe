import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, Touchable, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import database from "@react-native-firebase/database";
import storage from '@react-native-firebase/storage';
import { SearchBar } from 'react-native-screens';
import SearchBarItem from '../Component/SearchBarItem';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Category, COLOR_RED, Product, RootStackParamList } from '../type/type';
import ADBanner from '../Component/ADBanner';


type HomeScreenProps = NativeStackScreenProps<RootStackParamList,'HomeScreen'>

function HomeScreen({navigation}:HomeScreenProps) {

    const windowWidth = useWindowDimensions().width
    const windowHeight = useWindowDimensions().height


    const [categories, setCategories] = useState<Category[]> ([]);
    const [product,setProduct] = useState<Product[]> ([]);


// fetch Category
const fetchCategories = async () => {
    const reference = database().ref("/category");
        reference.once("value").then(async (snapshot) => {
            const data = snapshot.val();
            const categoryArray: Category[] = Object.values(data);

            // chuyển path fireStorage thành link
            const updatedCategories = await Promise.all(
                categoryArray.map(async (item) => {
                    const imageUrl = await getImageURL(item.imageURL_category);
                    return { ...item, imageURL_category: imageUrl };
                })
            );

            setCategories(updatedCategories as Category[]);
        });
    };



    //fetch product
    const fetchProduct = async (id_category: number) => {
        const reference = database().ref('/products')
        reference.once('value').then(async ( snapshot ) => {
            const data = snapshot.val()
            const productArray : Product[] = Object.values(data)

            //lọc sản phẩm theo id_category
            const filterProductCategory = id_category === 0
            ? productArray //nếu bằng 0 thì load hết sp
            : productArray.filter( (item) => item.product_categoryid === id_category )

            //chuyển đường dẫn thư mục trong firestorage thành link
            const updateProduct = await Promise.all(
                filterProductCategory.map(async (item) => {
                    const image_url = await getImageURL(item.product_imageurl)
                    return {...item, product_imageurl : image_url}; 
                })
            )

            setProduct(updateProduct as Product[])
        })
    }


  useEffect(() => {
    
    fetchProduct(0);
    fetchCategories();

  }, []);



  const getImageURL = async (path: string) => {
    try {
      const url = await storage().ref(path).getDownloadURL();
      return url;
    } catch (error) {
      console.error("Error getting image URL:", error);
      return null;
    }
  };



  const renderItemCategory = ({ item } : any ) => (
    <TouchableOpacity onPress={()=>{
            console.log("load products by category",item.id_category)
            fetchProduct(Number(item.id_category))
        }}>
        <View style={styles.categoryItem}>
            <View> 
                <Image
                    source={{ uri: item.imageURL_category }}
                    style={styles.image}
                    resizeMode='cover'
                />
            </View>
            
            <View style={{width:80,alignItems:'center',marginTop:5}}>
                <Text style={{fontSize:13,marginTop:4,fontWeight:600}}>{item.name_category}</Text>
            </View>
            
        </View>
    </TouchableOpacity>
  );



// load san pham theo id_category
  const renderItemProductByCategory = ({item,id_category}:any) => {

  }

  const formatNumber = (num: number) => {
    return num.toLocaleString("vi-VN"); // "vi-VN" là định dạng Việt Nam
  };



  const renderItemProduct = ({ item } : any) => (
    <TouchableOpacity onPress={()=>{
        navigation.navigate('DetailProductScreen',{ product_id : item.product_id })
    } }>
        <View style ={styles.itemProductStyles}>
            <View style ={ {height:"60%"}}> 
                <Image 
                    source={{ uri: item.product_imageurl }}
                    style = { styles.ImageProductStyles}/>
            </View>
            
            <View style = {{alignItems:"center",height:20,marginTop:8}}>
                <Text style={{fontSize:13}}>{item.product_name}</Text>
            </View>

            <View style={{backgroundColor:'#f2e3d5',borderRadius:20,bottom:0,position:'absolute',alignSelf:"center",marginBottom:7,paddingHorizontal:6,paddingVertical:1}}>
                <Text style={{color:COLOR_RED}}>{formatNumber(item.product_price)}đ</Text>
            </View>
            
        </View> 
    </TouchableOpacity>
  );



  return (
    <SafeAreaView style={styles.container}>
    <ScrollView keyboardShouldPersistTaps="handled">

        <View style={{alignItems:'center'}}>
        <Text>Xin chào!!</Text>
        {/* SearchBar */}
            <SearchBarItem/>
            <View>
                <View style={{alignSelf:"flex-start",marginLeft:10,marginTop:5}}><Text style={{fontWeight:900}}>Danh mục</Text></View>
                {/* Flatlist danh mục category */}
                <View style={{height:120}}>
                    <FlatList
                        data={categories}
                        renderItem={renderItemCategory}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal={true}
                    />
                </View>
            </View>

                {/* Banner quang cao */}
                <ADBanner/>

        <View>
                <View style={{alignSelf:"flex-start" , marginLeft:5, marginTop:5}}><Text style={{fontWeight:900}}>Danh sách sản phẩm</Text></View>
                {/* Flatlist sản phẩm */}
                <View style={{width:(115*3)+10}}>
                    <FlatList
                        data={product}
                        renderItem={renderItemProduct}
                        keyExtractor={ (item,index) => index.toString()}
                        numColumns={3}
                    />
                </View>
        </View>

        </View>

    </ScrollView>
    </SafeAreaView>
    
  );
}



const styles = StyleSheet.create({
    container:{
        // backgroundColor:'#fffff5',
        // backgroundColor:'#ADA4A5',
        flex:1,
    },
    categoryItem: {
        width:72,
        height:100,
        flexDirection: "column",
        alignItems: "center",
        padding: 10,
        borderWidth:1,
        borderRadius:13,
        margin:2,
        backgroundColor:"#ffffff",
        elevation:0,
        marginTop:10,
        borderColor:"#b6b8b6"
    },
    image: {
      width: 50,
      height: 50,
      marginRight: 10,
      marginLeft:14
    },
    itemProductStyles:{
        width:115,
        height:160,
        borderWidth:1,
        borderRadius:15,
        backgroundColor:"#ffffff",
        // elevation:5,
        marginTop:4,
        borderColor:"#b6b8b6",
        margin:2,
    },
    ImageProductStyles:{
        width:"100%",
        height:"100%",
        borderTopLeftRadius:15,
        borderTopRightRadius:15

    }

})

export default HomeScreen;
