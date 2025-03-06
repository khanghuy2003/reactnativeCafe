import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Button, Text, View } from "react-native"
import { RootStackParamList } from "../type/type"

type AccountScreenProps = NativeStackScreenProps<RootStackParamList,'AccountScreen'>

const AccountScreen = ({navigation}:AccountScreenProps) => {
    return(
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Text>
                AccountScreen
            </Text>
            <Button 
                title='Login'
                onPress={()=> navigation.navigate('LoginScreen')}/>
            <Button 
                title='Register'
                onPress={()=> navigation.navigate('RegisterScreen')}/>
        </View>
        
    )
}

export default AccountScreen