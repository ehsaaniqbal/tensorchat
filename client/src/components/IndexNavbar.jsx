import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Collapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col
} from "reactstrap";

function IndexNavbar() {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [collapseOut, setCollapseOut] = useState("");

  const toggleCollapse = () => {
    document.documentElement.classList.toggle("nav-open");
    setCollapseOpen(!collapseOpen);
  };
  const onCollapseExiting = () => {
    setCollapseOut("collapsing-out");
  };
  const onCollapseExited = () => {
    setCollapseOut("");
  };

  return (
    <Navbar
      className={"fixed-top navbar-transparent "}
      color-on-scroll="100"
      expand="lg"
    >
      <Container>
        <div className="navbar-translate">
          <NavbarBrand data-placement="bottom" to="/" tag={Link}>
            <span>Tensor </span>
            Chat
          </NavbarBrand>
          <button
            aria-expanded={collapseOpen}
            className="navbar-toggler navbar-toggler"
            onClick={toggleCollapse}
          >
            <span className="navbar-toggler-bar bar1" />
            <span className="navbar-toggler-bar bar2" />
            <span className="navbar-toggler-bar bar3" />
          </button>
        </div>
        <Collapse
          className={"justify-content-end " + collapseOut}
          navbar
          isOpen={collapseOpen}
          onExiting={onCollapseExiting}
          onExited={onCollapseExited}
        >
          <div className="navbar-collapse-header">
            <Row>
              <Col className="collapse-brand" xs="6">
                <a href="/" onClick={e => e.preventDefault()}>
                  TensorChat
                </a>
              </Col>
              <Col className="collapse-close text-right" xs="6">
                <button
                  aria-expanded={collapseOpen}
                  className="navbar-toggler"
                  onClick={toggleCollapse}
                >
                  <i className="fas fa-times"></i>
                </button>
              </Col>
            </Row>
          </div>
          <Nav navbar>
            <NavItem className="p-0">
              {window.location.pathname === "/createroom" ? (
                <NavLink
                  data-placement="bottom"
                  href="/#howitworks"
                  title="How it works"
                >
                  <i className="fas fa-cogs"></i>
                  <p className="d-lg-none d-xl-none">How it works</p>
                </NavLink>
              ) : (
                <NavLink
                  data-placement="bottom"
                  href="#howitworks"
                  title="How it works"
                >
                  <i className="fas fa-cogs" />
                  <p className="d-lg-none d-xl-none">How it works</p>
                </NavLink>
              )}
            </NavItem>
            <NavItem className="p-0">
              <NavLink
                data-placement="bottom"
                href="https://github.com/ehsaaniqbal/tensorchat"
                rel="noopener noreferrer"
                target="_blank"
                title="Github"
              >
                <i className="fab fa-github" />
                <p className="d-lg-none d-xl-none">Github</p>
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
}

export default IndexNavbar;
