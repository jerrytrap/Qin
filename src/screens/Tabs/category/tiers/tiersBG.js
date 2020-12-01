import React, {Component, useState, useEffect} from 'react';
import {ScrollView, View, StyleSheet, Image, Text, TouchableOpacity, ToastAndroid} from 'react-native';
import server from '../../../../../server.json'
import axios from 'axios';

const tiers = [
    {id: 'BEGINNER'},
    {id: 'NOVICE'},
    {id: 'EXPERIENCED'},
    {id: 'SKILLED'},
    {id: 'SPECIALIST'},
    {id: 'EXPERT'},
    {id: 'SURVIVOR'},
];

const showToast = () => {
    ToastAndroid.show("아이디를 먼저 등록해주세요.", ToastAndroid.SHORT);
  };

// url로부터 데이터 get
let getDatas = async (url) => await axios.get(url)
    .then(function (response) {
        console.log(response.data)
        return response.data
    })
    .catch(function (error) {
        console.log(url)
        console.log('error : ' + error);
    });

function tiersBG({ navigation, route }) {

    const [gameID, setGameID] = useState([]);
    let uID = route.params.uID;
    uID = uID.replace('\"', '').replace('\"', '')
    useEffect(() => {
            const unfetched = navigation.addListener('focus', async () => {
                setGameID(await getDatas(server.ip + '/category/gameID?uID=' + uID + '&game=BG'))
            });
        
            return unfetched;
        }, [navigation]);        
        
        return (
            <View style={styles.container}>
                <View style={styles.gameImage}>
                    <View style={styles.item}>

                        {gameID.length > 0 ? 
                        <Image
                        style={{height: 80, width: 80, resizeMode: 'contain'}}
                        source={require('../../../../image/id_y.png')}
                        />
                        : 
                        <Image
                            style={{height: 80, width: 80, resizeMode: 'contain'}}
                            source={require('../../../../image/id_g.png')}
                        />}
                        
                        {gameID.length > 0 ? 
                        <Text style={{paddingEnd: 40, fontSize: 18}}>{gameID[0].gameID}</Text>
                        : 
                        <Text style={{paddingEnd: 40}}>등록이 필요합니다.</Text>}
                        
                    </View>
                    <Image
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            height: 200,
                            width: '100%',
                            resizeMode: 'cover',
                        }}
                        source={require('../../../../image/img_bg_bg.png')}
                    />
                </View>
                <ScrollView style={styles.sView}>

                    {/* tiers에 대해서 map을 돌려 tiers 목록이 생기게끔 만든다. */}

                    {tiers.map((data, index) => {
                        return (
                                <View style={styles.sItem} >
                                    <TouchableOpacity
                                        style={{
                                            paddingStart: 8,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                        }}
                                        onPress={
                                            gameID.length > 0 ? 
                                            // data.id를 이용해서 선택된 tier를 roomsLOL에 파라미터로 넘겨준다.
                                            async () => navigation.navigate('roomsBG', {dataroom: [data.id, uID]})
                                            :
                                            async () => showToast()
                                        }>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'flex-start',
                                            }}>
                                            <Text style={{paddingEnd: 20, fontSize: 40, fontWeight: 'bold'}}>
                                                ·
                                            </Text>
                                            <Text style={{fontSize: 30, fontWeight: 'bold'}}>
                                                {/* tier를 출력 */}
                                                {data.id}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'flex-end',
                                                flex: 1,
                                            }}>
                                            <Image
                                                style={{height: 80, width: 80, resizeMode: 'cover'}}
                                                source={require('../../../../image/img_go.png')}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                        );
                    })}
                </ScrollView>
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
    gameImage: {
        height: 270,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 140,
    },
    sView: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 0,
        elevation: 0,
        paddingHorizontal: 30,
    },
    item: {
        width: 284,
        height: 86,
        backgroundColor: 'white',
        borderRadius: 20,
        elevation: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    sItem: {
        width: '100%',
        height: 80,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 0,
        borderBottomWidth: 0.5,
        borderBottomColor: 'gray',
    },
});

export default tiersBG;
