import React, {Component, useState, useEffect} from 'react';
import {View, Text, Button, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Platform} from 'react-native';
import { Avatar} from 'react-native-elements';
import server from '../../../../server.json';
import axios from 'axios';
import LoginHome from '../../login/home'
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker'
import { useIsDrawerOpen } from '@react-navigation/drawer'

const uploadPhoto = async (uID, photo) =>{
    const data = new FormData();
    await data.append('photo', {
        uri: photo.uri,
        type: 'image/jpeg',
        name: uID.replace('\"', '').replace('\"', ''),
    })
    
    axios({
    method: 'post',
    url: server.ip + '/image/upload',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: data
  }).catch(function (error) {
    console.log('error : ' + error);
})
console.log('photo_uri................' + photo.uri)}


function DrawerScreen({ navigation }) {

    const [myProfile, setMyProfile] = useState([]);
    const [photo, setPhoto] = useState(require('../../../../src/image/lol_bg.png'));
    const [avatar, setAvatar] = useState(require('../../../../src/image/profile.png'));
    const [title, setTitle] = useState('Profile Photo');
    const isOpen = useIsDrawerOpen()

    const [userName, setUserName] = useState()
    const [intro, setIntro] = useState()
    const [email, setEmail] = useState()
    const [good, setGood] = useState(0)
    const [bad, setBad] = useState(0)


    useEffect(() => {
        if (isOpen) {
            console.log('drawer is opened.............' + isOpen)

            console.log(userName + intro + email + good + bad)

            const id = setInterval(async() => {
                setUserName(await (await AsyncStorage.getItem('userName')).replace('\"', '').replace('\"', ''))
                setIntro(await (await AsyncStorage.getItem('intro')).replace('\"', '').replace('\"', ''))
                setAvatar({uri: server.ip + '/photo' + await (await AsyncStorage.getItem('image')).replace('\"', '').replace('\"', '')})
                setEmail(await (await AsyncStorage.getItem('userID')).replace('\"', '').replace('\"', ''))
                setGood(await (await AsyncStorage.getItem('good')).replace('\"', '').replace('\"', ''))
                setBad(await (await AsyncStorage.getItem('bad')).replace('\"', '').replace('\"', ''))

                console.log(userName + intro + email + good + bad)
              }, 1000);

              console.log(id)
              return () => clearInterval(id);
        }
    }, [isOpen])

    const handlePicker = () => {
        ImagePicker.showImagePicker({}, async (response) => {
          console.log('Response = ', response);
    
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
          } else {
            setAvatar({uri: response.uri});
            setTitle('Updating...'); // image start to upload on server so on header set text is 'Updating..'
            uploadPhoto(await AsyncStorage.getItem('uID'), response)
          }
        });
      };

    function logOut()

    {
        AsyncStorage.clear();
        navigation.navigate("LoginScreen");
    }

    return (

        <View style={styles.container}>
            {/*로그아웃과 떨어트려놓기 위한 view (container의 justifyContent가 space-between이기 때문)*/}
            <View style={{
                flexDirection: 'column',
                backgroundColor: '#ffffff',
                width: '100%',
                paddingHorizontal: 35,
                paddingTop: 30
            }}>
                {/*가장 위에 x표시와 프로필 사진 View*/}
                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    backgroundColor: '#ffffff',
                    justifyContent: 'space-between',
                }}>
                    <View style={{paddingTop: 20}}>
                        <TouchableOpacity
                            onPress={() => {navigation.closeDrawer()}}
                        >
                            <Image
                                style={{
                                    height: 20,
                                    width: 20,
                                    resizeMode: 'cover',
                                }}
                                source={require('../../../../src/image/cancel_1.png')}
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                    onPress={() => handlePicker()}>
                        <Avatar
                            rounded
                            source={avatar}
                            PlaceholderContent={<ActivityIndicator />}
                            size='large'
                        />
                    </TouchableOpacity>

                </View>

                {/*아이디, 이메일, 자기소개 View*/}
                <View style={{
                    flexDirection: 'column',
                    width: '100%',
                    backgroundColor: '#ffffff',
                }}>

                    <Text  style={{fontSize: 30, color: '#000000', paddingVertical: 10}}>
                        {userName}
                    </Text>

                    <Text  style={{fontSize: 14, color: '#000000', paddingVertical: 5}}>
                        {email}
                    </Text>

                    <Text  style={{fontSize: 14, color: '#A5A5A5', paddingVertical: 5}}>
                        {intro}
                    </Text>

                    <View style={{paddingVertical: 25}}>
                        <View style={{
                            width: '100%',
                            height:1,
                            backgroundColor: '#E2E2E2',
                        }}/>
                    </View>


                </View>

                {/*매너지수 View*/}

                <View style={{
                    flexDirection: 'column',
                    width: '100%',
                    backgroundColor: '#ffffff',
                }}>
                    <View style={{ width: '100%', height: 40, flexDirection: 'row', alignItems:'center'}}>
                        <View style={{ width: '50%', height: '100%', flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{ fontSize: 14, color: '#000000', paddingVertical: 5 }}>
                                매너 지수
                            </Text>
                            <Text style={{ marginLeft: '5%' }}>
                                {good}
                            </Text>
                        </View>

                        <View style={{ width: '50%', height: 8, alignItems: 'flex-start', borderWidth: 1, borderColor: '#E2E2E2' }}>
                            <View style={{ width: (good % 100).toString() + '%', height: '100%', backgroundColor: '#FFC81A' }} />
                        </View>
                    </View>

                    <View style={{ width: '100%', height: 40, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: '50%', height: '100%', flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 14, color: '#000000', paddingVertical: 5 }}>
                                비매너 지수
                            </Text>
                            <Text style={{ marginLeft: '5%' }}>
                                {bad}
                            </Text>
                        </View>

                        <View style={{ width: '50%', height: 8, alignItems: 'flex-start', borderWidth: 1, borderColor: '#E2E2E2' }}>
                            <View style={{ width: (bad % 100).toString() + '%', height: '100%', backgroundColor: '#00255A' }} />
                        </View>
                    </View>

                    <View style={{paddingVertical: 25}}>
                        <View style={{
                            width: '100%',
                            height:1,
                            backgroundColor: '#E2E2E2',
                        }}/>
                    </View>


                </View>

                {/*내 게임정보, 프로필 관리 view*/}
                <View style={{
                    flexDirection: 'column',
                    width: '100%',
                    backgroundColor: '#FFFFFF'
                }}>

                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('myGame');
                        }}
                    >
                        <Text  style={{fontSize: 14, color: '#000000', paddingVertical: 5}}>
                            내 게임 정보
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('myProfile');
                        }}
                    >
                        <Text  style={{fontSize: 14, color: '#000000', paddingVertical: 5}}>
                            프로필 관리
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>

            {/*로그아웃 View*/}
            <View
                style={{
                    backgroundColor: '#F7F7F7',
                    width: '100%',
                    height: 50,
                    flexDirection: 'row',
                    alignItems: 'center'
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        logOut()
                    }}
                >
                    <View style={{
                        paddingStart: 35,
                        flexDirection: 'row',
                    }}>
                        <Image
                            style={{
                                height: 30,
                                width: 30,
                                resizeMode: 'cover',
                            }}
                            source={require('../../../../src/image/logout.png')}
                        />
                        <Text  style={{fontSize: 14, color: '#000000', paddingVertical: 6, paddingStart: 10}}>
                            로그아웃
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
});

export default DrawerScreen;
