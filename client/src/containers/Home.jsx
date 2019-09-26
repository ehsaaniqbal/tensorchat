import React, { Fragment } from "react";
import Header from "../components/Header";
import IndexNavbar from "../components/IndexNavbar";
import HowItWorks from "../components/HowItWorks";

function Home() {
  return (
    <Fragment>
      <IndexNavbar />
      <div className="wrapper">
        <Header />
        <HowItWorks />
      </div>
    </Fragment>
  );
}

export default Home;
