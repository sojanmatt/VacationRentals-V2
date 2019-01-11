import React, { Component } from "react";

import axios from "axios";
import moment from "moment";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import Datepicker from "react-datepicker";
import Background from "./homeaway.jpg";
import Navbar from "./Navbar";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
class Home extends extends React.Component   {

    constructor(props)
    {
        super(props)
        this.state={
            location: "",
            adults: "",
            kids: "",
            fromDate: moment(),
            toDate: moment(),
            isSearch:false
        }
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    }

    handleSearchSubmit(event) {
        console.log(JSON.stringify(this.state));
        const {data}=this.state;
        this.props.searchProperty(data)
        // this.setState({
        //   isSearch: true
        // });
      }
      handleSearchChange(event) {
        this.setState({ [event.target.name]: event.target.value });
      }
      handleDateChange = (name, date) => {
        console.log("name and date", name, date.target.value);
        //const date1 = date.toDate();
    
        if (name === "fromDate") {
          this.setState({
            fromDate: date.target.value
          });
        }
        console.log("name date", date.target.value);
    
        if (name === "toDate") {
          this.setState({
            toDate: date.target.value
          });
        }
    
        //this.toggleCalendar();
      };
    
    render(){
  let redirectVar = null;
  let navbar = <Navbar />;
  console.log(cookie.load("cookie"));
  if (cookie.load("cookieOwner")) {
    redirectVar = <Redirect to="/ownerDashboard" />;
  } else if (!cookie.load("cookie") && !cookie.load("cookieOwner")) {
    redirectVar = <Redirect to="/login" />;
  } else {
    if (props.isSearch) {
      redirectVar = <Redirect to="/property-list" />;
    }
  }


  return (
    <div>
      {redirectVar}

      <div className="">
        {navbar}
        <div
          className="property-details clearfix"
          style={{ backgroundImage: `url(${Background})` }}
        >
          <h1 className="headLine">
            <div className="HeadLine__text">Book beach houses, cabins,</div>
            <div className="HeadLine__text">condos and more, worldwide</div>
          </h1>
          <div className="form-group col-md-12">
            <div className="form-group col-md-4">
              <input
                onChange={this.handleSearchChange}
                type="text"
                className="form-control"
                name="location"
                placeholder="Where do you want to go!"
              />
            </div>

            <span className="date-picker col-md-2">
              <input
                type="date"
                selected={props.fromDate}
                onChange={date => this.handleDateChange("fromDate", date)}
                name="fromDate"
                required
              />
            </span>
            <span className="date-picker col-md-2">
              <input
                type="date"
                selected={props.toDate}
                onChange={date => this.handleDateChange("toDate", date)}
                name="toDate"
                required
              />
            </span>
            <div className="form-group col-md-1">
              <input
                onChange={this.handleSearchChange}
                type="text"
                className="form-control"
                name="adults"
                placeholder="Adults"
                //value={props.guests}
                required
              />
            </div>
            <div className="form-group col-md-1">
              <input
                onChange={this.handleSearchChange}
                type="text"
                className="form-control"
                name="kids"
                placeholder="kids"
                required
                //value={props.guests}
              />
            </div>
            <div className="form-group col-md-2">
              <button
                className="btn btn-primary btn-lg "
                data-effect="ripple"
                type="button"
                tabIndex="5"
                data-loading-animation="true"
                onClick={this.handleSearchSubmit}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
};
mapStateToProps=state=>{
    return{
isSearch:state.bookproperty.isSearch
    }
}
mapDispatchtoProps=dispatch=>{
    return{
        searchProperty:data=>dispatch(userActions.searchProperty(data))
    }
}
//export Home Component
export default connect(mapStateToProps,mapDispatchtoProps)(Home);




/**
 * import React, { Component } from "react";

import axios from "axios";
import moment from "moment";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import Datepicker from "react-datepicker";
import Background from "./homeaway.jpg";
import Navbar from "./Navbar";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
const Home = props => {
  let redirectVar = null;
  let navbar = <Navbar />;
  console.log(cookie.load("cookie"));
  if (cookie.load("cookieOwner")) {
    redirectVar = <Redirect to="/ownerDashboard" />;
  } else if (!cookie.load("cookie") && !cookie.load("cookieOwner")) {
    redirectVar = <Redirect to="/login" />;
  } else {
    if (props.isSearch) {
      redirectVar = <Redirect to="/property-list" />;
    }
  }

  return (
    <div>
      {redirectVar}

      <div className="">
        {navbar}
        <div
          className="property-details clearfix"
          style={{ backgroundImage: `url(${Background})` }}
        >
          <h1 className="headLine">
            <div className="HeadLine__text">Book beach houses, cabins,</div>
            <div className="HeadLine__text">condos and more, worldwide</div>
          </h1>
          <div className="form-group col-md-12">
            <div className="form-group col-md-4">
              <input
                onChange={props.change}
                type="text"
                className="form-control"
                name="location"
                placeholder="Where do you want to go!"
              />
            </div>

            <span className="date-picker col-md-2">
              <input
                type="date"
                selected={props.fromDate}
                onChange={date => props.handleDateChange("fromDate", date)}
                name="fromDate"
                required
              />
            </span>
            <span className="date-picker col-md-2">
              <input
                type="date"
                selected={props.toDate}
                onChange={date => props.handleDateChange("toDate", date)}
                name="toDate"
                required
              />
            </span>
            <div className="form-group col-md-1">
              <input
                onChange={props.change}
                type="text"
                className="form-control"
                name="adults"
                placeholder="Adults"
                //value={props.guests}
                required
              />
            </div>
            <div className="form-group col-md-1">
              <input
                onChange={props.change}
                type="text"
                className="form-control"
                name="kids"
                placeholder="kids"
                required
                //value={props.guests}
              />
            </div>
            <div className="form-group col-md-2">
              <button
                className="btn btn-primary btn-lg "
                data-effect="ripple"
                type="button"
                tabIndex="5"
                data-loading-animation="true"
                onClick={props.handleSearchSubmit}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

//export Home Component
export default Home;

 */