import React, { Component } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { connect } from "react-redux";
class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Fname: "",
      Lname: "",
      About: "",
      City: "",
      Country: " ",
      Company: "",
      School: "",
      Hometown: "",
      Languages: "",
      Gender: "Gender",

      isOwner: false,
      userId: "",
      isUpdated: false
    };

    console.log("this.props", this.state.userId);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.handleradio = this.handleradio.bind(this);
  }
  componentDidMount() {
    const userId = localStorage.getItem("userId");

    this.setState({
      userId: userId
    });

    console.log("this.state.userId", userId);

    axios.post("http://localhost:3001/myProfile/" + userId).then(response => {
      this.setState({
        Fname: response.data[0].username,
        Lname: response.data[0].Lname,
        About: response.data[0].aboutMe,
        City: response.data[0].city,
        Country: response.data[0].city,
        Company: response.data[0].company,
        School: response.data[0].school,
        Hometown: response.data[0].hometown,
        Languages: response.data[0].languages,
        Gender: response.data[0].gender
      });
      console.log(JSON.stringify(response.data[0]));
    });
  }
  handleChange(event) {
    // const { name, value } = event.target;
    // const user = [...this.state.user];
    // this.setState({
    //   user: {
    //     ...user,
    //     [name]: value
    //   },
    //   submitted: false,
    //   passcheck: false
    // });

    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit = event => {
    event.preventDefault();

    const userDetails = this.state;

    console.log("userdetails", userDetails);

    axios.post("http://localhost:3001/editprofile/save", userDetails).then(
      response => {
        console.log(response.data.message);

        window.alert(response.data.message);
        this.setState({
          isUpdated: true
        });
      },
      error => {
        window.alert("Please check again");
      }
    );
  };

  render() {
    return (
      <div>
        <div>
          <Navbar />
        </div>
        <div className="col-xs-12 col-sm-8">
          <div className="js-profile-form profile-form-container">
            <div>
              <div className="section-with-border no-bottom-padding">
                <div className="row">
                  <div className="col-xs-8 hidden-xs">
                    <h3 className="section-header">Profile information</h3>
                  </div>
                </div>

                <form role="form" className="js-profile-form">
                  <div className="row form-group ">
                    <label className="col-xs-12 sr-only">First name</label>
                    <div className="col-sm-12 col-md-7">
                      <input
                        type="text"
                        className="form-control input-lg js-input-field"
                        placeholder="First name"
                        defaultValue={this.state.Fname}
                        required=""
                        onChange={this.handleChange}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="row form-group ">
                    <label className="col-xs-12 sr-only">
                      Last name or initial
                    </label>
                    <div className="col-sm-12 col-md-7">
                      <input
                        type="text"
                        className="form-control input-lg js-input-field"
                        placeholder="Last name or initial"
                        defaultValue={this.state.Lname}
                        data-input-model-name="lastName"
                        required=""
                        onChange={this.handleChange}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="row form-group">
                    <label className="col-xs-12 sr-only">About me</label>
                    <div className="col-xs-12">
                      <textarea
                        type="text"
                        className="form-control input-lg js-input-field"
                        rows="4"
                        name="About"
                        onChange={this.handleChange}
                        value={this.state.About}
                        placeholder="About me"
                      />
                    </div>
                  </div>
                  <div className="row form-group">
                    <label className="col-xs-12 sr-only">Current City</label>
                    <div className="col-sm-12 col-md-7">
                      <input
                        type="text"
                        className="form-control input-lg js-input-field"
                        placeholder="My city, country"
                        name="City"
                        onChange={this.handleChange}
                        value={this.state.City}
                      />
                    </div>
                  </div>
                  <div className="row form-group">
                    <label className="col-xs-12 sr-only">Company</label>
                    <div className="col-sm-12 col-md-7">
                      <input
                        type="text"
                        className="form-control input-lg js-input-field"
                        placeholder="Company"
                        name="Company"
                        onChange={this.handleChange}
                        value={this.state.Company}
                      />
                    </div>
                  </div>
                  <div className="row form-group">
                    <div className="col-sm-12 col-md-7">
                      <input
                        type="text"
                        className="form-control input-lg js-input-field"
                        placeholder="School"
                        onChange={this.handleChange}
                        name="School"
                        value={this.state.School}
                      />
                    </div>
                  </div>
                  <div className="row form-group">
                    <label className="col-xs-12 sr-only">Hometown</label>
                    <div className="col-sm-12 col-md-7">
                      <input
                        type="text"
                        className="form-control input-lg js-input-field"
                        placeholder="Hometown"
                        onChange={this.handleChange}
                        name="Hometown"
                        value={this.state.Hometown}
                      />
                    </div>
                  </div>
                  <div className="row form-group">
                    <div className="col-sm-12 col-md-7">
                      <input
                        type="text"
                        className="form-control input-lg js-input-field"
                        placeholder="Languages"
                        onChange={this.handleChange}
                        name="Languages"
                        value={this.state.Languages}
                      />
                    </div>
                  </div>
                  <div className="row form-group">
                    <label className="col-xs-12 sr-only">Gender</label>
                    <div className="col-sm-12 col-md-7">
                      <select
                        className="form-control input-lg js-input-field"
                        onChange={this.handleChange}
                        name="Gender"
                        value={this.state.Gender}
                      >
                        <option
                          disabled=""
                          hidden=""
                          value={this.state.Gender}
                          name="Gender"
                        >
                          {this.state.Gender}
                        </option>
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <span className="col-xs-12 help-block">
                      This is never shared
                    </span>
                  </div>
                  <div className="row form-group">
                    <div className="col-sm-12 col-md-7">
                      <button
                        onClick={this.handleSubmit}
                        className="btn btn-primary"
                        id="LoginButton"
                      >
                        Save Changes
                      </button>
                    </div>
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

export default Profile;
