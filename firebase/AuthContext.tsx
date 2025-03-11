import React, { createContext, useContext, useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../type/type';

const AuthContext = createContext({
    user: null,
    logout: async () => {}
});


export const AuthProvider = ({ children }: any) => {
  
  const [user, setUser] = useState<any>(null);

  const logout = async () => {
    try {
      await auth().signOut();
      setUser(null); // Reset user về null
      console.log('Đăng xuất thành công');
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setUser(user);
      console.log('Người dùng hiện tại:', user);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user , logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
