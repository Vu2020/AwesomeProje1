import React from 'react';
import { View, StyleSheet } from 'react-native';
import Home from './Home';
import { useRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import BookDetail from './Bookdetail';
import ChapterImageScreen from './ChapterImageScreen';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import FavoritesScreen from './FavoritesScreen';
import HistoryScreen from './HistoryScreen';
import Ionicons from 'react-native-vector-icons/FontAwesome';
import UserProfile from './User';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const getTabBarIcon = (route, focused, color, size) => {
  let iconName;

  if (route.name === 'Home') {
    iconName = focused ? 'home' : 'home';
  } else if (route.name === 'History') {
    iconName = focused ? 'history' : 'history';
  } else if (route.name === 'Favorites') {
    iconName = focused ? 'heart' : 'heart';
  } else if (route.name ==='User') {
    iconName = focused ? 'user-circle':'user-circle';
  }

  return <Ionicons name={iconName} size={size} color={color} />;
};
const AllScreen = () => {
  const route = useRoute();
  const { userId } = route.params || {};
  console.log(route.params);

  return (
    
    <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
              activeTintColor: '#0099FF',
              inactiveTintColor: 'gray',
              tabBarLabel: () => null,
              tabBarIcon: ({ focused, color, size }) =>
                getTabBarIcon(route, focused, color, size),
            })}
          >
            <Tab.Screen name="Home" component={Home} initialParams={{ userId }} options={{title:"Trang chủ"}} />
            <Tab.Screen name="History" component={(props) => <HistoryScreen {...props} userId={userId} />} options={{ title: "Lịch sử đọc" }} />
            <Tab.Screen name="Favorites" component={(props) => <FavoritesScreen {...props} userId={userId} />} options={{ title: "Danh sách yêu thích" }} />
            <Tab.Screen name="User" component={UserProfile} initialParams={{ userId }} options={{title:"Thông tin người dùng"}} />
          </Tab.Navigator>
          
  );
};
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" >
        <Stack.Screen name='Login' component={Login} options={{title:"Đăng nhập"}}/>
        <Stack.Screen name="Hometab" component={AllScreen} options={{ headerShown: false, tabBarVisible: false }} />
        <Stack.Screen name="BookDetail" component={BookDetail} />
        <Stack.Screen name="ChapterImageScreen" component={ChapterImageScreen} />
        <Stack.Screen name="Register" component={Register} options={{title:"Đăng ký"}} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{title:"Quên mật khẩu"}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;