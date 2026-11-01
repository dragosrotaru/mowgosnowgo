// Imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ApolloConsumer } from 'react-apollo';
import { withNavigation } from 'react-navigation';
import { isLength } from 'validator';
import moment from 'moment';
import {
  ActionSheet,
  Button,
  Body,
  Card,
  CardItem,
  CheckBox,
  Container,
  Content,
  Form,
  Icon,
  Label,
  List,
  ListItem,
  Text,
  Textarea,
  Toast,
} from 'native-base';
import { AsyncStorage, TouchableOpacity, View, WebView } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import styles from './styles';
import { grey2 } from '../../colors';
import Menu from '../Menu';
import config from '../../config';
import { SERVICE_CREATE, USER_GET_BY_TOKEN } from '../../graphql';

function patchPostMessageFunction() {
  const originalPostMessage = window.postMessage;

  function patchedPostMessage(message, targetOrigin, transfer) {
    originalPostMessage(message, targetOrigin, transfer);
  }

  patchedPostMessage.toString = () =>
    String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
  window.postMessage = patchedPostMessage;
}

const patchPostMessageJsCode = `(${String(patchPostMessageFunction)})();`;

// Component
class CreateServiceRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      selectLocationActive: false,
      selectExtrasActive: false,
      selectCommentsActive: false,
      next: false,
      location: '',
      date: '',
      type: '',
      size: '',
      extras: [],
      comments: '',
      payment: '',
      savedLocations: [],
    };
    this.getSavedLocations = async () => {
      const savedLocations = JSON.parse(await AsyncStorage.getItem('savedLocations')) || [];
      this.setState({ savedLocations });
    };
    this.getSavedLocations();
    this.goBack = () => this.props.navigation.goBack();
    this.next = () => this.setState({ next: true });
    this.previous = () => this.setState({ next: false });
    this.nextStageReady = () => {
      const {
        location, date, type, size,
      } = this.state;
      const sizeRequired = type !== '' && config.service.size[type.label] !== undefined;
      return !!(location !== '' && date !== '' && type !== '' && (!sizeRequired || size !== ''));
    };
    this.getPrice = () => {
      if (this.state.size !== '') {
        const basePrice = this.state.size.price;
        let price = basePrice;
        if (this.state.extras.length > 0) {
          this.state.extras.forEach(extra => (price += basePrice * extra.multiplier));
        }
        return parseInt(price.toFixed(2), 10);
      }
      return null;
    };
    this.getTax = price => parseInt(price.toFixed(2), 10) * config.service.tax;
    this.getTotalPrice = () => {
      const price = this.getPrice();
      if (price !== null) {
        return price + this.getTax(price);
      }
      return null;
    };
    this.displayPrice = (price) => {
      if (price !== null) {
        return `$ ${price.toFixed(2)}`;
      }
      return '$ –';
    };
    this.isCustom = () => (this.state.type.custom ? true : !!this.state.size.custom);
    this.onSelectLocation = () => this.setState({ selectLocationActive: true });
    this.onLocationSelected = (data, details) => {
      let location;
      if (details.saved === true) {
        location = details;
      } else {
        location = {
          address: details.formatted_address,
          url: details.url,
          coordinates: details.geometry.location,
        };
      }
      this.setState({ selectLocationActive: false, location });
    };
    this.onSelectDate = () => this.datePickerRef.onPressDate();
    this.onDateSelected = date => this.setState({ date });
    this.onSelectType = () => {
      ActionSheet.show(
        {
          options: config.service.type.map(option => option.label),
          title: 'Select a Job Type',
        },
        (buttonIndex) => {
          if (typeof buttonIndex !== 'undefined') {
            this.setState({ type: config.service.type[buttonIndex], size: '', extras: [] });
          }
        },
      );
    };
    this.onSelectSize = () => {
      if (this.state.type !== '') {
        ActionSheet.show(
          {
            options: config.service.size[this.state.type.label].map(option =>
              [option.label, option.description].join(' • ')),
            title:
              this.state.type.label === 'Grass Cutting'
                ? 'How big is the lawn (in square feet)?'
                : 'How many cars fit on the driveway?',
          },
          (buttonIndex) => {
            if (typeof buttonIndex !== 'undefined') {
              this.setState({ size: config.service.size[this.state.type.label][buttonIndex] });
            }
          },
        );
      } else {
        Toast.show({
          text: 'Please select a service type first!',
          buttonText: 'Okay',
        });
      }
    };
    this.onSelectExtras = () => {
      if (this.state.type !== '') {
        this.setState({ selectExtrasActive: true });
      } else {
        Toast.show({
          text: 'Please select a service type first!',
          buttonText: 'Okay',
        });
      }
    };
    this.toggleExtra = (extra) => {
      if (this.state.extras.filter(item => item.label === extra.label).length === 0) {
        this.setState((prevState) => {
          const newExtras = prevState.extras;
          newExtras.push(extra);
          return { extras: newExtras };
        });
      } else {
        this.setState(prevState => ({
          extras: prevState.extras.filter(item => item.label !== extra.label),
        }));
      }
    };
    this.onSelectComments = () => this.setState({ selectCommentsActive: true });
    this.onSubmit = async (client) => {
      // Save Location
      const savedLocations = JSON.parse(await AsyncStorage.getItem('savedLocations')) || [];
      const { location } = this.state;
      location.description = location.address;
      location.saved = true;
      if (savedLocations.filter(l => l.address === location.address).length === 0) {
        savedLocations.push(location);
        AsyncStorage.setItem('savedLocations', JSON.stringify(savedLocations));
      }

      // Validate
      let error = false;
      if (!isLength(this.state.comments, { max: 10000 })) {
        error = true;
        Toast.show({
          text: 'Note is too long',
          buttonText: 'Okay',
        });
      }
      if (error) {
        return false;
      }
      this.setState({ loading: true });
      Toast.show({
        text: 'Creating service request, please wait...',
        buttonText: 'Okay',
      });
      try {
        const token = await AsyncStorage.getItem('token');
        const userQueryResponse = await client.query({
          query: USER_GET_BY_TOKEN,
          variables: { token },
        });
        await client.mutate({
          mutation: SERVICE_CREATE,
          variables: {
            userId: userQueryResponse.data.userGetByToken.id,
            address: this.state.location.address,
            mapsURL: this.state.location.url,
            lat: this.state.location.coordinates.lat,
            lng: this.state.location.coordinates.lng,
            date: this.state.date,
            type: this.state.type.label,
            size: this.state.size.label,
            extras: this.state.extras.map(extra => extra.label),
            comments: this.state.comments,
            price: this.getPrice() !== null ? this.getPrice().toFixed(2) : 0,
            paymentToken: this.state.payment,
          },
        });
        Toast.show({
          text: 'Service request created! We will email you a confirmation',
          buttonText: 'Okay',
        });
        this.props.navigation.navigate('home');
      } catch (err) {
        this.setState({ loading: false });
      }
    };
    this.onStripeToken = (data, client) => {
      if (!this.state.loading) {
        this.setState({ payment: JSON.stringify(data) });
        this.onSubmit(client);
      }
    };
  }

  render() {
    if (this.state.selectLocationActive) {
      return (
        <Menu title="  New Service">
          <GooglePlacesAutocomplete
            placeholder="Search"
            minLength={2} // minimum length of text to search
            autoFocus={false}
            returnKeyType="search"
            listViewDisplayed="auto" // true/false/undefined
            fetchDetails
            renderDescription={row => row.description}
            onPress={(data, details = null) => this.onLocationSelected(data, details)}
            getDefaultValue={() => ''}
            styles={{
              textInputContainer: {
                width: '100%',
              },
              description: {
                fontWeight: 'bold',
              },
              predefinedPlacesDescription: {
                color: '#1faadb',
              },
            }}
            currentLocation={false}
            currentLocationLabel="Current location"
            predefinedPlaces={this.state.savedLocations}
            // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
            debounce={50}
            query={{
              // https://developers.google.com/places/web-service/autocomplete
              key: config.googlePlacesApiKey,
              language: 'en',
              types: 'geocode',
              location: config.service.operationsCenter,
              radius: config.service.operationsRadius,
              strictbounds: true,
            }}
            nearbyPlacesAPI="GoogleReverseGeocoding"
            // GoogleReverseGeocodingQuery={{}} https://developers.google.com/maps/documentation/geocoding/intro
          />
        </Menu>
      );
    }
    if (this.state.selectExtrasActive) {
      return (
        <Menu title="  New Service">
          <Form style={styles.form}>
            <Label style={styles.label}>Add your comments below</Label>
            <List>
              {config.service.extras[this.state.type.label].map(extra => (
                <ListItem key={extra.label} onPress={() => this.toggleExtra(extra)}>
                  <CheckBox
                    onPress={() => this.toggleExtra(extra)}
                    checked={
                      this.state.extras.filter(item => item.label === extra.label).length > 0
                    }
                  />
                  <Body>
                    <Text>{extra.label}</Text>
                  </Body>
                </ListItem>
              ))}
            </List>
            <Button full onPress={() => this.setState({ selectExtrasActive: false })}>
              <Text>Done</Text>
            </Button>
          </Form>
        </Menu>
      );
    }
    if (this.state.selectCommentsActive) {
      return (
        <Menu title="  New Service">
          <Form style={styles.form}>
            <Label style={styles.label}>Add your comments below</Label>
            <Textarea
              rowSpan={10}
              bordered
              placeholder=""
              value={this.state.comments}
              onChangeText={comments => this.setState({ comments })}
            />
            <Button full onPress={() => this.setState({ selectCommentsActive: false })}>
              <Text>Done</Text>
            </Button>
          </Form>
        </Menu>
      );
    }
    if (this.state.next) {
      return (
        <ApolloConsumer>
          {client => (
            <Menu title="  New Service">
              <Container>
                <Content style={styles.content}>
                  {this.isCustom() ? (
                    <Text style={styles.priceMessage}>
                      You have selected a custom job type! A quote will be emailed to you.
                    </Text>
                  ) : (
                    [
                      <Text
                        key="price"
                        style={styles.finalPrice}
                      >{`Total Price: $ ${this.getTotalPrice().toFixed(2)}`}
                      </Text>,
                      <WebView
                        key="payment"
                        onError={err => console.log(err)}
                        source={{ uri: [config.api, 'payments'].join('/') }}
                        injectedJavaScript={patchPostMessageJsCode}
                        scalesPageToFit={false}
                        scrollEnabled={false}
                        onMessage={event =>
                          this.onStripeToken(JSON.parse(event.nativeEvent.data), client)
                        }
                        style={styles.payForm}
                      />,
                    ]
                  )}
                </Content>
                <Container style={styles.footer}>
                  <Button bordered dark onPress={this.previous}>
                    <Text>Back</Text>
                  </Button>
                  {this.isCustom() ? (
                    <Button
                      success
                      disabled={
                        this.state.loading || (this.state.payment === '' && !this.isCustom())
                      }
                      onPress={() => this.onSubmit(client)}
                    >
                      <Text>Request Quote</Text>
                    </Button>
                  ) : (
                    <View />
                  )}
                </Container>
              </Container>
            </Menu>
          )}
        </ApolloConsumer>
      );
    }
    return (
      <Menu title="  New Service">
        <Container>
          <Content style={styles.content}>
            <Form style={styles.form}>
              <Label style={styles.label}>Location</Label>
              <TouchableOpacity onPress={() => this.onSelectLocation()}>
                <Card style={styles.card}>
                  <CardItem style={styles.cardItem}>
                    {this.state.location !== '' ? (
                      <Text style={styles.location}>
                        {this.state.location.address.replace(', Canada', '')}
                      </Text>
                    ) : (
                      <Text style={styles.placeholder}>Search Address</Text>
                    )}
                    <Icon name="map" style={styles.icon} />
                  </CardItem>
                </Card>
              </TouchableOpacity>
              <Label style={styles.label}>Complete By</Label>
              <TouchableOpacity onPress={() => this.onSelectDate()}>
                <Card style={styles.card}>
                  <CardItem style={styles.cardItem}>
                    {this.state.date !== '' ? (
                      <Text>{moment(this.state.date).format('MMM D YYYY')}</Text>
                    ) : (
                      <Text style={styles.placeholder}>Pick Date</Text>
                    )}
                    <DatePicker
                      style={{ width: 0 }}
                      date={this.state.date}
                      mode="date"
                      format="YYYY-MM-DD"
                      minDate={config.service.minDate}
                      maxDate={config.service.maxDate}
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      placeholder="Select Date"
                      customStyles={{
                        dateInput: {
                          width: '100%',
                          // borderWidth: 0,
                        },
                        placeholderText: {
                          color: grey2,
                          justifyContent: 'flex-start',
                          fontSize: 16,
                        },
                      }}
                      showIcon={false}
                      hideText
                      onDateChange={date => this.onDateSelected(date)}
                      ref={ref => (this.datePickerRef = ref)}
                    />
                    <Icon name="calendar" style={styles.icon} />
                  </CardItem>
                </Card>
              </TouchableOpacity>
              <Label style={styles.label}>Job Type</Label>
              <TouchableOpacity onPress={() => this.onSelectType()}>
                <Card style={styles.card}>
                  <CardItem style={styles.cardItem}>
                    {this.state.type !== '' ? (
                      <Text>{this.state.type.label}</Text>
                    ) : (
                      <Text style={styles.placeholder}>Select</Text>
                    )}
                    <Icon name="ios-arrow-down" style={styles.icon} />
                  </CardItem>
                </Card>
              </TouchableOpacity>
              {config.service.size[this.state.type.label] !== undefined ? (
                [
                  <Label key="label" style={styles.label}>
                    Job Size
                  </Label>,
                  <TouchableOpacity key="button" onPress={() => this.onSelectSize()}>
                    <Card style={styles.card}>
                      <CardItem style={styles.cardItem}>
                        {this.state.size !== '' ? (
                          <Text>{this.state.size.label}</Text>
                        ) : (
                          <Text style={styles.placeholder}>Select</Text>
                        )}
                        <Icon name="ios-arrow-down" style={styles.icon} />
                      </CardItem>
                    </Card>
                  </TouchableOpacity>,
                ]
              ) : (
                <View />
              )}
              {config.service.extras[this.state.type.label] !== undefined ? (
                [
                  <Label key="label" style={styles.label}>
                    Extras
                  </Label>,
                  <TouchableOpacity key="button" onPress={() => this.onSelectExtras()}>
                    <Card style={styles.card}>
                      <CardItem style={styles.cardItem}>
                        {this.state.extras.length > 0 ? (
                          <Text>
                            {[
                              this.state.extras
                                .map(extra => extra.label)
                                .join(', ')
                                .slice(0, 35),
                              '...',
                            ].join('')}
                          </Text>
                        ) : (
                          <Text style={styles.placeholder}>Select</Text>
                        )}
                        <Icon name="checkbox" style={styles.icon} />
                      </CardItem>
                    </Card>
                  </TouchableOpacity>,
                ]
              ) : (
                <View />
              )}
              <Label style={styles.label}>Comments</Label>
              <TouchableOpacity onPress={() => this.onSelectComments()}>
                <Card style={styles.card}>
                  <CardItem style={styles.cardItem}>
                    {this.state.comments !== '' ? (
                      <Text>{[this.state.comments.slice(0, 35), '...'].join('')}</Text>
                    ) : (
                      <Text style={styles.placeholder}>Add details about the job</Text>
                    )}
                    <Icon name="clipboard" style={styles.icon} />
                  </CardItem>
                </Card>
              </TouchableOpacity>
            </Form>
          </Content>
          <Container style={styles.footer}>
            <Button bordered dark onPress={this.goBack}>
              <Text>Cancel</Text>
            </Button>
            <Text style={styles.price}>{this.displayPrice(this.getTotalPrice())}</Text>

            <Button
              success
              disabled={this.state.loading || !this.nextStageReady()}
              onPress={this.next}
            >
              <Text>Next</Text>
            </Button>
          </Container>
        </Container>
      </Menu>
    );
  }
}
CreateServiceRequest.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};


export default withNavigation(CreateServiceRequest);
