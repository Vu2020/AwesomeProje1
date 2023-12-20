import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { getAuth, onAuthStateChanged, getAdditionalUserInfo, signOut } from 'firebase/auth';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        const additionalUserInfo = getAdditionalUserInfo(authUser);
        console.log('Additional User Info:', additionalUserInfo);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.error(`Logout Error: ${error.message}`);
    }
    setShowLogoutConfirmation(false);
  };

  const showConfirmationDialog = () => {
    window.alert('Logout Confirmation\nAre you sure you want to log out?');
    handleLogout();
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('./anhnnn.jpg')}
        style={styles.images}
        resizeMode="cover"
      />
      {showLogoutConfirmation && showConfirmationDialog()}
      {user ? (
        <View style={styles.userInfoContainer}>
          {user.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.avatar} />
          ) : (
            <Image source={require('./anhdaidien1.png')} style={styles.avatar} />
          )}
          <View style={styles.textContainer}>
            <Text style={styles.greetingText}>Xin Chào</Text>
            <Text style={styles.emailText}>{user.email}</Text>
          </View>
        </View>
      ) : (
        <Text style={{ color: 'white' }}>Người dùng chưa xác thực</Text>
      )}
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Ionicons name="info-circle" size={25} style={styles.infoIcon} />
          <Text style={styles.infoText}>Phiên bản</Text>
          <Text style={styles.versionText}>1.0.0</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="phone" size={25} style={styles.infoIcon} />
          <Text style={styles.infoText}>Liên Hệ</Text>
          <Text style={styles.versionText}>ltdd22@gmail.com</Text>
        </View>
        
        <TouchableOpacity
          onPress={() => setShowLogoutConfirmation(true)}
          style={styles.logoutRow}
        >
          <Ionicons name="sign-out" size={25} style={styles.infoIcon} />
          <Text style={styles.infoText}>Đăng xuất</Text>
        </TouchableOpacity>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  images: {
    flex: 1,
    width: '100%',
    height: '30%',
    position: 'absolute',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  textContainer: {
    marginLeft: 10,
  },
  greetingText: {
    fontSize: 20,
    color: 'white',
  },
  emailText: {
    fontSize: 16,
    color: 'white',
  },
  headerRight: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginLeft: 10,
  },
  infoContainer: {
    backgroundColor: 'white',
    height: 'auto',
    width: 'auto',
    borderRadius: 10,
    overflow: 'hidden',
    margin: 10,
    marginTop: 110,
  },
  infoRow: {
    flexDirection: 'row',
    marginLeft: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 5,
  },
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  versionText: {
    marginLeft:'auto',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10
  },
  logoutRow: {
    flexDirection: 'row',
    marginLeft: 10,
    marginTop: 10,
    
  },
});

export default UserProfile;
