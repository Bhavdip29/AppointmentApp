// src/screens/User/AppointmentForm.tsx
import moment from 'moment';
import React, { useState } from 'react';
import { Alert, Keyboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import InputWithLabel from '../../components/InputWithLabel';
import { getDatabase } from '../../db/database';
import { COLORS } from '../../utils/Colors';
import { CHANNEL_IDS, createChannel } from '../../utils/notificationService';

const AppointmentForm = ({navigation}: any) => {
  const db = getDatabase();

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (!name || !contact || !date || !time) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO Appointments (name, contact, date, time, reason, status) VALUES (?, ?, ?, ?, ?, ?)',
        [name, contact, date, time, reason, 'Pending'],
        (_, result) => {
          console.log('DTAA', result.insertId);
          const appointmentObj = {
            date: date,
            time: time,
            id: result.insertId,
          };
          scheduleNotifications(appointmentObj);
          navigation.navigate('ThankYouScreen', {reload: true}); // Add reload flag here
        },
        err => console.error('Error inserting appointment:', err),
      );
    });
  };

  const scheduleNotifications = (appointment: any) => {
    const appointmentDateTime = moment(
      `${appointment.date} ${appointment.time}`,
      'MM/DD/YYYY HH:mm',
    );
    console.log('Appoint ment date time', appointmentDateTime);

    // 1 Day Before
    const oneDayBefore = appointmentDateTime.clone().subtract(1, 'day');
    if (oneDayBefore.isAfter(moment())) {
      const channelId = `${CHANNEL_IDS.ONE_DAY}-${appointment.id}`;
      const notificationMessage = `Reminder: You have an appointment tomorrow at ${appointment.time}.`;
      createChannel({
        channelId,
        date: oneDayBefore.toDate(),
        message: notificationMessage,
        title: 'Appointment Scheduled',
      });
    }

    // 2 Hours Before
    const twoHoursBefore = appointmentDateTime.clone().subtract(2, 'hours');
    if (twoHoursBefore.isAfter(moment())) {
      const channelId = `${CHANNEL_IDS.TWO_HOURS}-${appointment.id}`;
      const notificationMessage = `Reminder: Your appointment is in 2 hours at ${appointment.time}.`;
      createChannel({
        channelId,
        date: twoHoursBefore.toDate(),
        message: notificationMessage,
        title: 'Appointment Scheduled',
      });
    }
  };

  const fetchBookedSlots = async () => {
    const db = getDatabase();
    const bookedSlots: string[] = [];

    await new Promise<void>(resolve => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT time FROM Appointments WHERE date = ?',
          [date], // Fetch slots for the selected date
          (_, {rows}) => {
            for (let i = 0; i < rows.length; i++) {
              bookedSlots.push(rows.item(i).time);
            }
            resolve();
          },
          err => {
            console.error('Error fetching booked slots:', err);
            resolve();
          },
        );
      });
    });

    return bookedSlots;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={1} onPress={() => Keyboard.dismiss()}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 30,
          }}>
          <TouchableOpacity
            style={{marginTop: 5}}
            onPress={() => navigation.goBack()}>
            <MaterialIcons
              name="arrow-back-ios"
              size={25}
              color={COLORS.white}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Appointment Form</Text>
        </View>
        <InputWithLabel
          label="Patient Name"
          value={name}
          isRequired
          placeHolderText={'Enter patient name'}
          onChangeText={setName}
        />
        <InputWithLabel
          label="Contact No"
          value={contact}
          isContact
          isRequired
          placeHolderText={'Enter contact number'}
          onChangeText={setContact}
          isDatePicker={false} // Just to disable the date picker
        />
        <InputWithLabel
          label="Date"
          value={date}
          isRequired
          placeHolderText={'Enter date'}
          onChangeText={setDate}
          isDatePicker={true} // Enables date picker
          onDateChange={(date: moment.MomentInput) => {
            const formattedDate = moment(date).format('YYYY-MM-DD');
            setDate(formattedDate);
          }}
        />
        <InputWithLabel
          label="Time"
          value={time}
          isRequired
          placeHolderText={'Enter time'}
          isTimeSlotPicker={true}
          selectedDate={date}
          fetchBookedSlots={fetchBookedSlots}
          onTimeSlotSelect={async (data: any) => {
            if (data) {
              setTime(data);
            }
          }}
        />
        <InputWithLabel
          label="Reason (Optional)"
          value={reason}
          placeHolderText={'Enter reason'}
          onChangeText={setReason}
          isDatePicker={false} // Just to disable the date picker
        />

        <TouchableOpacity
          onPress={handleSubmit}
          style={{
            height: 40,
            width: '100%',
            backgroundColor: COLORS.primaryOragne,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 50,
            borderRadius: 8,
          }}>
          <Text style={{color: COLORS.black, fontWeight: 'bold', fontSize: 18}}>
            Submit
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: COLORS.black},
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.purple,
  },
});

export default AppointmentForm;
