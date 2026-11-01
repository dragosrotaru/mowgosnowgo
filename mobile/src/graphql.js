// Imports
import gql from 'graphql-tag';

export const USER_GET_BY_TOKEN = gql`
  query userGetByToken($token: String!) {
    userGetByToken(token: $token) {
      id
      name
      email
      phone
    }
  }
`;

export const USER_UPDATE_BY_TOKEN = gql`
  query userGetByToken($token: String!) {
    userGetByToken(token: $token) {
      id
      name
      email
      phone
    }
  }
`;

export const USER_LOGIN = gql`
query userLogin($email: String!, $password: String!) {
  userLogin(email: $email, password: $password) {
    token
  }
}
`;

export const USER_LOGIN_FACEBOOK = gql`
query userLoginFacebook($facebookToken: String!) {
  userLoginFacebook(facebookToken: $facebookToken) {
    token
  }
}
`;


export const USER_SIGN_UP = gql`
  mutation userSignUp(
    $name: String!,
    $email: String!,
    $phone: String!,
    $password: String!
  ) {
    userSignUp(
      name: $name,
      email: $email,
      phone: $phone,
      password: $password
    ) {
      token
    }
  }
`;

export const USER_SIGN_UP_FACEBOOK = gql`
  mutation userSignUpFacebook(
    $name: String!,
    $email: String!,
    $phone: String!,
    $facebookToken: String!
  ) {
    userSignUpFacebook(
      name: $name,
      email: $email,
      phone: $phone,
      facebookToken: $facebookToken
    ) {
      token
    }
  }
`;


export const USER_FORGOT_PASSWORD = gql`
mutation userForgotPassword($email: String!) {
  userForgotPassword(email: $email) {
    id
  }
}`;

export const SERVICE_GET_BY_ID = gql`
  query serviceGetByID($id: ID!) {
    serviceGetByID(id: $id) {
      id
      address
      mapsURL
      lat
      lng
      date
      type
      size
      extras
      comments
      status
      price
    }
  }
`;

export const SERVICE_GET_ALL = gql`
  query serviceGetAll {
    serviceGetAll {
      id
      address
      mapsURL
      lat
      lng
      date
      type
      size
      extras
      comments
      status
      price
    }
  }
`;

export const SERVICE_GET_ALL_BY_USER_TOKEN = gql`
  query serviceGetAllByUserToken {
    serviceGetAllByUserToken {
      id
      address
      mapsURL
      lat
      lng
      date
      type
      size
      extras
      comments
      status
      price
    }
  }
`;

export const SERVICE_CREATE = gql`
  mutation serviceCreate(
    $address: String!,
    $mapsURL: String!,
    $lat: Float!,
    $lng: Float!,
    $date: String!,
    $type: String!,
    $size: String,
    $extras: [String],
    $comments: String,
    $price: Float!,
    $paymentToken: String,
  ) {
    serviceCreate(
      address: $address,
      mapsURL: $mapsURL,
      lat: $lat,
      lng: $lng,
      date: $date,
      type: $type,
      size: $size,
      extras: $extras,
      comments: $comments,
      price: $price,
      paymentToken: $paymentToken,
    ) {
      id
    }
  }
`;

export const SERVICE_CANCEL_BY_ID = gql`
  mutation serviceCancelByID($id: ID!) {
    serviceCancelByID(id: $id) {
      id
    }
  }
`;
