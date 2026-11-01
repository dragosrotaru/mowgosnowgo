import sgMail from '@sendgrid/mail';
import config from '../../config';

export default function userCreatedEmail(user) {
  const adminMsg = {
    to: config.emailAddress,
    from: {
      email: config.noReply,
      name: 'MowGoSnowGo App',
    },
    subject: `${user.name} NEW USER`,
    text: `${user.name} Has Joined MowGoSnowGo! Their email is ${user.email}`,
  };
  sgMail.send(adminMsg);
}
