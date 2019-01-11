import React, { Component } from "react";
import axios from "axios";
import Trip from "../components/Trip";
import { Redirect } from "react-router";
import SelectedPropertyDetail from "../components/SelectedPropertyDetail";
import Navbar from "../Navbar";
import { connect } from "react-redux";
class TripBoards extends Component {
  constructor(props) {
    super(props);
    console.log("props", props);
    this.state = {
      fromDate: "",
      toDate: "",
      location: "",
      adults: "",
      kids: "",
      headline: "",
      Properties: [],
      currentPropID: "",
      displaylist: true,
      PropertyPhotos: [],
      isAvailable: true
    };

    this.handleClick = this.handleClick.bind(this);
  }
  async componentDidMount() {
    console.log("component did mount ", this.state);
    var photos = [];
    const data = {
      username: localStorage.getItem("userId")
    };

    const userName = localStorage.getItem("userId");
    console.log("DATA", data);

    axios
      .get("http://localhost:3001/places/latestbookings/" + userName)
      .then(async response => {
        console.log(JSON.stringify(response.data));

        this.setState({
          Properties: response.data
        });
        console.log(
          "this.state.Properties.length",
          this.state.Properties.length
        );
        for (let i = 0; i < this.state.Properties.length; i++) {
          const data = { id: this.state.Properties[i].prop_id };
          console.log("inside", this.state.Properties[i].prop_id);

          await axios
            .post("http://localhost:3001/getPropertyImg", data)
            .then(async response => {
              console.log(JSON.stringify(response.data));
              photos.push(response.data);
              this.setState({
                PropertyPhotos: photos
              });
              console.log("response imagee", JSON.stringify(photos));
              console.log("photos.length", JSON.stringify(photos.length));
              console.log(
                "PropertyPhotos",
                JSON.stringify(this.state.PropertyPhotos)
              );
            })
            .catch(error => {
              console.log("error", JSON.stringify(error.response.data.message));
              window.alert(error.response.data.message);
            });
        }
      })
      .catch(error => {
        console.log("error", JSON.stringify(error.response.data.message));
        window.alert(error.response.data.message);
        this.setState({
          isAvailable: false
        });
      });
    console.log("Photos", this.state.PropertyPhotos);
    // console.log("Username", userName);

    //  console.log("this.state.Properties.length", PropertyList);
  }
  handleClick(id) {
    console.log(id);
    this.setState({
      currentPropID: id,
      displaylist: false
    });
    console.log(this.state);
  }
  render() {
    let redirectvar = null;
    if (!this.state.isAvailable) {
      redirectvar = <Redirect to="/home" />;
    }
    console.log("properties", this.state.PropertyPhotos);
    if (this.state.PropertyPhotos.length > 0) {
      console.log(
        "this.state.PropertyPhotos.length",
        this.state.PropertyPhotos.length
      );
      var imgsrc = "data:image/png;base64," + this.state.PropertyPhotos[0].img;
    } else {
      var imgsrc = "";
    }
    if (this.state.displaylist) {
      return (
        <div>
          {redirectvar}
          <Navbar />
          {this.state.Properties.map((property, index) => {
            return (
              <Trip
                headline={property.headline}
                key={property.prop_id}
                value={property.prop_id}
                clicked={this.handleClick}
                houseType={property.houseType}
                capacity={property.capacity}
                rate={property.rate}
                imgsrc={imgsrc}
              />
            );
          })}
        </div>
      );
    } else
      return (
        <div>
          <SelectedPropertyDetail
            propid={this.state.currentPropID}
            fromDate={this.state.fromDate}
            toDate={this.state.toDate}
          />
        </div>
      );
  }
}

export default TripBoards;
