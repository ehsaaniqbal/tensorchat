import React, { Fragment } from "react";
import { Container, Row, Col } from "reactstrap";

function HotItWorks() {
  return (
    <Fragment>
      <section className="section" id="howitworks">
        <img
          alt="..."
          className="path"
          src={require("../assets/img/path4.png")}
        />
        <Container>
          <Row className="justify-content-center">
            <Col lg="10">
              <hr className="line-info" />
              <h1>
                How it <span className="text-info">works</span>
              </h1>
              <Row className="row-grid justify-content-center">
                <Col lg="3">
                  <div className="info">
                    <div className="icon icon-primary">
                      <i className="far fa-plus-square"></i>
                    </div>
                    <h4 className="info-title" style={{ fontWeight: "bold" }}>
                      Create
                    </h4>
                    <hr className="line-primary" />
                    <p style={{ color: "white" }}>
                      Create a room with a unique name.
                    </p>
                  </div>
                </Col>
                <Col lg="3">
                  <div className="info">
                    <div className="icon icon-warning">
                      <i className="fas fa-share-alt"></i>
                    </div>
                    <h4 className="info-title" style={{ fontWeight: "bold" }}>
                      Share
                    </h4>
                    <hr className="line-warning" />
                    <p style={{ color: "white" }}>
                      Share the link with your friends.
                    </p>
                  </div>
                </Col>
                <Col lg="3">
                  <div className="info">
                    <div className="icon icon-success">
                      <i className="fas fa-video"></i>
                    </div>
                    <h4 className="info-title" style={{ fontWeight: "bold" }}>
                      Chat
                    </h4>
                    <hr className="line-success" />
                    <p style={{ color: "white" }}>
                      Chat over a secure, encrypted, peer-to-peer connection.
                    </p>
                  </div>
                </Col>
                <Col lg="3">
                <div className="info">
                <div className="icon icon-primary">
                <i className="fas fa-info"></i>
                    </div>
                   <h4 className="info-title" style={{ fontWeight: "bold" }}>
                   Compatibility
                   </h4>
                   <hr className="line-success" />
                   <p style={{ color: "white" }}>
                     Safari on iOS and MacOS.
                   </p>
                   <p style={{ color: "white" }}>
                     Google Chrome on android.
                   </p>
                   <p style={{ color: "white" }}>
                     Google Chrome, Firefox on Windows.
                   </p>
                 </div>
                </Col>
              </Row>
            </Col>
          </Row>
         
                 
                
        </Container>
      </section>
    </Fragment>
  );
}
export default HotItWorks;
