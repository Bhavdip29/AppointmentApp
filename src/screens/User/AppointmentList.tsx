// src/screens/User/AppointmentList.tsx
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getDatabase } from '../../db/database';
import { COLORS } from '../../utils/Colors';

const AppointmentList = ({navigation, route}: any) => {
  const db = getDatabase();
  const [appointments, setAppointments] = useState<any>([]);

  // Re-fetch appointments when the screen is focused or reload flag is passed
  const {reload} = route.params || {};

  const fetchAppointments = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Appointments', // Query to fetch appointments
        [],
        (_, {rows}: any) => {
          const appointments = rows.raw(); // Extract the array of rows
          console.log('Fetched appointments:', appointments);
          setAppointments(appointments); // Update state with fetched data
        },
        err => {
          console.error('Error fetching appointments:', err);
        },
      );
    });
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const RenderAppointeMent = ({item}: any) => {
    const name = item.name;
    const contact = item.contact;
    const date = item.date;
    const time = item.time;
    const reason = item.reason;
    const status = item.status;
    const dateObj = moment(date, 'MM/DD/YYYY');

    // Get the date object with date, month, and year
    const convertedDate = {
      date: dateObj.date(),
      Month: dateObj.format('MMM'), // Get the month in 3-letter abbreviation
      Year: dateObj.year(),
    };

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 10,
          marginVertical: 7,
          elevation: 10,
          backgroundColor: '#353535',
          borderRadius: 8,
        }}>
        <View
          style={{
            width: '25%',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 5,
          }}>
          <Text
            style={{
              fontSize: 30,
              color: COLORS.primaryOragne,
              fontWeight: 'bold',
              alignSelf: 'center',
            }}>
            {convertedDate.date}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: 'white',
              fontWeight: 'bold',
              alignSelf: 'center',
            }}>
            {`${convertedDate.Month}, ${convertedDate.Year}`}
          </Text>
        </View>

        <View
          style={{
            width: '80%',
            padding: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>{`Name:`}</Text>
            <Text style={{color: 'white'}}>{` ${name}`}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{color: 'white', fontWeight: 'bold'}}>{`Contact:`}</Text>
            <Text style={{color: 'white'}}>{` ${contact}`}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>{`Time:`}</Text>
            <Text style={{color: 'white'}}>{` ${time}`}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Text
              style={{color: 'white', fontWeight: 'bold'}}>{`reason:`}</Text>
            <Text style={{color: 'white', flex: 1}}>{` ${reason}`}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 5,
            }}>
            <Text
              style={{color: 'white', fontWeight: 'bold'}}>{`Status:`}</Text>
            <Text
              style={{
                color:
                  status === 'Done'
                    ? COLORS.green
                    : status === 'Pending'
                    ? COLORS.primaryOragne
                    : COLORS.red,
                fontWeight: 'bold',
              }}>
              {` ${status}`}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderItem = ({item}: any) => <RenderAppointeMent item={item} />;

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'light-content'} backgroundColor={'black'} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 30,
        }}>
        <TouchableOpacity
          style={{marginTop: 5}}
          onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={25} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Appointment Form</Text>
      </View>
      {appointments && appointments.length > 0 && (
        <FlatList
          data={appointments}
          renderItem={renderItem}
          style={{
            marginVertical: 10,
          }}
          contentContainerStyle={{
            backgroundColor: 'black',
          }}
          keyExtractor={(item: any) => item.id.toString()}
        />
      )}
      <TouchableOpacity
        onPress={() => navigation.navigate('AppointmentForm')}
        style={{
          height: 50,
          width: 50,
          borderRadius: 25,
          backgroundColor: COLORS.primaryOragne,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          bottom: 20,
          right: 20,
        }}>
        <Entypo name="plus" size={22} color={'black'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: 'black'},
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.purple,
  },
  item: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default AppointmentList;
