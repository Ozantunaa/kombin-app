import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Discover from '../screens/Discover';
import Shop from '../screens/Shop';
import Upload from '../screens/Upload';
import Market from '../screens/Market';
import { StyleSheet, Text, View } from 'react-native';
import { DiscoverStack, ProfileStack } from './MainNavigator';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
    return (
        <Tab.Navigator
            sceneContainerStyle={{ backgroundColor: 'white' }}
            /* Bu Custom tabbar için */
            /* screenOptions={{
                tabBarShowLabel: true,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 20,
                    height: 100,
                    left: 28,
                    right: 28,
                    borderRadius: 28,
                    elevation: 0,
                    ...styles.shadow,
                    borderTopWidth:0
                },
            }} */
        >
            <Tab.Screen
                name='DiscoverStack'
                component={DiscoverStack}
                options={{
                    tabBarLabel: 'Keşfet',
                    headerShown: false
                }}
            />
            <Tab.Screen
                name='Shop'
                component={Shop}
                options={{
                    tabBarLabel: 'Mağazalar',
                }}
            />
            <Tab.Screen
                name='Upload'
                component={Upload}
                options={{
                    tabBarLabel: 'Yükle',
                }}
            />
            <Tab.Screen
                name='Market'
                component={Market}
                options={{
                    tabBarLabel: 'Market',
                }}
            />
            <Tab.Screen
                name='ProfileStack'
                component={ProfileStack}
                options={{
                    tabBarLabel: 'Profil',
                    headerShown: false,
                }}
            />

        </Tab.Navigator>
    )
}

export default TabNavigation

const styles = StyleSheet.create({
})