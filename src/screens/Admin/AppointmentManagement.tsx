// src/screens/Admin/AppointmentManagement.tsx
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getDatabase } from '../../db/database';
import { COLORS } from '../../utils/Colors';
import { STATUS } from '../../utils/commonUtils';
import {
  cancelLocalNotification
} from '../../utils/notificationService';

const AppointmentManagement = ({navigation}: any) => {
  const db = getDatabase();

  const [appointments, setAppointments] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);

  useEffect(() => {
    fetchAppointments();
    fetchFeedbackStats();
  }, []);

  const fetchAppointments = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Appointments',
        [],
        (_, {rows}) => {
          const data = [];
          for (let i = 0; i < rows.length; i++) {
            data.push(rows.item(i));
          }
          setAppointments(data);
        },
        err => console.error('Error fetching appointments:', err),
      );
    });
  };

  const fetchFeedbackStats = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT AVG(rating) as averageRating, COUNT(rating) as totalRatings FROM Feedback',
        [],
        (_, {rows}) => {
          if (rows.length > 0) {
            setAverageRating(rows.item(0).averageRating || 0);
            setTotalRatings(rows.item(0).totalRatings || 0);
          }
        },
        err => console.error('Error fetching feedback stats:', err),
      );
    });
  };

  const updateAppointmentStatus = (
    id: number,
    status: string,
    time: string,
  ) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE Appointments SET status = ? WHERE id = ?',
        [status, id],
        () => {
          Alert.alert('Success', `Appointment marked as ${status}.`);

          if (status == 'Cancelled') {
            cancelLocalNotification(id, time);
          }
          fetchAppointments();
        },
        err => console.error('Error updating appointment status:', err),
      );
    });
  };

  const renderAppointment = ({item}: any) => {
    const isCancelled = item.status == STATUS.Cancelled;
    const isDone = item.status == STATUS.Done;

    return (
      <View style={styles.appointmentCard}>
        <Text style={styles.appointmentText}>Name: {item.name}</Text>
        <Text style={styles.appointmentText}>Contact: {item.contact}</Text>
        <Text style={styles.appointmentText}>Date: {item.date}</Text>
        <Text style={styles.appointmentText}>Time: {item.time}</Text>
        <Text style={styles.appointmentText}>
          Reason: {item.reason || 'N/A'}
        </Text>
        <Text style={styles.appointmentText}>Status: {item.status}</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.cancelButton,
              {backgroundColor: isCancelled ? 'grey' : COLORS.red},
            ]}
            disabled={isCancelled ? true : false}
            onPress={() =>
              updateAppointmentStatus(item.id, STATUS.Cancelled, item.time)
            }>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.doneButton,
              {backgroundColor: isDone ? 'grey' : COLORS.green},
            ]}
            disabled={isDone ? true : false}
            onPress={() =>
              updateAppointmentStatus(item.id, STATUS.Done, item.time)
            }>
            <Text style={styles.buttonText}>Mark Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={25} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Admin Appointment Management</Text>
      </View>

      <View style={styles.feedbackContainer}>
        <Text style={styles.feedbackText}>
          Average Rating: {averageRating.toFixed(1)}
        </Text>
        <Text style={styles.feedbackText}>Total Ratings: {totalRatings}</Text>
      </View>

      <FlatList
        data={appointments}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={renderAppointment}
        contentContainerStyle={styles.listContainer}
      />
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginTop: 5,
  },
  feedbackContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: COLORS.primaryOragne,
    borderRadius: 8,
  },
  feedbackText: {
    color: COLORS.black,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 20,
  },
  appointmentCard: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  appointmentText: {
    color: COLORS.black,
    marginBottom: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: COLORS.red,
    padding: 10,
    borderRadius: 5,
  },
  doneButton: {
    backgroundColor: COLORS.green,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AppointmentManagement;
