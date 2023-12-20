import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,Button,Image } from 'react-native';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup,FacebookAuthProvider } from 'firebase/auth';
import { app } from './firebaseConfig';
import Register from './Register';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Home';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'; 
import KeyIcon from 'react-native-vector-icons/MaterialCommunityIcons'; 
const Stack = createNativeStackNavigator();
const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [error, setError] = useState('');
  const [userId,setUserId] = useState('');
  const handleLogin = async () => {
    if (email.trim() === '') {
      setError("Email is required field");
      return;
    }
  
    if (password.trim() === '') {
      setError("Password is required field");
      return;
    }
    const auth = getAuth();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      setUserId(user.uid);
      navigation.navigate('Hometab',{userId:user.uid});
    } catch (error) {
      setError(`Lỗi đăng nhập: ${error.message}`);
    }
  };
  const handleGoogleLogin = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUserId(user.uid);
      navigation.navigate('Hometab',{userId:user.uid});
      console.log('Google login success:', result);
    } catch (error) {
      console.error('Google login error:', error.message);
    }
  };
  const handleFacebookLogin = async () => {
    const auth = getAuth(app);
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Firebase Facebook login successful. User:', user);
      // Tiếp tục xử lý sau khi đăng nhập thành công
    } catch (error) {
      console.error('Firebase Facebook login error:', error.message);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Đăng Nhập</Text>
      <View style={styles.inputContainer}>
      <MaterialIcon
        name="email"
        size={20}
        color="gray"
        style={styles.icon2}
       />
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={text => setEmail(text)}
          value={email}
        />
      </View>
      <View style={styles.inputContainer}>
      <KeyIcon
       name="key-variant"
       size={20}
       color="gray"
       style={styles.icon2}
      />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={text => setPassword(text)}
          value={password}
          secureTextEntry={passwordHidden}
        />
        <Icon
          name={passwordHidden ? 'eye-slash' : 'eye'}
          size={20}
          color="gray"
          onPress={() => setPasswordHidden(!passwordHidden)}
          style={styles.icon}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng Nhập</Text>
      </TouchableOpacity>
      <View style={styles.orContainer}>
        <Text style={styles.orText}>Hoặc</Text>
      </View>
     <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
     <Text style={styles.googleButtonText}>Login with Google</Text>
    <Image
    source={require('./google-icon.png')} 
    style={styles.googleIcon}
     />
   </TouchableOpacity>
   <TouchableOpacity style={styles.googleButton} onPress={handleFacebookLogin}>
     <Text style={styles.googleButtonText}>Login with Facebook</Text>
    <Image
    source={require('./Facebook.png')} 
    style={styles.googleIcon}
     />
   </TouchableOpacity>
      <TouchableOpacity
        style={styles.borderlessButtonContainer}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.borderlessButtonText}>Tạo tài khoản mới?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.borderlessButtonContainer}
        onPress={() => navigation.navigate('ForgotPassword')}>
         <Text style={styles.borderlessButtonText}>Quên mật khẩu?</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    header: {
      fontSize: 24,
      marginBottom: 16,
    },
    inputContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
    },
    input: {
      flex: 1, 
      height: 40,
      paddingHorizontal: 10,
    },
    icon: {
      right:12, 
    },
    image: {
      flex: 1,
      width: '100%',
      height: '100%',
      position: 'absolute', 
    },
    errorText: {
      color: 'red',
      marginBottom: 10,
    },
    button: {
      backgroundColor: 'orange', 
      width: '100%',
      padding: 10,
      alignItems: 'center',
      borderRadius: 5,
    },
    buttonText: {
      color: 'white',
    },
    icon2:{
      left:2,
    },
    borderlessButtonContainer: {
      color:'white',
      marginTop: 16,
      alignItems: 'center',
      justifyContent: 'center'
      },
      borderlessButtonText: {
        color: 'blue', 
      },
      orContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
      },
      
      orText: {
        marginHorizontal: 10,
        fontSize: 16,
        color: 'gray',
      },
      googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginTop: 10,
      },
      googleIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
      },
      googleButtonText: {
        color: 'blue',
        marginRight: 10,
      },   
  });
export default Login;
