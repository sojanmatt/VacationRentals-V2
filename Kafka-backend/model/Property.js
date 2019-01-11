const mongoose = require("./mongoose");
const Schema = mongoose.Schema;

var Bookings = new Schema({
  username: { type: String, trim: true },
  booking_id: { type: Number, trim: true },
  fromDate: { type: String, trim: true, default: "" },
  toDate: { type: String, trim: true, default: "" }
});

var Listings = new Schema({
  username: { type: String, trim: true },
  listing_id: { type: Number, trim: true },
  fromDate: { type: String, trim: true, default: "" },
  toDate: { type: String, trim: true, default: "" }
});

var PropertySchema = new Schema({
  username: { type: String, trim: true, index: { unique: true } },
  prop_id: { type: Number, trim: true, index: { unique: true } },
  headline: { type: String, trim: true, index: { unique: true } },
  type: { type: String, required: true },
  location: { type: String, trim: true, default: "" },
  bed: { type: Number, trim: true, default: "" },
  bath: { type: Number, trim: true, default: "" },
  startdate: { type: String, trim: true, default: "" },
  enddate: { type: String, trim: true, default: "" },
  currencytype: { type: String, trim: true, default: "" },
  rate: { type: String, trim: true, default: "" },
  minstay: { type: Number, trim: true, default: "" },
  maxadults: { type: Number, trim: true, default: "" },
  maxchild: { type: Number, trim: true, default: 0 },
  availability: { type: Boolean, trim: true, default: 0 },
  description: { type: String, trim: true, default: "" },
  unit: { type: String, trim: true, default: "" },
  city: { type: String, trim: true, default: "" },
  state: { type: String, trim: true, default: "" },
  zip: { type: String, trim: true, default: "" },
  country: { type: String, trim: true, default: "" },
  address: { type: String, trim: true, default: "" },
  bookings: [{ type: Bookings }],
  listings: [{ type: Listings }]
});
let Property = mongoose.model("Property", PropertySchema, "property");
module.exports = Property;
