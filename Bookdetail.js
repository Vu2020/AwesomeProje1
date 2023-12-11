import React from 'react';
import { View, Text, Image, StyleSheet,FlatList } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs,query,where } from 'firebase/firestore';

const BookDetail = ({ route }) => {
  const { id,Name,Content,Cimage } = route.params;
  const [chapters, setChapters] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ title: Name });
  }, [Name]);
  useEffect(() => {
    const fetchChapters = async () => {    
      const db = getFirestore();
      const chaptersCollectionRef = collection(db, 'Chapters');
      const chaptersQuery = query(chaptersCollectionRef, where('bookID', '==', id));
      try {
        const chaptersQuerySnapshot = await getDocs(chaptersQuery);
        const chapterList = chaptersQuerySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            title: doc.data().title,
            number: doc.data().number,
          }))
          .sort((a, b) => b.number - a.number);
    
        console.log('Fetched Chapters:', chapterList);
        setChapters(chapterList);
        console.log('Chapters Length:', chapterList.length);
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
        });
      }
    };
  return (
    <View>
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Image source={{ uri: Cimage }} style={styles.image} resizeMode="contain"/>
      </View>
      <View style={styles.rightAndFlatListContainer}>
        <View style={styles.rightContainer}>
          <Text style={styles.serviceName}>{Name}</Text>
          <View style={{alignItems:'center'}}>
          <Button  onPress={handleReadLatest}>Đọc từ đầu</Button>
          <Button  onPress={handleReadFromBeginning}>Đọc mới nhất</Button>
          </View>
        </View>
      </View>
    </View>
    <View style={styles.contentContainer}>
        <Text style={styles.contentHeader}>Nội dung</Text>
        <Text >{"----------------------------------------------------"}</Text>
      </View>
      <Text style={styles.contentText}>{Content}</Text>
    <FlatList
          data={chapters}
          keyExtractor={(item) => item.id} 
          renderItem={({ item }) => (
            <View style={{borderBottomWidth: 2,
              borderBottomColor: 'black',}}>
              <Button onPress={() => {  navigation.navigate('ChapterImageScreen', { chapterId: item.id, chapterTitle: item.title,Chapter:{chapters} })}}>{item.title}</Button>
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
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    marginBottom: 0,
  },
  rightAndFlatListContainer: {
    flex:1
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
  price: {
    fontSize: 16,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
  },
});

export default BookDetail;
