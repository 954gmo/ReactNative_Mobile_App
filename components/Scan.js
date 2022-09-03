import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, SafeAreaView, Alert, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarCodeScanner } from 'expo-barcode-scanner';
import {REACT_APP_OP_URL} from '@env';

export default function Scan(props) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [text, setText] = useState('');
    const [img_url, setImgURL] = useState(null);
    const [validQR, setValidQR] = useState(true);
    const token = props.navigation.getParam('token', '');
    const url = REACT_APP_OP_URL;
    // Request Camera Permission
    useEffect(() => {
        askForCameraPermission();
    }, []);

    const askForCameraPermission = () => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }

    // What happens when we scan the bar code
    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        validate_qr_code(data);
        if (validQR){
            setText(data);
            return;
        }
    };

    const  new_customer = () =>{
        props.navigation.navigate("Register New Customer", {token: token});
    }

    const lost_found = () =>{
        props.navigation.navigate("Lost and Found", {token: token});
    }

    const logout = async () =>{
        await AsyncStorage.removeItem("SIG_Token");
        props.navigation.navigate("Login");
    }

    const on_confirm = () =>{
        customer_checkin(text);
    }

    const on_cancel = () =>{
        setScanned(false);
        setText('');
        setImgURL('https://');
    }

    const customer_checkin = (QRcode) =>{
        const req_type = 'CK';
        let xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.addEventListener('load', () => handle_checkin_response(xhr));
        xhr.open('POST', url );
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", `Token ${token}` );
        xhr.send(JSON.stringify({QRcode, req_type}));
    };

    const handle_checkin_response = (xhr) =>{
        if (xhr.status === 200){
            AsyncAlert("Confirmed!", "Logged Customer Activities");
            return;
        }
        if (xhr.status === 208){
            let res = JSON.parse(xhr.response)
            AsyncAlert("FAILED!! ", "Last Check in " + res.last_check_in +  " ! Need to wait " +  res.time_delta + " hours between two Check in!");
            return;
        }
        if (xhr.status === 409){
            AsyncAlert("Network Issues! When checking in customer", "Please Contact administrator");
            return;
        }
        if (xhr.status === 404){
             AsyncAlert("Customer Not Found", "Please Register the Customer or Try Lost and Found");
            return;
        }
    }

    const defaultButtons = (resolve, reject) => [
        {
            text: 'OK',
            onPress: () => {
                resolve();
                setScanned(false);
                setImgURL("http://");
                setText('');
                },
        },
    ];

    const AsyncAlert = (title, msg = '', getButtons = defaultButtons) =>
        new Promise((resolve, reject) => {
            Alert.alert(title, msg, getButtons(resolve, reject), { cancelable: false });
        });

    const validate_qr_code = (QRcode) =>{
        const req_type = 'VQR';
        let xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.addEventListener('load', () => handle_validation_response(xhr));
        xhr.open('POST', url );
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", `Token ${token}` );
        xhr.send(JSON.stringify({QRcode, req_type}));
    }

    const handle_validation_response = (xhr) =>{
        if (xhr.status === 200){
            setImgURL(JSON.parse(xhr.response).img_url);
            setValidQR(true);
            return;
        }
        if (xhr.status === 404){
            setValidQR(false);
            AsyncAlert("Invalid QR code!", "Scan Again or Create New Customer");
            return;
        }

    }

    // Check permissions and return the screens
    if (hasPermission === null) {
        return (
            <View style={styles.container}>
                <Text>Requesting for camera permission</Text>
            </View>
        );
    }
    if (hasPermission === false) {
        return (
            <View style={styles.container}>
                <Text style={{ margin: 10 }}>No access to camera</Text>
                <Button title={'Allow Camera'} onPress={() => askForCameraPermission()} />
            </View>
        );
    }

    // Return the View
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.confirm_cancel}>
                <Button title={"Logout"} onPress={()=> logout()} color={"tomato"}/>
            </View>
            <View style={styles.confirm_cancel}>
                <Button title={"Lost&Found"} onPress={()=> lost_found()} color={"black"}/>
                <Button title={"New Customer"} onPress={() => new_customer()}/>
            </View>
            <View style={styles.barcodebox}>
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={{ height: 200, width: 200 }}
                />
            </View>
            <View>
                <Image
                    style={{ width: 200, height: 200 }}
                    source={{
                        uri: img_url,
                        }}
                />
            </View>
            <View style={styles.confirm_cancel}>
                {scanned && validQR && <Button title={'Confirm'} onPress={() => on_confirm()} color='tomato' />}
                {scanned && validQR && <Button title={'Cancel'} onPress={()=> on_cancel()}></Button>}
            </View>
        </SafeAreaView>
        );
    }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  maintext: {
    fontSize: 16,
    margin: 20,
  },
  barcodebox: {
    // alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    width: 200,
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: 'tomato'
  },
  itemText: {
    color: '#4bd6e3',
    fontSize: 24
  },
  confirm_cancel:{
    flexDirection: "row",
    marginLeft: 20,
    justifyContent: 'space-evenly',
  },
});
