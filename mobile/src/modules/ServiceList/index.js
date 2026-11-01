// Imports
import React from 'react';
import { Query } from 'react-apollo';
import moment from 'moment';
import { Content, Text } from 'native-base';
import styles from './styles';
import Loading from '../Loading';
import ServiceListEmpty from '../ServiceListEmpty';
import ServiceListItem from '../ServiceListItem';
import { SERVICE_GET_ALL_BY_USER_TOKEN } from '../../graphql';

const ServiceList = () => (
  <Query query={SERVICE_GET_ALL_BY_USER_TOKEN} pollInterval={2000}>
    {({ loading, error, data }) => {
      if (loading) return <Loading />;
      if (error) return <Text>An Error Occured</Text>;
      if (data.serviceGetAllByUserToken.length === 0) {
        return (<ServiceListEmpty />);
      }
      return (
        <Content style={styles.container}>
          <Text style={styles.label}>Upcoming</Text>
          { data.serviceGetAllByUserToken
            .filter(service => moment(service.date)
            .isAfter(moment()))
            .map(service => <ServiceListItem service={service} key={service.id} />) }
          <Text style={styles.label}>History</Text>
          { data.serviceGetAllByUserToken
            .filter(service => moment(service.date)
            .isBefore(moment()))
            .map(service => <ServiceListItem service={service} key={service.id} />) }
        </Content>
      );
    }}
  </Query>
);

export default ServiceList;
