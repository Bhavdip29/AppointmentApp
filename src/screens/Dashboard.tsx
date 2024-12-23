import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../utils/Colors';

const Dashboard = ({navigation}: any) => {
  useEffect(() => {}, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Dashboard!</Text>

      {/* Button for User Flow */}
      <TouchableOpacity
        onPress={() => navigation.navigate('AppointmentList')}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: 10,
          backgroundColor: '#fbeeff',
          height: 80,
          width: 80,
          borderRadius: 8,
          borderColor: '#691883',
          borderWidth: 1,
          elevation: 10,
        }}>
        <Entypo name="users" size={25} color={'#691883'} />
        <Text
          style={{
            marginTop: 5,
            fontWeight: 'bold',
            color: '#691883',
          }}>
          User
        </Text>
      </TouchableOpacity>

      {/* Button for Appointment Flow (Admin Flow) */}
      <TouchableOpacity
        onPress={() => navigation.navigate('AppointmentManagement')}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: 10,
          backgroundColor: '#fbeeff',
          height: 80,
          width: 80,
          borderRadius: 8,
          borderColor: '#691883',
          borderWidth: 1,
          elevation: 10,
          marginTop: 20,
        }}>
        <MaterialIcons name="verified-user" size={25} color={'#691883'} />
        <Text
          style={{
            marginTop: 5,
            fontWeight: 'bold',
            color: '#691883',
          }}>
          Admin
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.black,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    color: COLORS.white,
  },
});

export default Dashboard;
