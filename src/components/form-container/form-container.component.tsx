import { ReactNode } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./form-container.scss";

type Props = {
  children?: ReactNode;
  className?: string;
};

const FormContainer = (props: Props) => {
  const { children, className } = props;
  return (
    <Container className={className}>
      <Row>
        <Col lg={12} md={6}>
          {children}
        </Col>
      </Row>
    </Container>
  );
};

export default FormContainer;
