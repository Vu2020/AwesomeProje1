import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList, Image ,ScrollView} from 'react-native';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';
const ChapterImageScreen = ( {route}) => {
  const { chapterId, chapterTitle,Chapter } = route.params;
  const [chapterImages, setChapterImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation(); 

  const fetchChapterImages = async () => {
    const db = getFirestore();
    if (chapterId) {
      const chapterImagesCollectionRef = collection(db, 'ChapterImages');
      const chapterImagesQuery = query(chapterImagesCollectionRef, where('ChapterId', '==', chapterId));
      try {
        const chapterImagesQuerySnapshot = await getDocs(chapterImagesQuery);
        const imagesList = [];
        for (const doc of chapterImagesQuerySnapshot.docs) {
          const folderPath = doc.data().chapimage;
          const filesInFolder = await listAll(ref(getStorage(), folderPath));
          for (const fileRef of filesInFolder.items) {
            const imageUrl = await getDownloadURL(fileRef);
            imagesList.push(imageUrl);
          }
        }
        console.log('Chapter Images:', imagesList);
        setChapterImages(imagesList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching chapter images:', error.message);
      }
    }
  };
  useEffect(() => {
    navigation.setOptions({
      title: chapterTitle,});
    fetchChapterImages();
  }, [chapterId]);
  const goToPreviousChapter = () => {
    const chapterArray = Chapter.chapters;
    const currentChapterId = chapterId;
    console.log("currentID", currentChapterId);
    const currentIndex = chapterArray.findIndex((item) => item.id === currentChapterId);
    const previousChapterId = currentIndex < chapterArray.length - 1 ? chapterArray[currentIndex + 1].id : null;
    const previousChapterTitle = previousChapterId ? chapterArray.find((item) => item.id === previousChapterId).title : null;
    console.log("previousID", previousChapterId);
    if (previousChapterId) {
      navigation.replace('ChapterImageScreen', { chapterId: previousChapterId, chapterTitle: previousChapterTitle, Chapter: Chapter });
    }
  };
  
  const goToNextChapter = () => {
    const chapterArray = Chapter.chapters;
    const currentChapterId = chapterId;
    console.log("currentID", currentChapterId);
    const currentIndex = chapterArray.findIndex((item) => item.id === currentChapterId);
    const nextChapterId = currentIndex > 0 ? chapterArray[currentIndex - 1].id : null;
    const nextChapterTitle = nextChapterId ? chapterArray.find((item) => item.id === nextChapterId).title : null;
    console.log("nextID", nextChapterId);
    if (nextChapterId) {
      navigation.replace('ChapterImageScreen', { chapterId: nextChapterId, chapterTitle: nextChapterTitle, Chapter: Chapter });
    }
  };
  
  return (
    <div style={styles.container}>
      {loading && <Text>Loading...</Text>}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={goToPreviousChapter} style={styles.button}>
          <Text style={styles.buttonText}>{'<<Chap Trước'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToNextChapter} style={styles.button}>
          <Text style={styles.buttonText}>{'Chap Sau>>'}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.imageContainer}>
        {chapterImages.map((imageUrl, index) => (
          <img
          key={index}
          src={imageUrl}
          alt={`Image ${index + 1}`}
          style={{ marginBottom: '0px' }}
          />
        ))}
      </ScrollView>
      
    </div>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    marginBottom: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 16,
    position: 'sticky',
    top: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 1
  },
  button: {
    padding: 10,
  },
  buttonText: {
    color: 'red',
  },
});


export default ChapterImageScreen;
