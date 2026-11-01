// Imports
import React from 'react';
import { Container, Content, Text } from 'native-base';
import styles from './styles';
import Menu from '../Menu';

const About = () => (
  <Menu title="  About Us">
    <Container style={styles.container}>
      <Content>
        <Text style={styles.text}>
          Thank you for signing up with MowGOSnowGO! Over a decade ago, Two Wilfrid Laurier
          University Alumni founded MowGOSnowGO with the hope to provide contract and on-demand
          property maintenance services to all of North America. With a battle-tested team and a
          high standard of service, we are now ready to take the next leap towards our vision –
          We've developed a mobile application that makes our service more accessible to thousands
          of customers across southern Ontario.
        </Text>
        <Text style={styles.text}>
          We care about the challenges of homeowners and small businesses – we face those same
          challenges ourselves! Some clients are in need of long-term year-round maintenance
          contracts, while others are only in need of our services for a short period of time. We
          would like to cater to both target markets by providing discounted contract rates and 24/7
          on-demand services with our app. We are excited to assist you with any yard services you
          may be in need of, your satisfaction is our measure of success.
        </Text>
        <Text style={styles.text}>
          If you encounter any issues please contact us at info@mowgosnowgo.com
        </Text>
      </Content>
    </Container>
  </Menu>
);

export default About;
