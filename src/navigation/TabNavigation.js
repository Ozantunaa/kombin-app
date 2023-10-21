import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Discover from '../screens/Discover';
import Shop from '../screens/Shop';
import Upload from '../screens/Upload';
import Settings from '../screens/Settings';
import Market from '../screens/Market';
import { StyleSheet, Text, View } from 'react-native';


const Tab = createBottomTabNavigator();

const TabNavigation = () => {
    return (
        <Tab.Navigator
            sceneContainerStyle={{ backgroundColor: 'white' }}
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
                name='Discover'
                component={Discover}
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
                name='Settings'
                component={Settings}
                options={{
                    tabBarLabel: 'Ayarlar',
                    headerShown: false
                }}
            />

        </Tab.Navigator>
    )
}

export default TabNavigation

const styles = StyleSheet.create({
})