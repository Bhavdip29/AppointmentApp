import { CommonActions } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import { getDatabase } from '../../db/database';
import { COLORS } from '../../utils/Colors';
import { showToast } from '../../utils/commonUtils';
import { height, width } from '../../utils/Responsive';

const Feedback = ({navigation}: any) => {
  const db = getDatabase();
  const [rating, setRating] = useState(0);

  const handleRating = () => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO Feedback (rating) VALUES (?)',
        [rating],
        () => {
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{name: 'Dashboard'}],
            }),
          );
          showToast('Your feedback has been recorded.');
        },
        err => console.error('Error saving feedback:', err),
      );
    });
  };

  return (
    <View style={styles.container}>
      <Modal visible={true} transparent>
        <View
          style={{
            height: height,
            width: width,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: width * 0.8,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 8,
            }}>
            <Text style={styles.title}>Rate Our System</Text>
            <Text style={styles.subtitle}>
              "How do you like our booking system?"
            </Text>

            <View style={styles.stars}>
              <AirbnbRating
                onFinishRating={rating => {
                  console.log('Rating', rating);
                  setRating(rating);
                }}
                showRating={false}
                defaultRating={rating}
              />
            </View>

            <TouchableOpacity
              onPress={() => {
                handleRating();
              }}
              style={{
                height: 40,
                width: '100%',
                backgroundColor: COLORS.primaryOragne,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 30,
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
              }}>
              <Text
                style={{color: COLORS.black, fontWeight: 'bold', fontSize: 18}}>
                Submit Rating
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.black,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: COLORS.black,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'medium',
    marginVertical: 20,
    color: COLORS.grey,
    textAlign: 'center',
  },
  stars: {flexDirection: 'row', marginBottom: 20},
  star: {fontSize: 40, marginHorizontal: 5, color: '#ccc'},
  selected: {color: '#FFD700'},
});

export default Feedback;
