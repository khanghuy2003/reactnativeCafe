export type RootStackParamList = {
    HomeScreen:undefined;
    SplashScreen:undefined;
    OrdersScreen:undefined;
    AccountScreen:undefined;
    CartScreen:undefined;
    MyTabsScreen:undefined;
    DetailProductScreen:{ product_id: string };
    RegisterScreen:undefined;
    LoginScreen:undefined
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

export const COLOR_RED = "#f25050"
