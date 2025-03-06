import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, FlatList, Dimensions, useWindowDimensions, TouchableOpacity, Linking } from 'react-native';
import { getAuth } from '@react-native-firebase/auth';
import { getDatabase, ref, get } from '@react-native-firebase/database';
import { getStorage, ref as storageRef, getDownloadURL } from '@react-native-firebase/storage';
import { Banner } from '../type/type';


const ADBanner = () => {
    const width = useWindowDimensions().width
    const [index, setIndex] = useState<number>(0);
    const flatListRef = useRef<FlatList>(null);
    const [banner,setBanner] = useState<Banner[]> ([])

    const fetchBanner = async () => {
      const db = getDatabase();
      const dbRef = ref(db, '/banner');
  
      try {
          const snapshot = await get(dbRef);
          if (snapshot.exists()) {
              const data = snapshot.val();
              const bannerArray: Banner[] = Object.values(data);
              setBanner(bannerArray);
          } else {
              console.log('Không có dữ liệu banner');
          }
      } catch (error) {
          console.error('Lỗi khi lấy dữ liệu banner:', error);
      }
  };
  
    useEffect(() => {
        fetchBanner();
    }, []);

    useEffect(() => {
          let nextIndex = index;
          const interval = setInterval(() => {
            nextIndex = (nextIndex + 1) % banner.length;
            setIndex(nextIndex);
            flatListRef.current?.scrollToIndex({
              index: nextIndex,
              animated:true,
            });
          }, 2500);
    
          return () => clearInterval(interval);
      }, [banner]);

    const handlePressBanner = (url:string) => {
        try {
            Linking.openURL(url)
        } catch (error) {
            console.log('Khong the mo link',error)
        }
    }

  const renderItem = ({ item }:any) => (
    <TouchableOpacity onPress={ () => handlePressBanner(item.ad_link)} >
        <View>
            <Image source={{ uri: item.url_banner_image }} style={{ width: width, height: 110 }} resizeMode='center' />
        </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      ref={flatListRef}
      data={banner}
      renderItem={renderItem}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default ADBanner;
