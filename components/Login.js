import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, Button, SafeAreaView , Alert, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {REACT_APP_AUTH_URL} from '@env';

function Login(props){
    const [ username, setUsername] = useState(null);
    const [ password, setPassword] = useState(null);
    const url = REACT_APP_AUTH_URL;
    useEffect(()=>{
        get_local_token();
    }, []);

    const auth =  () => {
        if (username === null || password === null){
            Alert.alert("Invalid Username or password");
            return;
        }

        let xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () =>handle_response(xhr));
        xhr.open('POST', url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify({username, password}));
    };

    const handle_response = (xhr) =>{
        if (xhr.status === 200){
            save_token_to_local(JSON.parse(xhr.responseText).token);
            get_local_token();
            return;
        }
        if (xhr.status === 400){
            Alert.alert("Invalid Username or Password");
            return;
        }
    }

    const save_token_to_local = async (token) =>{
        await AsyncStorage.setItem("SIG_Token", token);
    }

    const get_local_token = async () =>{
        const token = await AsyncStorage.getItem('SIG_Token');
        if (token){
            props.navigation.navigate("Scan", {token: token});
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={{textAlignVertical: "center",textAlign: "center",}}>
                React Native Demo
            </Text>


            <TextInput
                style={styles.input}
                placeholder="Username"
                onChangeText={text => setUsername(text)}
                value={username}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                onChangeText={text => setPassword(text)}
                value={password}
                secureTextEntry={true}
            />
            <Button onPress={() => auth()} title={"Login"} />
        </SafeAreaView>
    );
}

export default Login;

Login.navigationOptions = screenProps => ({
  title: "Login",
  headerStyle: {
    backgroundColor: 'orange'
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
    fontSize:24
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#75e3c1',
    padding: 10,
  },
  label: {
    fontSize: 24,
    color: 'white',
    padding: 10
  },
  input: {
    fontSize: 24,
    backgroundColor: '#fff',
    padding: 10,
    margin: 10
  },
  viewText: {
    color: 'white',
    fontSize: 20,
    paddingTop: 30,
    paddingLeft: 10,
    paddingRight: 10
  }
});
