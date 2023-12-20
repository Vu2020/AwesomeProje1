import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, TextInput, ScrollView, SafeAreaView } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from './firebaseConfig';
import { useNavigation,useRoute } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
const Home = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();
  const route = useRoute(); 
  const { userId } = route.params;
  const fetchData = useCallback(async () => {
    const db = getFirestore();
    try {
      const snapshot = await getDocs(collection(db, 'Book'));
      const dataList = snapshot.docs.map((doc) => ({
        id: doc.id,
        Name: doc.data().Name,
        Content: doc.data().Content,
        Cimage: doc.data().Cimage,
      }));
      setData(dataList);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu từ Firestore', error.message);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handledetail = (id, Name, Content, Cimage) => {
    navigation.navigate('BookDetail', { id, Name, Content, Cimage,userId });
  };

  const renderServiceItem = ({ item }) => {
    if (searchText !== '' && !item.Name.toLowerCase().includes(searchText.toLowerCase())) {
      return null;
    }

    return (
      <TouchableOpacity key={item.id} onPress={() => handledetail(item.id, item.Name, item.Content, item.Cimage)}>
        <View style={styles.serviceItem}>
          <Image source={{ uri: item.Cimage }} style={styles.image} />
          <Text style={styles.serviceName}>{item.Name}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={{alignItems:'center',flex:1}}>
    
      <TextInput
        style={styles.searchInput}
        placeholder="Nhập từ khóa tìm kiếm"
        onChangeText={(text) => setSearchText(text)}
        value={searchText}
      />
      <FlatList
        style={{flex:1}}
        data={data}
        keyboardShouldPersistTaps="always"
        keyExtractor={(item) => item.id}
        renderItem={renderServiceItem}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        numColumns={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex:1
  },
  serviceItem: {
    marginBottom: 20,
    alignItems: 'center',
  },
  image: {
    width: 180,
    height: 250,
    borderRadius: 5,
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Thêm style cho input tìm kiếm
  searchInput: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
});

export default Home;
