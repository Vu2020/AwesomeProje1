import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, getDocs, query, where, getDoc } from 'firebase/firestore';
import { doc as firestoreDoc } from 'firebase/firestore';

const FavoritesScreen = ({ userId }) => {
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userId) {
        console.error('UserId is undefined or falsy.');
        return;
      }

      const db = getFirestore();
      const userFavoritesCollectionRef = collection(db, 'UserFavorites');
      const favoritesQuery = query(userFavoritesCollectionRef, where('userId', '==', userId));

      try {
        const favoritesSnapshot = await getDocs(favoritesQuery);

        if (!favoritesSnapshot) {
          console.error('Favorites snapshot is not defined.');
          return;
        }

        const favoriteBooksList = [];

        for (const doc of favoritesSnapshot.docs) {
          const bookId = doc.data().bookId;

          if (!bookId) {
            console.error('bookId is undefined or falsy for a UserFavorites document.');
            continue;
          }

          const bookDocRef = firestoreDoc(collection(db, 'Book'), bookId);
          const bookDocSnapshot = await getDoc(bookDocRef);

          if (bookDocSnapshot.exists()) {
            favoriteBooksList.push({
              bookId: bookDocSnapshot.id,
              ...bookDocSnapshot.data(),
            });
          } else {
            console.error('Book document does not exist for UserFavorites document with bookId:', bookId);
          }
        }

        console.log('Favorite Books:', favoriteBooksList);

        setFavoriteBooks(favoriteBooksList);
      } catch (error) {
        console.error('Error fetching favorites:', error.message);
      }
    };

    fetchFavorites();
  }, [userId]);

  const handleBookPress = (bookId, Name, Content, Cimage) => {
    navigation.navigate('BookDetail', { id: bookId, Name, Content, Cimage, userId });
  };

  const renderFavoriteItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleBookPress(item.bookId, item.Name, item.Content, item.Cimage)}>
      <View style={styles.serviceItem}>
        <Image source={{ uri: item.Cimage }} style={styles.image} />
        <Text style={styles.serviceName}>{item.Name}</Text>
      </View>
    </TouchableOpacity>
  );
 
  return (
    <View style={styles.container}>
      {favoriteBooks.length > 0 ? (
        <FlatList
          data={favoriteBooks}
          keyExtractor={(item) => item.bookId}
          renderItem={renderFavoriteItem}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          numColumns={1}
        />
      ) : (
        <Text style={styles.emptyMessage}>Danh Sách Yêu Thích Trống.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex:1
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems:'center',
    marginBottom: 20,
  },
  image: {
    width: 80, 
    height: 120,
    borderRadius: 5,
    marginBottom: 10, 
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'flex-start',
    alignSelf: 'flex-start',  
  },
  emptyMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default FavoritesScreen;
