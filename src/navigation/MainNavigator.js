import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigation from './TabNavigation';
import LogInScreen from '../screens/LogInScreen';
import { useDispatch, useSelector } from 'react-redux';
import { setUserInfo } from '../store/userSlice';
import { checkPreviousSignIn } from '../utils/checkPreviousSignIn';
import LoadingScreen from '../screens/LoadingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import Discover from '../screens/Discover';


const Stack = createStackNavigator();

export const ProfileStack = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen
      name='Profil'
      component={ProfileScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name='EditProfileScreen'
      component={EditProfileScreen}
      options={{
        headerTitle: 'Profili Düzenle',
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: '#fff',
          elevation: 0
        }
      }}
    />
  </Stack.Navigator>
);
export const DiscoverStack = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen
      name='Discover'
      component={Discover}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name='DiscoverProfile'
      component={ProfileScreen}
      options={{
        title: '',
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: '#fff',
          elevation: 0
        }
      }}
    />
  </Stack.Navigator>
);
const MainNavigator = () => {
  const isLoggedIn = useSelector(state => state.user.isLoggedIn);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const userInfo = await checkPreviousSignIn();
      if (userInfo) {
        dispatch(setUserInfo(userInfo));
      }
      setLoading(false);
    };

    fetchData();
  }, [dispatch]);

  return (
    <Stack.Navigator>
      {loading ? (
        <Stack.Screen name="Loading" component={LoadingScreen} options={{ headerShown: false }} />
      ) : isLoggedIn ? (
        <Stack.Screen
          name="TabNavigator"
          component={TabNavigation}
          options={{
            headerShown: false,
          }}
        />
      ) : (
        <Stack.Screen
          name="LogInScreen"
          component={LogInScreen}
          options={{
            headerShown: false,
          }}
        />
      )}
    </Stack.Navigator>
  );
};

export default MainNavigator;
