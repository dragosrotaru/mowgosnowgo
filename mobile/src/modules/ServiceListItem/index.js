// Imports
import React, { Component } from 'react';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import moment from 'moment';
import { TouchableOpacity } from 'react-native';
import { Text, Card, CardItem, Icon } from 'native-base';
import styles from './styles';

class ServiceListItem extends Component {
  constructor(props) {
    super(props);
    this.viewServiceDetails = (serviceId) => {
      this.props.navigation.navigate('serviceDetails', {
        serviceId,
      });
    };
  }
  render() {
    return (
      <TouchableOpacity onPress={() => this.viewServiceDetails(this.props.service.id)}>
        <Card style={styles.container}>
          <CardItem style={styles.date}>
            <Text style={styles.month}>{ moment(this.props.service.date).format('MMM') }</Text>
            <Text style={styles.day}>{ moment(this.props.service.date).format('D') }</Text>

          </CardItem>
          <CardItem style={styles.details}>
            <Text style={styles.type}>{ this.props.service.type }</Text>
            <Text style={styles.address}>{ this.props.service.address.replace(', Canada', '') }</Text>
          </CardItem>
          <CardItem style={styles.icon}>
            { this.props.service.type === 'Snow Removal' ? <Icon name="ios-snow" /> : <Icon name="ios-leaf" /> }
          </CardItem>
        </Card>
      </TouchableOpacity>
    );
  }
}
ServiceListItem.propTypes = {
  service: PropTypes.shape({
    id: PropTypes.string,
    date: PropTypes.string,
    type: PropTypes.string,
    address: PropTypes.string,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default withNavigation(ServiceListItem);
