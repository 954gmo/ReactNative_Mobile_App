import React from 'react';
import {Button, SafeAreaView, StyleSheet, TextInput, Alert} from "react-native";
import {REACT_APP_OP_URL} from '@env';

function LostFound(props) {
    const [first_name, onChangeFirstName] = React.useState(null);
    const [number, onChangeNumber] = React.useState(null);
    const [last_name, onChangeLastName] = React.useState(null);
    const [req_type, onChangeReqType] = React.useState('LF');
    const token = props.navigation.getParam('token', '');
    const url = REACT_APP_OP_URL;

    const send_QR_code = () =>{
        if (first_name === null || last_name === null || number === null){
            Alert.alert("First Name, Last Name, Phone# can not be Empty!");
            return;
        }
        let xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () => handle_response(xhr));
        xhr.open('POST', url );
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", `Token ${token}` );
        xhr.send(JSON.stringify({first_name, last_name, number, req_type}));
    }

    const lost_and_found = (resolve, reject) =>[
        {
            text: 'OK',
            onPress: ()=>{
                resolve();
                props.navigation.navigate("Scan", {token: token});
            }
        },
    ]


    const AsyncAlert = (title, msg = '', getButtons = lost_and_found) =>
        new Promise((resolve, reject) => {
            Alert.alert(title, msg, getButtons(resolve, reject), { cancelable: false });
        });

    const handle_response = (xhr) =>{
        console.log(xhr.responseText);
        if (xhr.status === 200){
            AsyncAlert("QR code sent to Customer Via SMS!");
            return;
        }
        if(xhr.status === 404){
            Alert.alert("Customer Not Found! Please Double Check entered info or create a new account for new customer");
            return;
        }
        if (xhr.status === 409){
            AsyncAlert("Network Issues When try lost and found", "Please contact administrator!");
            return;
        }
    }
    return(
        <SafeAreaView style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
            <TextInput
              style={styles.input}
              onChangeText={onChangeFirstName}
              placeholder={"First Name"}
              value={first_name}
            />
            <TextInput
              style={styles.input}
              onChangeText={onChangeLastName}
              placeholder="Last Name"
              value={last_name}
              />
          <TextInput
              style={styles.input}
              onChangeText={onChangeNumber}
              value={number}
              placeholder={'19783566321'}
              dataDetectorTypes={'phoneNumber'}
              keyboardType={'number-pad'}
          />

          <Button title={"Send QR Code"} onPress={()=>send_QR_code()}></Button>
          </SafeAreaView>
    );
}

export default LostFound;

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

