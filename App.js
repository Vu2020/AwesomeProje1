import React from 'react';
import { View, StyleSheet } from 'react-native';
import Home from './Home';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import BookDetail from './Bookdetail';
import ChapterImageScreen from './ChapterImageScreen';
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen options={{title:'Trang chủ'}} name="Home" component={Home} />
        <Stack.Screen name="BookDetail" component={BookDetail} />
        <Stack.Screen name="ChapterImageScreen" component={ChapterImageScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;