import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Dashboard from '../screens/Dashboard';
import AppointmentForm from '../screens/User/AppointmentForm';
import AppointmentList from '../screens/User/AppointmentList';
import Feedback from '../screens/User/Feedback';
import ThankYouScreen from '../screens/User/Thankyou';
import AppointmentManagement from '../screens/Admin/AppointmentManagement';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerShown: false,
        }}>
        {/* Dashboard Screen */}
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{title: 'Dashboard'}}
        />
        {/* User Flow Screens */}
        <Stack.Screen
          name="AppointmentForm"
          component={AppointmentForm}
          options={{title: 'Book Appointment'}}
        />
        <Stack.Screen
          name="AppointmentList"
          component={AppointmentList}
          options={{title: 'Your Appointments'}}
        />
        <Stack.Screen
          name="Feedback"
          component={Feedback}
          options={{title: 'Feedback'}}
        />
        <Stack.Screen
          name="ThankYouScreen"
          component={ThankYouScreen}
          options={{title: 'ThankYouScreen'}}
        />

        {/* Admin Flow Screens */}
        <Stack.Screen
          name="AppointmentManagement"
          component={AppointmentManagement}
          options={{title: 'Manage Appointments'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
