import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,Image } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth'; 
import { getAuth } from 'firebase/auth';
import { Alert } from 'react-native';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleResetPassword = async () => {
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (error) {
      Alert.alert('Lỗi', `Lỗi gửi email đặt lại mật khẩu: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      
      <Text style={styles.header}>Quên Mật Khẩu</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={text => setEmail(text)}
        value={email}
      />
      {resetSent ? (
        <Text style={styles.successText}>
          Email reset password has been sent. Please check your inbox.
        </Text>
      ) : null}
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Gửi</Text>
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
  description: {
    marginBottom: 16,
  },
  input: {
    width: '100%',
    height: 40,
    paddingHorizontal: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  successText: {
    color: 'green',
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
});

export default ForgotPassword;
