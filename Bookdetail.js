import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, getDocs, query, where, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';

const BookDetail = ({ route }) => {
  
  const { id, Name, Content, Cimage, userId } = route.params;
  const [chapters, setChapters] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userFavoritesId, setUserFavoritesId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: Name });
  }, [Name]);

  useEffect(() => {
    const fetchChapters = async () => {
      const db = getFirestore();
      const chaptersCollectionRef = collection(db, 'Chapters');
      const chaptersQuery = query(chaptersCollectionRef, where('bookID', '==', id));
      const userFavoritesCollectionRef = collection(db, 'UserFavorites');

      try {
        const chaptersQuerySnapshot = await getDocs(chaptersQuery);
        const chapterList = chaptersQuerySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            title: doc.data().title,
            number: doc.data().number,
          }))
          .sort((a, b) => b.number - a.number);

        // Kiểm tra xem sách đã được thêm vào danh sách yêu thích hay không
        const userFavoritesQuery = query(userFavoritesCollectionRef, where('userId', '==', userId), where('bookId', '==', id));
        const userFavoritesSnapshot = await getDocs(userFavoritesQuery);

        if (!userFavoritesSnapshot.empty) {
          const userFavoritesDoc = userFavoritesSnapshot.docs[0];
          setUserFavoritesId(userFavoritesDoc.id);
          setIsFavorite(true);
        } else {
          setUserFavoritesId(null);
          setIsFavorite(false);
        }

        setChapters(chapterList);
        console.log('Chapters Length:', chapterList.length);
        console.log('danh sách:', chapterList);
      } catch (error) {
        console.error('Error fetching chapters:', error.message);
      }
    };

    fetchChapters();
  }, [id]);
  
  const handleReadFromBeginning = () => {
    if (chapters.length > 0) {
      const firstChapter = chapters[0];
      navigation.navigate('ChapterImageScreen', {
        chapterId: firstChapter.id,
        chapterTitle: firstChapter.title,
        Chapter: { chapters },
        bookId:id,
        userId:userId
      });
    }
  };

  const handleReadLatest = () => {
    if (chapters.length > 0) {
      const latestChapter = chapters[chapters.length - 1];
      navigation.navigate('ChapterImageScreen', {
        chapterId: latestChapter.id,
        chapterTitle: latestChapter.title,
        Chapter: { chapters },
        bookId:id,
        userId:userId
      });
    }
  };

  const toggleFavorite = async (userId) => {
    const db = getFirestore();
    const userIdString = String(userId);
    const bookRef = doc(db, 'Book', id);
    const userFavoritesCollectionRef = collection(db, 'UserFavorites');
  
    try {
      console.log('Toggle favorite for book with id:', id); // Log giá trị id
  
      // Kiểm tra xem sách đã được thêm vào danh sách yêu thích hay không
      const userFavoritesQuery = query(userFavoritesCollectionRef, where('userId', '==', userId), where('bookId', '==', id));
      const userFavoritesSnapshot = await getDocs(userFavoritesQuery);
  
      if (!userFavoritesSnapshot.empty) {
        // Nếu sách đã được thêm vào danh sách yêu thích
        const userFavoritesDoc = userFavoritesSnapshot.docs[0];
        setUserFavoritesId(userFavoritesDoc.id);
      } else {
        setUserFavoritesId(null);
      }
  
      if (!userFavoritesId) {
        // Nếu sách chưa được thêm vào danh sách yêu thích
        const userFavoritesDocRef = await addDoc(userFavoritesCollectionRef, {
          userId: userIdString,
          bookId:id,
          timestamp: new Date().getTime(),
        });
  
        setUserFavoritesId(userFavoritesDocRef.id);
      } else {
        // Nếu sách đã được thêm vào danh sách yêu thích
        await deleteDoc(doc(db, 'UserFavorites', userFavoritesId));
        setUserFavoritesId(null);
      }
  
      await updateDoc(bookRef, {
        isFavorite: !userFavoritesId, // Toggle trạng thái yêu thích
      });
  
      setIsFavorite((prev) => !prev);
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái yêu thích:', error.message);
    }
  };

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <Image source={{ uri: Cimage }} style={styles.image} resizeMode="contain" />
        </View>
        <View style={styles.rightAndFlatListContainer}>
          <View style={styles.rightContainer}>
            <Text style={styles.serviceName}>{Name}</Text>
            <View style={{ alignItems: 'center' }}>
              <Button onPress={handleReadLatest}>Đọc từ đầu</Button>
              <Button onPress={handleReadFromBeginning}>Đọc mới nhất</Button>
              <Button onPress={() => toggleFavorite(userId)}>
                {isFavorite ? 'Xóa khỏi Yêu thích' : 'Thêm vào Yêu thích'}
              </Button>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.contentHeader}>Nội dung</Text>
        <Text>{"----------------------------------------------------"}</Text>
      </View>
      <Text style={styles.contentText}>{Content}</Text>
      <View style={{borderBottomWidth: 1,borderBottomColor: 'black',marginVertical: 10,}}></View>
      <FlatList
        data={chapters}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ borderBottomWidth: 1, borderBottomColor: 'black' }}>
            <Button
              onPress={() => {
                navigation.navigate('ChapterImageScreen', {
                  chapterId: item.id,
                  chapterTitle: item.title,
                  Chapter: { chapters },
                  bookId:id,
                  userId:userId
                });
              }}
            >
              {item.title}
            </Button>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 20,
  },
  leftContainer: {
    flex: 1,
    marginRight: 10,
  },
  rightContainer: {
    flex: 1,
  },
  rightAndFlatListContainer: {
    flex: 1,
  },
  contentContainer: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: 5,
    marginRight: 5, // Add margin to separate from the contentText
  },
  contentText: {
    fontSize: 16,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 5,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default BookDetail;
