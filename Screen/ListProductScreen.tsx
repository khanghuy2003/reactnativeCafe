import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import { Product, RootStackParamList } from '../type/type';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert } from 'react-native';

type ListProductScreenProps = NativeStackScreenProps<RootStackParamList,'ListProductScreen'>

const ListProductScreen = ( {navigation} : ListProductScreenProps ) => {
    const [isLoadingProduct, setIsLoadingProduct] = useState(true);
    const [product, setProduct] = useState<Product[]>([]);

    // Fetch product
    const fetchProduct = async (id_category: number) => {
        setIsLoadingProduct(true);
        const reference = database().ref('/products');
        reference.once('value').then(async (snapshot: any) => {
            const data = snapshot.val();
            const productArray: Product[] = Object.values(data);

            // Lọc sản phẩm theo id_category
            const filterProductCategory = id_category === 0
                ? productArray // nếu bằng 0 thì load hết sản phẩm
                : productArray.filter((item) => item.product_categoryid === id_category);

            // Chuyển đường dẫn thư mục trong Firestorage thành link
            const updateProduct = await Promise.all(
                filterProductCategory.map(async (item) => {
                    const image_url = await getImageURL(item.product_imageurl);
                    return { ...item, product_imageurl: image_url };
                })
            );

            setProduct(updateProduct as Product[]);
            setIsLoadingProduct(false);
        });
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

    useEffect(() => {
        fetchProduct(0);
    }, []);

    const handleDelete = (productId: string) => {
        // Hiển thị hộp thoại xác nhận trước khi xóa sản phẩm
        Alert.alert(
            'Xác nhận xóa',  // Tiêu đề của hộp thoại
            'Bạn có chắc chắn muốn xóa sản phẩm này không?',  // Nội dung hộp thoại
            [
                {
                    text: 'Hủy',  // Nút hủy
                    onPress: () => console.log('Cancel delete'),  // Không làm gì khi hủy
                    style: 'cancel',  // Định kiểu nút hủy
                },
                {
                    text: 'Xóa',  // Nút xác nhận xóa
                    onPress: () => {
                        // Xóa sản phẩm khỏi Firebase
                        const productRef = database().ref(`/products/${productId}`);
    
                        productRef
                            .remove()
                            .then(() => {
                                console.log('Product deleted successfully');
                                // Cập nhật lại trạng thái sản phẩm sau khi xóa
                                setProduct((prevProducts) =>
                                    prevProducts.filter((product) => product.product_id !== productId)
                                );
                            })
                            .catch((error) => {
                                console.error('Error deleting product:', error);
                            });
                    },
                },
            ],
            { cancelable: true }  // Cho phép đóng hộp thoại khi nhấn ngoài
        );
    };

    const renderItemProduct = ({ item }: any) => (
        <View style={styles.itemContainer}>
            <TouchableOpacity style={styles.itemProductStyles}>
                <View style={styles.itemImageContainer}>
                    <Image source={{ uri: item.product_imageurl }} style={styles.ImageProductStyles} />
                </View>

                <View style={styles.itemTextContainer}>
                    <Text style={styles.itemName}>{item.product_name}</Text>
                </View>

                <View style={styles.itemPriceContainer}>
                    <Text style={styles.itemPrice}>{formatNumber(item.product_price)}đ</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.product_id)}
            >
                <Text style={styles.deleteButtonText}>Xóa</Text>
            </TouchableOpacity>
        </View>
    );

    const formatNumber = (num: number) => {
        return num.toLocaleString("vi-VN"); // "vi-VN" là định dạng Việt Nam
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.backButton} // TouchableOpacity chỉ bao bọc ngoài cùng
                onPress={() => navigation.goBack()} // Sự kiện quay lại
            >
                <View style={styles.backButtonInner}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>BACK</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>


            <Text style={styles.headerText}>Danh sách sản phẩm</Text>

            {/* Flatlist sản phẩm */}
            <View style={styles.productListContainer}>
                {isLoadingProduct ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size={'large'} />
                    </View>
                ) : (
                    <FlatList
                        data={product}
                        renderItem={renderItemProduct}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={1}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 10,
    },
    headerText: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    productListContainer: {
        width: '100%',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 250,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    itemProductStyles: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
    },
    itemImageContainer: {
        width: 120,
        height: 120,
        marginRight: 10,
    },
    ImageProductStyles: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    itemTextContainer: {
        flex: 1,
    },
    itemName: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    itemPriceContainer: {
        backgroundColor: '#f2e3d5',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 20,
    },
    itemPrice: {
        fontSize: 14,
        color: '#d32f2f',
    },
    deleteButton: {
        backgroundColor: '#d32f2f',
        padding: 10,
        borderRadius: 20,
        alignItems: 'center',
        marginLeft: 10,
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },

    backButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: '#f2e3d5',
        borderRadius: 20,
        // Padding của TouchableOpacity sẽ ảnh hưởng đến diện tích mà người dùng có thể nhấn
        paddingVertical: 10,  // Padding cho chiều cao
        paddingHorizontal: 15, // Padding cho chiều rộng
    },
    backButtonInner: {
        justifyContent: 'center',  // Căn giữa chữ theo chiều dọc
        alignItems: 'center',      // Căn giữa chữ theo chiều ngang
    },
    backButtonText: {
        fontSize: 18,
        color: '#333',
    },
});

export default ListProductScreen;
