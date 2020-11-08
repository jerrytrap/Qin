import React, { useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import DrawerScreen from "./screens/Tabs/sidebar/home";
import MyTabs from "./screens/Tabs";
import myProfile from "./screens/Tabs/sidebar/myProfile";
import myGame from "./screens/Tabs/sidebar/myGame";
import SplashScreen from 'react-native-splash-screen';
import LoginScreen from './screens/Tabs/login';

// 드로워를 쓰겠다고 선언. 리엑트 네비게이션에 들어있는 함수다!
const Drawer = createDrawerNavigator();

// 드로워에 대한 선언
export default function MyDrawer() {
    useEffect(() => {
        SplashScreen.hide();
      }, [])
    return (
        <>
            <NavigationContainer>
                <Drawer.Navigator
                    drawerContent={(props) => <DrawerScreen {...props} />}
                    drawerStyle={{ width: '75%' }}
                    drawerContentOptions={{
                        activeTintColor: '#e91e63',
                        itemStyle: { marginVertical: 30 },
                    }}
                >

                    {/*드로워에 대한 스크린 선언*/}
                    <Drawer.Screen name="tabs" component={MyTabs} />
                    <Drawer.Screen name="myProfile" component={myProfile}/>
                    <Drawer.Screen name="myGame" component={myGame} />
                </Drawer.Navigator>
            </NavigationContainer>
        </>
  );
}
