import React, { Component } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
class OwnerLogin extends Component {
  constructor(props) {
    //Call the constrictor of Super class i.e The Component
    super(props);
    //maintain the state required for this component
    this.state = {
      username: "",
      password: "",
      authFlag: false,
      isTraveller: false,
      isOwner: true
    };
    this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
    this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
  }
  //Bind the handlers to this class

  //Call the Will Mount to set the auth Flag to false
  componentWillMount() {
    this.setState({
      authFlag: false
    });
  }
  //username change handler to update state variable with the text entered by the user
  usernameChangeHandler = e => {
    this.setState({
      username: e.target.value
    });
  };
  //password change handler to update state variable with the text entered by the user
  passwordChangeHandler = e => {
    this.setState({
      password: e.target.value
    });
  };

  submitLogin = e => {
    var headers = new Headers();
    //prevent page from refresh
    e.preventDefault();
    const data = {
      username: this.state.username,
      password: this.state.password
    };

    console.log("data is", data);
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.post("http://localhost:3001/ownerlogin", data).then(response => {
      console.log("Status Code : ", response.status);
      if (response.status === 200) {
        this.setState({
          authFlag: true
        });
      } else {
        this.setState({
          authFlag: false
        });
      }
      this.props.loadUser(response.data);
      console.log("res.data", JSON.stringify(response.data));
    });
  };

  render() {
    let redirectVar = null;
    if (cookie.load("cookieOwner")) {
      redirectVar = <Redirect to="/OwnerDashboard" />;
    }
    return (
      <div>
        {redirectVar}
        <div className="container">
          <div className="signup">
            <h2>Owner Login</h2>
            <p>
              Need an account?{" "}
              <Link to="/ownerSignup">
                <span className="glyphicon glyphicon-log-in" /> Signup
              </Link>
            </p>
          </div>
          <div className="login-form">
            <div className="main-div">
              <div>
                <h2>Account Login</h2>
                <b>
                  <hr />
                </b>
              </div>

              <div className="form-group">
                <input
                  onChange={this.usernameChangeHandler}
                  type="text"
                  className="form-control"
                  name="username"
                  placeholder="Username"
                />
              </div>
              <div className="form-group">
                <input
                  onChange={this.passwordChangeHandler}
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Password"
                />
              </div>
              <button onClick={this.submitLogin} className="btn btn-primary">
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OwnerLogin;
