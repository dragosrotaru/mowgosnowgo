import sgMail from '@sendgrid/mail';
import config from '../config';

function emailErrorToDev(error) {
  const devMsg = {
    to: config.devEmail,
    from: {
      email: config.noReply,
      name: 'MowGoSnowGo App',
    },
    subject: 'MowGoSnowGo Server Error',
    text: JSON.stringify(error),
  };
  sgMail.send(devMsg);
}

function firstName(name) {
  return name.split(' ')[0];
}

export { emailErrorToDev, firstName };
