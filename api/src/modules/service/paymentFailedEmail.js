import sgMail from '@sendgrid/mail';
import config from '../../config';
// import { firstName } from '../helpers';

/*
function serviceCompletedUserHTML(service) {
  return ``;
}
*/

export default function paymentFailedEmail(service) {
  const adminMsg = {
    to: config.emailAddress,
    from: {
      email: config.noReply,
      name: 'MowGoSnowGo App',
    },
    subject: `${service.address} PAYMENT FAILED`,
    text: `An attempt was made to charge $${service.price} to the customers credit card for ${service.type} but it failed. Contact ${config.devEmail}.`,
  };
  sgMail.send(adminMsg);
}
