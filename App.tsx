// import './firebase/firebaseConfig'; // Import để khởi tạo Firebase
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text } from 'react-native';
import HomeScreen from './Screen/HomeScreen';
import SplashScreen from './Screen/SplashScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import OrdersScreen from './Screen/OrdersScreen';
import AccountScreen from './Screen/AccountScreen';
import CartScreen from './Screen/CartScreen';
import DetailProductScreen from './Screen/DetailProductScreen';
import { COLOR_RED, RootStackParamList } from './type/type';
import LoginScreen from './Screen/LoginScreen';
import RegisterScreen from './Screen/RegisterScreen';
import '@react-native-firebase/auth';
import  firebase  from '@react-native-firebase/app';
import '@react-native-firebase/app';
import '@react-native-firebase/auth';
import { AuthProvider } from './firebase/AuthContext';
import DetailOrderScreen from './Screen/DetailOrderScreen';
import OrderFormScreen from './Screen/OrderFormScreen';
import AdminLoginScreen from './Screen/AdminLoginScreen';
import AdminMainScreen from './Screen/AdminMainScreen';
import AddProductScreen from './Screen/AddProductScreen';
import ListProductScreen from './Screen/ListProductScreen';


const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();


const MyTabsScreen = () => {
  return (
    <Tab.Navigator screenOptions={{
      headerShown:false,
      tabBarStyle:
        {
        marginBottom:0,
        borderRadius:15,
        marginHorizontal:3,
        }
      }}>
      
      <Tab.Screen 
        name="HomeScreen" 
        component={HomeScreen}
        options={{
          tabBarActiveTintColor:"#000",
          tabBarInactiveTintColor:"#000",
          tabBarLabel: 'Trang chủ', 
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require('./assets/homeicon.png') : require('./assets/homeicon.png')}
              style={{ width: 20, height: 20,tintColor:"#000" }}
            />
          ),
        }}/>
    
      <Tab.Screen 
        name="CartScreen" 
        component={CartScreen}
        options={{
          tabBarActiveTintColor:"#000000",
          tabBarInactiveTintColor:"#000000",
          tabBarLabel: 'Giỏ hàng',
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require('./assets/carticon.png') : require('./assets/carticon.png')}
              style={{ width: 20, height: 20,tintColor:"#000" }}
            />
          ),
        }}/>

      <Tab.Screen 
      name="OrdersScreen" 
      component={OrdersScreen}
      options={{
        tabBarActiveTintColor:"#000000",
        tabBarInactiveTintColor:"#000000",
        tabBarLabel: 'Đơn hàng',
        tabBarIcon: ({ focused }) => (
          <Image
            source={focused ? require('./assets/ordericon.png') : require('./assets/ordericon.png')}
            style={{ width: 20, height: 20,tintColor:"#000" }}
          />
        ),
      }}/>

      <Tab.Screen 
        name="AccountScreen" 
        component={AccountScreen}
        options={{
          tabBarActiveTintColor:"#000000",
          tabBarInactiveTintColor:"#000000",
          tabBarLabel: 'Tài khoản',
          tabBarIcon: ({ focused }) => (
          <Image
            source={focused ? require('./assets/accounticon.png') : require('./assets/accounticon.png')}
            style={{ width: 20, height: 20,tintColor:"#000" }}
          />
        ),
      }}/>

    </Tab.Navigator>
  );
}

const App = () => {
  return(
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown:false}}>
          <Stack.Screen name = "SplashScreen" component = {SplashScreen}/>
          <Stack.Screen name = "MyTabsScreen" component = {MyTabsScreen}/>
          <Stack.Screen name = "DetailProductScreen" component = {DetailProductScreen}/>
          <Stack.Screen name = "LoginScreen" component={LoginScreen}/>
          <Stack.Screen name = "RegisterScreen" component={RegisterScreen}/>
          <Stack.Screen name = "DetailOrderScreen" component={DetailOrderScreen}/>
          <Stack.Screen name = "OrderFormScreen" component={OrderFormScreen}/>
          <Stack.Screen name = "AdminLoginScreen" component={AdminLoginScreen}/>
          <Stack.Screen name = "AdminMainScreen" component={AdminMainScreen}/>
          <Stack.Screen name = "AddProductScreen" component={AddProductScreen}/>
          <Stack.Screen name = "ListProductScreen" component={ListProductScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  )
}


export default App;
