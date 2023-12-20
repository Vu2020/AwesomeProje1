import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getFirestore, collection, getDocs, query, where, getDoc } from 'firebase/firestore';
import { doc as firestoreDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const HistoryScreen = ({ userId }) => {
  const [history, setHistory] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [isFetchingChapters, setIsFetchingChapters] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userId) {
        console.error('UserId is undefined or falsy.');
        return;
      }

      const db = getFirestore();
      const historyCollectionRef = collection(db, 'History');
      const historyQuery = query(historyCollectionRef, where('userId', '==', userId));

      try {
        const historySnapshot = await getDocs(historyQuery);
        const historyList = [];

        for (const doc of historySnapshot.docs) {
          const bookId = doc.data().bookId;
          const chapterId = doc.data().chapterId;

          // Fetch information about the book and chapter
          const bookDocRef = firestoreDoc(collection(db, 'Book'), bookId);
          const bookDocSnapshot = await getDoc(bookDocRef);

          if (bookDocSnapshot.exists()) {
            const bookData = bookDocSnapshot.data();
            const chapterRef = firestoreDoc(collection(db, 'Chapters'), chapterId);
            const chapterSnapshot = await getDoc(chapterRef);

            if (chapterSnapshot.exists()) {
              const chapterData = chapterSnapshot.data();

              historyList.push({
                bookId: bookDocSnapshot.id,
                bookName: bookData.Name,
                bookCover: bookData.Cimage,
                chapterId: chapterId,
                chapterTitle: chapterData.title,
              });
            }
          }
        }

        // Use the functional form of setHistory to ensure the latest state
        setHistory((prevHistory) => [...prevHistory, ...historyList]);
      } catch (error) {
        console.error('Error fetching history:', error.message);
      }
    };

    fetchHistory();
  }, [userId]);

  const fetchChapters = async (bookId) => {
    const db = getFirestore();
    const chaptersCollectionRef = collection(db, 'Chapters');
    const chaptersQuery = query(chaptersCollectionRef, where('bookID', '==', bookId));

    try {
      const chaptersQuerySnapshot = await getDocs(chaptersQuery);
      const chapterList = chaptersQuerySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          number: doc.data().number,
        })).sort((a, b) => b.number - a.number);
      setChapters([]);
      setChapters(chapterList);
      console.log('Chapters Length:', chapterList.length);
      console.log('danh sách lay',chapterList);
    } catch (error) {
      console.error('Error fetching chapters:', error.message);
    }
  };
  return (
    <View style={styles.container}>
      {history.length > 0 ? (
      <FlatList
        data={history}
        keyExtractor={(item) => item.bookId}
        renderItem={({ item }) => (
          <TouchableOpacity
          onPress={async () => {
            if (item.bookId) {
              await fetchChapters(item.bookId);
              console.log("danh sách có",chapters)
              navigation.navigate('ChapterImageScreen', {
                chapterId: item.chapterId,
                chapterTitle: item.chapterTitle,
                userId: userId,
                bookId: item.bookId,
                Chapter: {chapters},
              });
            }
          }}>
      <View style={styles.historyItem}>
        <Image source={{ uri: item.bookCover }} style={styles.bookCover} />
        <View style={styles.textContainer}>
          <Text style={styles.bookName}>{item.bookName}</Text>
          <Text style={styles.chapterTitle}>{item.chapterTitle}</Text>
        </View>
      </View>
    </TouchableOpacity>
        )}
      />
      ) : (
        <Text style={styles.emptyMessage}>Lịch Sử Trống.</Text>
      )}
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  bookCover: {
    width: 80,
    height: 120,
    borderRadius: 5,
    marginRight: 10,
  },
  emptyMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  textContainer: {
    flex: 1,
    alignSelf: 'flex-start',
  },
  bookName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  chapterTitle: {
    fontSize: 16,
  },
});

export default HistoryScreen;
