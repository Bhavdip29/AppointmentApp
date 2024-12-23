import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../utils/Colors';
import { width } from '../../utils/Responsive';

const ThankYouScreen = ({navigation}: any) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/thank-you.png')} // Replace with your image
        style={styles.image}
      />
      {/* <Text style={styles.title}>Thank You!</Text> */}
      <Text style={styles.subtitle}>
        Your appointment has been successfully booked.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace('Feedback')} // Replace 'HomeScreen' with your desired screen
      >
        <Text style={styles.buttonText}>Provide Feedback</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: width * 0.8,
    height: 200,
    resizeMode: 'contain',
    // marginBottom: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: COLORS.primaryOragne,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    color: COLORS.black,
    fontWeight: 'bold',
  },
});

export default ThankYouScreen;
