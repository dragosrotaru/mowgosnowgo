// Imports
import React from 'react';
import { Container, Text } from 'native-base';
import styles from './styles';

const ServiceListEmpty = () => (
  <Container style={styles.container}>
    <Text style={styles.text}>
      No services have been requested yet. Press on the bottom right icon to make a new request!
    </Text>
  </Container>
);

export default ServiceListEmpty;
