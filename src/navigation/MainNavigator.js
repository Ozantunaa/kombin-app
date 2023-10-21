import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigation from './TabNavigation';
import LogInScreen from '../screens/LogInScreen';
import { useDispatch, useSelector } from 'react-redux';
import { setUserInfo } from '../store/userSlice';
import { checkPreviousSignIn } from '../utils/checkPreviousSignIn';
import LoadingScreen from '../screens/LoadingScreen';


const Stack = createStackNavigator();

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
