import React, { useState, useEffect } from 'react';
import {ScrollView, View, StyleSheet, Image, Text, TouchableOpacity, RefreshControl} from 'react-native';
import server from '../../../../../server.json'
import axios from 'axios';
const qs = require('qs');
const date = new Date();

// rooms에서 한것과 동일. 새로고침시에 기다리기, Data get방식, post방식 요청
const wait = (timeout) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }
let getDatas = async (url) => await axios.get(url)
    .then(function (response) {
        console.log(response.data)
        return response.data
    })
    .catch(function (error) {
        console.log(url)
        console.log('error : ' + error);
    });
let postDatas = async (url, uID, roomID, position) => await axios({
    method: 'post',
    url: url,
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify({
      uID: uID,
      roomID: roomID,
      position: position
    })
  });
let postMails = async (roomID, game) => await axios.get(server.ip + '/mail/evalMail?roomID=' + roomID)
    .then( async (response) => await axios({
    method: 'post',
    url: server.ip + '/mail/sendMails',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify({
      uID: response.data,
      game: game
    })
  }));
function joinedBG({ navigation, route }) {

    let members = route.params.memtitle[0];
    let rTitle = route.params.memtitle[1];
    let roomID = route.params.memtitle[2];
    let userIn = route.params.memtitle[3];

    console.log('방의 ID값 : ' + roomID);

    const [member, setMember] = useState(members)
    const [isJoined, setIsJoined] = useState(member[0].uID == 1 ? true : false); // 방에 첫번째 들어온 사람(만든사람)이 나인지 확인해 나면은 true, 아니면 false로 세팅, 그리고 이게 트루면 나는 이미 joined된거
    const [isError, setIsError] = useState(false);
    const [isUser, setIsUser] = useState(userIn == '' ? false : true); // 방에 내가 들어와있는지 확인
    const [isLeader, setIsLeader] = useState(member[0].uID == 1 ? true : false); // 방에 첫번째 들어온 사람(만든사람)이 나인지 확인해 나면은 true, 아니면 false로 세팅, 그리고 이게 트루면 나는 이미 joined된거

    console.log('내가 이 방에 있는지 여부(방금 들어온거 포함) : ' + isJoined);
    console.log('내가 방에 들어와 있는지 확인(원래 있었는지 확인) : ' + isUser);

    // 새로고침 구현. 멤버를 불러오고, 내가 들어와있는지도 불러온다. 화면 새로고침임.
    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(async() => {
        setRefreshing(true);

        setMember(await getDatas(server.ip + '/category/member?roomID=' + roomID + '&game=BG'));
        setIsUser(await getDatas(server.ip + '/category/ismember?roomID=' + roomID + '&uID=1') == '' ? false : true);
        wait(2000).then(() => setRefreshing(false));
      }, []);
      
    return (
        <View style={styles.container}>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: 60,
                    width: '100%',
                    backgroundColor: '#F2F2F2'
                }}>

                <Text  style={{fontSize: 12, paddingStart: 70, color: '#5E5E5E'}}>
                    게시글은 설정한 시간이 지나면 자동으로 삭제됩니다.
                </Text>

            </View>

            {rTitle.map((data, index) => {
                return(
                    <View style={{
                        width: '100%',
                        height: 70,
                        backgroundColor: '#ffffff',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        paddingTop: 20,
                        paddingBottom: 0,
                        paddingHorizontal: 30
                    }} >
                        <View
                            style={{
                                paddingStart: 8,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                width: '100%',
                            }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    paddingStart: 5
                                }}>

                                <Text style={{fontSize: 32}}>
                                    {data.roomIntro}
                                </Text>


                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                    flex: 1,
                                    padding: 20,
                                    alignItems: 'center'
                                }}>

                                <Text style={{fontSize: 16}}>
                                    {member.length} / {data.total} 명
                                </Text>

                            </View>
                        </View>
                    </View>
                );
            })}


            <ScrollView 
                style={styles.sView}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  }>
                {member.map((data, index) => {

                    let rdate = new Date(data.inTime);
                    rdate.setHours(rdate.getHours() + 9);
                    let intime = rdate.toString().substr(16, 5);

                    return (
                        <View style={{
                            width: '100%',
                            height: 60,
                            backgroundColor: '#ffffff',
                            flexDirection: 'column',
                            alignItems: 'center',
                            borderBottomWidth: 0.5,
                            borderBottomColor: 'gray',
                            justifyContent: 'space-between',
                        }} >
                            <View style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#ffffff',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }} >
                                <View
                                    style={{
                                        paddingStart: 8,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                    }}>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'flex-start',
                                            paddingStart: 5
                                        }}>

                                        <Text style={{fontSize: 16}}>
                                            {data.gameID}
                                        </Text>


                                    </View>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'flex-end',
                                            flex: 1,
                                            padding: 20
                                        }}>

                                        <Text style={{fontSize: 14}}>
                                            {intime}
                                        </Text>

                                    </View>
                                </View>
                            </View>
                        </View>
                    );
                })}
                <View
                    style={isLeader ? {alignItems: 'center', paddingBottom: 30, paddingTop: 20} : {width: 0, height: 0}}>
                    <TouchableOpacity
                        style={{
                            height: 50,
                            width: 180,
                            flexDirection: 'row',
                            borderStyle: 'solid',
                            borderRadius: 100,
                            borderColor: '#00255a',
                            borderWidth: 1,
                            borderTopWidth: 1,
                            backgroundColor: '#00255a',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onPress={async () => {await getDatas(server.ip + '/category/matched?roomID=' + roomID); await postMails(roomID, 'BG'); setIsLeader(false); }}>


                        <Text style={{color: '#ffffff', fontSize: 15, fontWeight: 'bold'}}>
                            매치완료
                        </Text>

                    </TouchableOpacity>
                </View>
                
                <View
                    style={isJoined ? {width: 0, height: 0} : isUser ? {width:0, height: 0} : {alignItems: 'center', paddingBottom: 30, paddingTop: 20}}>
                    <TouchableOpacity
                        style={{
                            height: 50,
                            width: 180,
                            flexDirection: 'row',
                            borderStyle: 'solid',
                            borderRadius: 100,
                            borderColor: '#00255a',
                            borderWidth: 1,
                            borderTopWidth: 1,
                            backgroundColor: '#00255a',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onPress={async () => {await postDatas(server.ip + '/category/join', 1, roomID, ''), setIsJoined(true), onRefresh()}}>


                        <Text style={{color: '#ffffff', fontSize: 15, fontWeight: 'bold'}}>
                            참여하기
                        </Text>

                    </TouchableOpacity>
                </View>
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
        height: 200,
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
    position: {
        height: 35,
        width: 63,
        flexDirection: 'row',
        borderStyle: 'solid',
        borderRadius: 14,
        borderColor: '#E2E2E2',
        borderWidth: 1,
        borderTopWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    positioned: {
        height: 35,
        width: 63,
        flexDirection: 'row',
        borderStyle: 'solid',
        borderRadius: 14,
        borderColor: '#ffffff',
        borderWidth: 1,
        borderTopWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 10,
        backgroundColor: '#ffffff'
    }
});

export default joinedBG;