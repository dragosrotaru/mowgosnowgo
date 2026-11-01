// Imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { withNavigation } from 'react-navigation';
import moment from 'moment';
import {
  Button,
  Card,
  CardItem,
  Container,
  Content,
  Form,
  Icon,
  Label,
  Text,
  Toast,
} from 'native-base';
import { View, Modal } from 'react-native';
import styles from './styles';
import Loading from '../Loading';
import Menu from '../Menu';
import { SERVICE_GET_BY_ID, SERVICE_CANCEL_BY_ID } from '../../graphql';

class ServiceDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      modal: false,
    };
    this.goBack = () => this.props.navigation.goBack();
    this.openModal = () => this.setState({ modal: true });
    this.closeModal = () => this.setState({ modal: false });
    this.submit = async (client) => {
      this.setState({ loading: true });
      try {
        await client.mutate({
          mutation: SERVICE_CANCEL_BY_ID,
          variables: {
            id: this.props.navigation.state.params.serviceId,
          },
        });
        this.closeModal();
        Toast.show({
          text: 'Service Cancelled! We will email you a confirmation',
          buttonText: 'Okay',
        });
        this.props.navigation.navigate('home');
      } catch (error) {
        this.setState({ loading: false });
      }
    };
  }

  render() {
    return (
      <Query
        query={SERVICE_GET_BY_ID}
        variables={{ id: this.props.navigation.state.params.serviceId }}
      >
        {({
 loading, error, data, client,
}) => {
          if (loading) return <Loading />;
          if (error) return <Text>An Error Occured</Text>;
          const service = data.serviceGetByID;
          return (
            <Menu title="  Service">
              <Container>
                <Modal
                  animationType="slide"
                  transparent={false}
                  visible={this.state.modal}
                  onRequestClose={() => {}}
                >
                  <Container style={styles.modalContainer}>
                    <Container>
                      <Text>
                        Are you sure you wish to cancel? If you've made the request more than 24
                        hours ago, a $20 charge will apply.
                      </Text>
                    </Container>
                    <Container style={styles.modalButtons}>
                      <Button bordered dark onPress={() => this.closeModal(client)}>
                        <Text>Nevermind</Text>
                      </Button>
                      <Button
                        danger
                        disabled={this.state.loading || service.status === 'completed'}
                        onPress={() => this.submit(client)}
                      >
                        <Text>Cancel Service</Text>
                      </Button>
                    </Container>
                  </Container>
                </Modal>
                <Content style={styles.content}>
                  <Form style={styles.form}>
                    <Label style={styles.label}>Status</Label>
                    <Card style={styles.card}>
                      <CardItem style={styles.cardItem}>
                        <Text>
                          {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                        </Text>
                        <Icon name="ios-star" style={styles.icon} />
                      </CardItem>
                    </Card>
                    <Label style={styles.label}>Price (CAD) Excluding Tax</Label>
                    <Card style={styles.card}>
                      <CardItem style={styles.cardItem}>
                        <Text>
                          {service.price.toFixed(2) > 0
                            ? `$${service.price.toFixed(2)}`
                            : 'CUSTOM JOB'}
                        </Text>
                        <Icon name="ios-card" style={styles.icon} />
                      </CardItem>
                    </Card>
                    <Label style={styles.label}>Location</Label>
                    <Card style={styles.card}>
                      <CardItem style={styles.cardItem}>
                        <Text style={styles.location}>{service.address}</Text>
                        <Icon name="map" style={styles.icon} />
                      </CardItem>
                    </Card>
                    <Label style={styles.label}>Complete By</Label>
                    <Card style={styles.card}>
                      <CardItem style={styles.cardItem}>
                        <Text>{moment(service.date).format('MMM D YYYY')}</Text>
                        <Icon name="calendar" style={styles.icon} />
                      </CardItem>
                    </Card>
                    <Label style={styles.label}>Job Type</Label>
                    <Card style={styles.card}>
                      <CardItem style={styles.cardItem}>
                        <Text>{service.type}</Text>
                        <Icon name="ios-arrow-down" style={styles.icon} />
                      </CardItem>
                    </Card>
                    {service.size !== null ? (
                      [
                        <Label key="label" style={styles.label}>
                          Job Size
                        </Label>,
                        <Card key="card" style={styles.card}>
                          <CardItem style={styles.cardItem}>
                            <Text>{service.size}</Text>
                            <Icon name="ios-arrow-down" style={styles.icon} />
                          </CardItem>
                        </Card>,
                      ]
                    ) : (
                      <View />
                    )}
                    {service.extras !== null && service.extras.length > 0 ? (
                      [
                        <Label key="label" style={styles.label}>
                          Extras
                        </Label>,
                        <Card key="card" style={styles.card}>
                          <CardItem style={styles.cardItem}>
                            <Text>{[service.extras.join(', ').slice(0, 35), '...'].join('')}</Text>
                            <Icon name="checkbox" style={styles.icon} />
                          </CardItem>
                        </Card>,
                      ]
                    ) : (
                      <View />
                    )}
                    {service.comments !== null ? (
                      [
                        <Label key="label" style={styles.label}>
                          Comments
                        </Label>,
                        <Card key="card" style={styles.card}>
                          <CardItem style={styles.cardItem}>
                            <Text>{[service.comments.slice(0, 35), '...'].join('')}</Text>
                            <Icon name="clipboard" style={styles.icon} />
                          </CardItem>
                        </Card>,
                      ]
                    ) : (
                      <View />
                    )}
                  </Form>
                </Content>
                <View style={styles.footer}>
                  <Button bordered dark onPress={this.goBack}>
                    <Text>Go Back</Text>
                  </Button>
                  <Button
                    danger
                    disabled={
                      this.state.loading ||
                      (service.status !== 'Requested' && service.status !== 'Approved')
                    }
                    onPress={() => this.openModal(client)}
                  >
                    <Text>Cancel Service</Text>
                  </Button>
                </View>
              </Container>
            </Menu>
          );
        }}
      </Query>
    );
  }
}
ServiceDetails.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.shape({
      params: PropTypes.shape({
        serviceId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default withNavigation(ServiceDetails);
