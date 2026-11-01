const ACTIONS = {
  SERVICE_APPROVE: `
    mutation serviceApproveByToken($token: String!) {
      serviceApproveByToken(token: $token) {
        id
      }
    }
  `,
  SERVICE_DENY: `
    mutation serviceDenyByToken($token: String!) {
      serviceDenyByToken(token: $token) {
        id
      }
    }
  `,
  SERVICE_CANCEL: `
    mutation serviceCancelByToken($token: String!) {
      serviceCancelByToken(token: $token) {
        id
      }
    }
  `,
  SERVICE_COMPLETE: `
    mutation serviceCompleteByToken($token: String!) {
      serviceCompleteByToken(token: $token) {
        id
      }
    }
  `,
};

const admin = message => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <!-- Meta-->
      <title>MowGoSnowGo</title>
      <meta http-equiv="Content-type" content="text/html; charset=utf-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    </head>
    <body>
      <h1>${message}</h1>
    </body>
  </html>
`;

export default admin;
export { ACTIONS };
