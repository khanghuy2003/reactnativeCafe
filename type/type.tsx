export type RootStackParamList = {
    HomeScreen:undefined;
    SplashScreen:undefined;
    OrdersScreen:undefined;
    AccountScreen:undefined;
    CartScreen:undefined;
    MyTabsScreen:undefined;
    DetailProductScreen:{ product_id: string };
    RegisterScreen:undefined;
    LoginScreen:undefined;
    DetailOrderScreen:{orderItem:Order};
    OrderFormScreen:{
        arrayCartItem : CartItem[],
        totalAmountCart: number
    };
    AdminLoginScreen:undefined;
    AdminMainScreen:undefined;
    AddProductScreen:undefined;
    ListProductScreen:undefined
}

export type Category = {
    id_category: string,
    imageURL_category: string,
    name_category: string,
}

export type Banner = {
    ad_link:string,
    id_banner:number,
    url_banner_image:string,
}

export type Product = {
    product_categoryid: number,
    product_id: string,
    product_imageurl: string,
    product_name: string,
    product_price: number,
    product_salescount: number
}

export type User = {
     userId: String,  // ID người dùng, sẽ lấy từ Firebase Authentication
     email: String,  // Địa chỉ email của người dùng
     cart: CartItem[],  // Giỏ hàng của người dùng
     orders: Order[]  // Danh sách đơn hàng của người dùng
}
    
export type CartItem = {
    id:String,
    cartItemId: String,
    cartItemName: String,
    cartItemQuantity: number,
    cartItemSize: String,
    cartItemTotalPrice: number,
    cartItemImageUrl:String
}

export type Order = {
    orderId: String,
    name: String,
    address: String,
    phone: String,
    paymentMethod: String,
    orderItems:CartItem[],
    orderDateTime: String,
    status: String,
    totalPaymentOrder:String
}



export const COLOR_RED = "#f25050"
