import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Image, Alert, ActivityIndicator, Touchable, TouchableOpacity } from "react-native";
import database from "@react-native-firebase/database";
import { launchImageLibrary } from "react-native-image-picker";
import { Picker } from "@react-native-picker/picker";
import { Category, Product, RootStackParamList } from "../type/type";
import storage from '@react-native-firebase/storage';
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type AddProductScreenProps= NativeStackScreenProps<RootStackParamList,"AddProductScreen">

const AddProductScreen = ({navigation}:AddProductScreenProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState<number | undefined>(0);
  const [imageUri, setImageUri] = useState<any>(null);
  const [productId,setProductId] = useState('')

  const [uploading, setUploading] = useState(false);
  const [downloadURL, setDownloadURL] = useState(null);

  const [categoryArray,setCategoryArray] = useState<Category[]>([])

  // Chọn ảnh từ thư viện
    const selectImage = () => {
        launchImageLibrary({ mediaType: "photo" }, (response:any) => {
        if (!response.didCancel && !response.error) {
            setImageUri(response.assets[0].uri);
        }
        });
    };


    //Tao id product
    const createProductId = () => {
        const newDatabaseRef = database().ref(`/products`).push()
        const product_id = newDatabaseRef.key
        setProductId(product_id!!)
    }

    const fetchCategoryPicker = () => {
        const reference  = database().ref(`/category`)
        reference.once('value').then((snapshot)=>{
            const data = snapshot.val()
            setCategoryArray(data as Category[])
        })
    }

    useEffect(()=>{
            createProductId() 
            fetchCategoryPicker()
    },[])

    const uploadImage = async () => {
        if (!imageUri) return null;
        setUploading(true);
    
        const pathProduct = `productimage/${name}-${productId}`;
        const storageRef = storage().ref(pathProduct);
    
        try {
            await storageRef.putFile(imageUri);
            return pathProduct;
        } catch (error) {
            console.error("Upload lỗi:", error);
            return null;
        } finally {
            setUploading(false);
        }
    };
    

  // Hàm lưu sản phẩm vào Firebase
  const handleAddProduct = async () => {
    if (!name || !price || !imageUri) {
      Alert.alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setUploading(true);
    try {
        // Gọi uploadImage() và lấy đường dẫn
        const imagePath = await uploadImage();
        if (!imagePath) {
            Alert.alert("Lỗi khi tải ảnh lên!");
            return;
        }

        // Lưu vào Firebase với đường dẫn ảnh
        const newProduct: Product = {
            product_categoryid: category!!,
            product_id: productId.toString(),
            product_imageurl: imagePath,
            product_name: name,
            product_price: price,
            product_salescount: 0,
        };

        await database().ref(`/products/${productId}`).set(newProduct);

        Alert.alert("Thêm sản phẩm thành công!");
        setName("");
        setPrice(0);
        setCategory(0);
        setImageUri(null);
    } catch (error:any) {
        Alert.alert("Lỗi khi thêm sản phẩm:", error.message);
    }

    setUploading(false);
};


  return (
    <View style={{ padding: 20}}>
      <Text 
        style={{
            fontSize:30,
            fontWeight:'500',
            alignSelf:'center',
            marginVertical:30
        }}
      >Thêm sản phẩm</Text>
      <Text >Product id: 
            <Text 
                style={{color:'red'}}
            > {productId}</Text>
      </Text>
      <Text></Text>
      <Text>Tên sản phẩm:</Text>
      <TextInput value={name} onChangeText={setName} placeholder="Nhập tên" style={styles.input} />
      <Text></Text>
      <Text>Giá sản phẩm:</Text>
      <TextInput value={price.toString()} onChangeText={(text)=>setPrice(Number(text))} placeholder="Nhập giá" keyboardType="numeric" style={styles.input} />
      <Text></Text>
      <Text>Chọn danh mục:</Text>
        <Picker
            selectedValue={category}
            onValueChange={(itemValue:number) => setCategory(itemValue)}
        >
            {categoryArray.map((value,index)=>
                <Picker.Item label={value.name_category} value={value.id_category} key={index} />
            )}
        </Picker>

      <Button title="Chọn hình ảnh" onPress={selectImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
        {
        uploading ?
            <View>
                <ActivityIndicator size={"large"}></ActivityIndicator>
            </View>
        :null
        }
        <Text></Text>
      <Button title="Thêm sản phẩm" onPress={handleAddProduct} />

      <TouchableOpacity onPress={()=>navigation.goBack()}>
            <Image 
                style={{height:60,justifyContent:'center',borderWidth:0,width:100,alignSelf:'center',marginTop:20}}
                source={require('../assets/backbtn.png')}
                resizeMode='contain'/>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  input: { borderWidth: 1, padding: 10, marginVertical: 5, borderRadius: 5 },
  picker: { borderWidth: 1, marginVertical: 5 },
  image: { width: 100, height: 100, marginVertical: 10 },
};

export default AddProductScreen;
