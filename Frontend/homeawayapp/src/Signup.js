import React from "react";
import { Link } from "react-router-dom";
import "./App.css";
import { Redirect } from "react-router";
import axios from "axios";
import cookie from "react-cookies";
import { connect } from "react-redux";
import { userActions } from "./Actions/UserActions";
class Signup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        Fname: "",
        Lname: "",
        Email: "",
        Password: ""
      },
      isSignedup: false
    };

    this.handleChange = this.handleChange.bind(this);
    //  this.handleSubmit = this.handleSubmit.bind(this);
    // this.handleradio = this.handleradio.bind(this);
  }

  // inputHandler(event) {
  //   const { name, value } = event.target;
  //   const propDetails = this.state.propDetails;
  //   this.setState({
  //     propDetails: {
  //       ...propDetails,
  //       [name]: value
  //     }
  //   });
  //   console.log(this.state.propDetails);
  // }
  handleChange(event) {
    const { name, value } = event.target;

    const user = this.state.user;

    this.setState({
      user: {
        ...user,
        [name]: value
      }
    });
    console.log(this.state.user);
  }

  // handleSubmit(event) {
  //   event.preventDefault();
  //   alert("hi");
  //   const { user } = this.state;
  //   console.log(JSON.stringify(user));
  //   if (user.Fname && user.Email && user.Lname && user.Password) {
  //     console.log(JSON.stringify(user)); ///try w_ dispatch
  //   }
  // }

  handleSubmit = event => {
    event.preventDefault();

    const userDetails = this.state.user;
    this.props.signup(userDetails);
    // axios.defaults.withCredentials = true;
    // console.log("userdetails", userDetails);
    // axios
    //   .post(
    //     "http://localhost:3001/traveller/signup",

    //     userDetails
    //   )
    //   .then(
    //     response => {
    //       console.log(response.data.message);

    //       window.alert(response.data.message);
    //       this.setState({
    //         isSignedup: true
    //       });
    //     },
    //     error => {
    //       window.alert("Please check again");
    //     }
    //   );
  };

  render() {
    let redirect = null;
    console.log("issigned", this.props.isSignedup);
    if (this.props.isSignedup) {
      console.log("issigned", this.props.isSignedup);
      redirect = <Redirect to="/home" />;
    }
    return (
      <div className="container">
        {redirect}
        <div className="signup-form">
          <div>
            <div>
              <div>
                <form name="form">
                  <div>
                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Fname"
                        //    value={this.state.user.Fname}
                        onChange={this.handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Lname"
                        //   value={this.state.user.Lname}
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">E-Mail</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Email"
                      //      value={this.state.user.Email}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="Password"
                      //  value={this.state.user.Password}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="form-group" id="LoginButtonDiv">
                    <button
                      onClick={this.handleSubmit}
                      className="btn btn-primary"
                      id="LoginButton"
                    >
                      Sign Me Up
                    </button>

                    <p id="smallLabel2">
                      We don't post anything without your permission. By
                      creating an account you are accepting our Terms and
                      Conditions and Privacy Policy.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// const connectedsignup = connect(mapStateToProps)(RegisterPage);
// export { connectedRegisterPage as RegisterPage };
const mapStateToProps = state => {
  return {
    isSignedup: state.signup.isTravelerSignedUp
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signup: data => dispatch(userActions.signup(data))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Signup);

//export default Signup;
