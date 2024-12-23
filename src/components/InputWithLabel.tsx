// src/components/InputWithLabel.tsx
import {
  IAppointment,
  TimeSlotPicker
} from '@dgreasi/react-native-time-slot-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getDatabase } from '../db/database';
import { COLORS } from '../utils/Colors';
import { showToast } from '../utils/commonUtils';
import { height, width } from '../utils/Responsive';

const fixedSlotTimes = [
  '08:00-09:00',
  '09:00-10:00',
  '10:00-11:00',
  '11:00-12:00',
  '12:00-13:00',
  '13:00-14:00',
  '14:00-15:00',
  '15:00-16:00',
  '16:00-17:00',
  '17:00-18:00',
  '18:00-19:00',
];

const InputWithLabel = ({
  label,
  value,
  placeHolderText,
  onChangeText,
  isTimeSlotPicker,
  onTimeSlotSelect,
  fetchBookedSlots, // Function to fetch booked slots from the database
  selectedDate,
  visibleSlotPicker,
  isRequired,
  isContact,
  onDateChange,
  isDatePicker,
}: any) => {
  const [showModal, setShowModal] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [dateOfAppointment, setDateOfAppointment] =
    useState<IAppointment | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const db = getDatabase();

  useEffect(() => {
    // Contains the selected date, time slot in the following format
    // {"appointmentDate": "2023-08-17T21:00:00.000Z", "appointmentTime": "18:00-19:00"}
  }, [dateOfAppointment]);

  const checkTimeSlotAvailability = async (
    selectedDate: string,
    selectedTime: string,
  ) => {
    return new Promise((resolve, reject) => {
      console.log('SELECTED', selectedDate, selectedTime);
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM Appointments WHERE date = ? AND time = ? AND status != ?',
          [selectedDate, selectedTime, 'Cancelled'],
          (_, {rows}) => {
            console.log('ROWSSS', rows);
            if (rows.length > 0) {
              resolve(false); // Slot is already booked
            } else {
              resolve(true); // Slot is available
            }
          },
          err => {
            console.error('Error checking time slot availability:', err);
            reject(err);
          },
        );
      });
    });
  };

  const handleTimeSlotPress = async () => {
    setShowModal(true);
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(false);
    onDateChange?.(currentDate);
    onChangeText(currentDate.toLocaleDateString());
  };

  const selectSlot = (slot: IAppointment) => {
    setShowModal(false);
    onTimeSlotSelect(slot);
  };

  const handleAppointmentClick = async (data: any) => {
    if (data && showModal) {
      const isAvailable = await checkTimeSlotAvailability(
        selectedDate,
        data.appointmentTime,
      );
      console.log('DATAAA', data, isAvailable);
      if (isAvailable) {
        setShowModal(false);
        onTimeSlotSelect(data.appointmentTime);
      } else {
        showToast('This slot is already booked.');
        setShowModal(true);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} <Text style={{color: COLORS.red}}>*</Text>
      </Text>
      <TouchableOpacity
        onPress={isTimeSlotPicker ? handleTimeSlotPress : undefined}>
        {!isDatePicker && (
          <TextInput
            style={styles.input}
            value={value}
            placeholder={placeHolderText}
            placeholderTextColor={'grey'}
            keyboardType={isContact ? 'number-pad' : 'default'}
            editable={!isTimeSlotPicker}
            onChangeText={onChangeText}
          />
        )}
        {isDatePicker && (
          <TouchableOpacity
            style={[
              {
                height: 40,
                borderColor: COLORS.grey,
                borderWidth: 1,
                paddingHorizontal: 10,
                borderRadius: 5,
                backgroundColor: COLORS.black,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              },
            ]}
            onPress={() => setShowDatePicker(true)}>
            <Text
              style={{
                fontSize: 14,
                color: value ? COLORS.white : 'grey',
              }}>
              {value ? value : placeHolderText}
            </Text>
            <MaterialIcons
              name="calendar-today"
              size={21}
              color="gray"
              style={{alignSelf: 'flex-end', marginBottom: 8}}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          minimumDate={new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      {isTimeSlotPicker && (
        <Modal
          style={{
            height: height * 0.6,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          animationType="slide"
          transparent
          visible={showModal}>
          <TouchableOpacity
            activeOpacity={1}
            style={{
              height: height,
              width: '100%',
              backgroundColor: '0,0,0,0.5',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              setShowModal(false);
            }}>
            <View
              style={{
                width: width * 0.9,
                backgroundColor: 'white',
                borderRadius: 8,
              }}>
              <TimeSlotPicker
                availableDates={[
                  {
                    date: new Date().toISOString(),
                    slotTimes: fixedSlotTimes,
                  },
                ]}
                setDateOfAppointment={handleAppointmentClick}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {marginBottom: 15},
  label: {fontSize: 16, color: COLORS.white, marginBottom: 5},
  input: {
    height: 40,
    borderColor: COLORS.grey,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: COLORS.white,
    backgroundColor: COLORS.black,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  iconContainer: {
    padding: 10,
  },
  modalContent: {
    width: width * 0.9,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  slotButton: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderRadius: 5,
    backgroundColor: COLORS.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotText: {
    color: COLORS.white,
    fontSize: 14,
  },
  closeButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: COLORS.black,
  },
  closeButtonText: {
    color: COLORS.white,
    fontSize: 16,
  },
});

export default InputWithLabel;
