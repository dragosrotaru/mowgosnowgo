
import React from 'react';
import { Container, Content, Spinner } from 'native-base';

const Loading = () => (
  <Container>
    <Content>
      <Spinner color="red" />
    </Content>
  </Container>
);

export default Loading;
