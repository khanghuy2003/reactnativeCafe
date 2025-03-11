import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Button, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native"
import { COLOR_RED, RootStackParamList } from "../type/type"
import { SafeAreaView } from "react-native-safe-area-context"
import InforAcc from "../Component/InforAcc"
import { useAuth } from "../firebase/AuthContext"
import { useEffect } from "react"

type AccountScreenProps = NativeStackScreenProps<RootStackParamList,'AccountScreen'>

const AccountScreen = ({navigation}:AccountScreenProps) => {
    const height = useWindowDimensions().height
    const width = useWindowDimensions().width

    const { user, logout }:any = useAuth();

    useEffect(() => {
        if (!user) {
        console.log("Người dùng chưa đăng nhập");
        } else {
        console.log("Người dùng đã đăng nhập:");
        }
    }, [user]);

    const handleLogout = async () =>{
        await logout()
        navigation.navigate('HomeScreen')
    }

    return(
        <SafeAreaView>
        <ScrollView contentContainerStyle={{ flexGrow: 1,paddingBottom: 150}}
                    keyboardShouldPersistTaps="handled"
                    contentInsetAdjustmentBehavior="automatic"
                    showsVerticalScrollIndicator={false}>

            <View style={styles.container}>
                <View style={[styles.header,{height:height*0.20,width:width}]}>
                    <View style={{width:70,height:70,borderWidth:0}}>
                            <Image style={{width:70,height:70,borderRadius:100}} source={require('../assets/userimage.png')} resizeMode="cover"/>
                    </View>
                    <View style={{height:70,width:220,justifyContent:'center',marginLeft:10}}>
                        <Text style={{fontSize:18, color:'#ffffff',fontWeight:500}}>{!user ? 'Vui lòng đăng nhập để sử dụng các tính năng' : user.email }</Text>
                    </View>
                </View>
                <View style={[styles.body,{height:height*0.80,width:width}]}>
                    <View style={{width:width*0.8,flex:1,marginTop:30}}>
                        <View style={styles.thongtinchung}>
                            <Text style={styles.text1}>Thông tin chung:</Text>
                            <TouchableOpacity>
                            <InforAcc text={'Điều khoản dịch vụ'} image1={require('../assets/dieukhoan.png')}/>
                            </TouchableOpacity>
                            <TouchableOpacity>
                            <InforAcc text={'Chính sách bảo mật'} image1={require('../assets/dieukhoan.png')}/>
                            </TouchableOpacity>
                            <TouchableOpacity>
                            <InforAcc text={'Giới thiệu về phiên bản ứng dụng'} image1={require('../assets/iconinformation.png')}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.trungtamtrogiup}>
                            <Text style={styles.text1}>Trung tâm trợ giúp:</Text>
                            <TouchableOpacity>
                            <InforAcc text={'Câu hỏi thường gặp'} image1={require('../assets/question.png')}/>
                            </TouchableOpacity>
                            <TouchableOpacity>
                            <InforAcc text={'Phản hồi & hỗ trợ'} image1={require('../assets/answer.png')}/>
                            </TouchableOpacity>
                        </View>
                        
                        {!user 
                        ?(
                        <TouchableOpacity onPress={()=>navigation.navigate('LoginScreen')}>
                            <View style={styles.button}>
                                <Text style={{color:"#ffffff",fontWeight:500}}>
                                    ĐĂNG NHẬP / ĐĂNG KÍ
                                </Text>
                            </View>
                        </TouchableOpacity>
                        ):(
                            <TouchableOpacity onPress={handleLogout}>
                                <View style={styles.button}>
                                    <Text style={{color:"#ffffff",fontWeight:500}}>
                                        ĐĂNG XUẤT
                                    </Text>
                                </View>
                            </TouchableOpacity> 
                        )}
                        
                    </View>
                </View>
            </View>

        </ScrollView>
        </SafeAreaView>
        
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        backgroundColor:COLOR_RED,
    },
    header:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
    },
    body:{
        height:'auto',
        backgroundColor:'#f7f7f7',
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
        alignItems:'center',
    },
    thongtinchung:{

    },
    trungtamtrogiup:{
        marginTop:20
    },
    text1:{
        fontWeight:800
    },
    button:{
        marginTop:30,
        height:40,
        borderRadius:20,
        backgroundColor:COLOR_RED,
        alignItems:'center',
        justifyContent:'center'
    }
})

export default AccountScreen