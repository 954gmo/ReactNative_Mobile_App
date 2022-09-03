import React, { useState, useEffect } from 'react';
import {Button, Image, Platform, SafeAreaView, View, ScrollView, StyleSheet, TextInput, Alert, TouchableOpacity, Text} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import {REACT_APP_OP_URL} from '@env';

function CustomerRegistration (props){
    const [first_name, onChangeFirstName] = React.useState(null);
    const [register, onClickRegister] = React.useState(true);
    const [number, onChangeNumber] = React.useState(null);
    const [last_name, onChangeLastName] = React.useState(null);
    const [image, setImage] = useState(null);
    const [ID, setID] = useState(null);
    const token = props.navigation.getParam('token', '');
    const url = REACT_APP_OP_URL;
    useEffect(() => {
        (async () => {
          if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
            }
          }
        })();
      }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.3,
        });

        if (!result.cancelled) {
            setImage(result.uri);
            onClickRegister(false);
        }
    };

    const pickID = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.3,
        });

        if (!result.cancelled) {
            setID(result.uri);
        }
    };


    const  back_to_scan = () =>{
        props.navigation.navigate("Scan", {token: token});
    }

    const register_new_customer = () =>{
        if (first_name === null || last_name === null || number === null){
            Alert.alert("First Name, Last Name, Phone# can not be Empty!");
            return;
        }
        if (image === null){
            Alert.alert("Please Take picture of customer");
            return;;
        }
        if (ID === null){
            Alert.alert("Please Take picture of customer's ID");
        }

        if (register === true){
            Alert.alert("Request Sent!");
            return;
        }
        onClickRegister( true);

        Alert.alert("Sending Request...");

        let formData = new FormData();
        formData.append('req_type', 'NC');
        formData.append("first_name", first_name);
        formData.append("last_name", last_name );
        formData.append("number", number);
        formData.append("cust_img", {
            name: 'cusotomer_image.jpg',
            type: 'image/jpg',
            uri: image,
        });
        formData.append('cust_id', {
            name: 'customer_id.jpg',
            type: 'image/jpg',
            uri: ID
        })
        let xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () => handle_new_customer_response(xhr));
        xhr.open('POST', url);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", `Token ${token}` );
        xhr.send(formData);
    };

    const handle_new_customer_response = (xhr) =>{
        if (xhr.status === 302){
            AsyncAlert("Customer Already exist!","Try Lost and Found to get a QR code", lost_and_found);
            onClickRegister(false);
            return;
        }
        if (xhr.status === 200){
            AsyncAlert("New Customer registered" , "A QR code will be sent via SMS");
            onClickRegister(false);
            return;
        }
        if (xhr.status === 406){
            AsyncAlert("Invalid Phone Number!", "Couldn't Send Message! Please Double check phone number and submit again!", do_nothing_buttons);
            onClickRegister(false);
            return;
        }
        if (xhr.status === 409 || xhr.status === 404){
            AsyncAlert("Network Issues for Registering Customers!", "Contact IT support!");
            onClickRegister(false);
            return;
        }
    }

    const defaultButtons = (resolve, reject) => [
        {
            text: 'OK',
            onPress: () => {
                resolve();
                back_to_scan();
            },
        },
    ];

    const do_nothing_buttons = (resolve, reject) => [
        {
            text: 'OK',
            onPress: () => {
                resolve();
            },
        },
    ];
    const lost_and_found = (resolve, reject) =>[
        {
            text: 'OK',
            onPress: ()=>{
                resolve();
                props.navigation.navigate("Lost and Found", {token: token});
            }
        },
    ]



    const AsyncAlert = (title, msg = '', getButtons = defaultButtons) =>
        new Promise((resolve, reject) => {
            Alert.alert(title, msg, getButtons(resolve, reject), { cancelable: false });
        });


    return (
        <SafeAreaView style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
            <ScrollView>
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

            <Button title="Take Picture of ID" onPress={pickID} />
            {ID && <Image source={{uri: ID}} style = {{width:200, height:200}}/>}

            <Button title={"Take Picture of Customer"} onPress={pickImage}/>
            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}

            <Button title={"Register"}
                    disabled={register}
                    onPress={()=>register_new_customer()}></Button>
            </ScrollView>
        </SafeAreaView>
    );

}

export default CustomerRegistration;

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        margin: 20,
    },
    button: {
        flex: 0.1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
});
