import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, FlatList, Dimensions, useWindowDimensions, TouchableOpacity, Linking } from 'react-native';
import database from "@react-native-firebase/database";
import storage from '@react-native-firebase/storage';
import { Banner } from '../type/type';


const ADBanner = () => {
    const width = useWindowDimensions().width
    const [index, setIndex] = useState<number>(0);
    const flatListRef = useRef<FlatList>(null);
    const [banner,setBanner] = useState<Banner[]> ([])

    useEffect(() => {
        const fetchBanner = async () => {
          const reference = database().ref('/banner');
          const snapshot = await reference.once('value');
          const data = snapshot.val();
          if (data) {
            const bannerArray: Banner[] = Object.values(data);
            setBanner(bannerArray);
          }
        };
    
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
