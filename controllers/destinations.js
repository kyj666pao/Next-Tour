import { Destination } from "../models/destination.js";

// GET "/destinations" destinationsCtrl.index
const index = (req, res) => {
  Destination.find()
    .then((destinations) => {
      res.render("destinations/index", {
        title: "All Destinations",
        destinations,
        states: [
          "Alabama",
          "Alaska",
          "American Samoa",
          "Arizona",
          "Arkansas",
          "California",
          "Colorado",
          "Connecticut",
          "Delaware",
          "District of Columbia",
          "Federated States of Micronesia",
          "Florida",
          "Georgia",
          "Guam",
          "Hawaii",
          "Idaho",
          "Illinois",
          "Indiana",
          "Iowa",
          "Kansas",
          "Kentucky",
          "Louisiana",
          "Maine",
          "Marshall Islands",
          "Maryland",
          "Massachusetts",
          "Michigan",
          "Minnesota",
          "Mississippi",
          "Missouri",
          "Montana",
          "Nebraska",
          "Nevada",
          "New Hampshire",
          "New Jersey",
          "New Mexico",
          "New York",
          "North Carolina",
          "North Dakota",
          "Northern Mariana Islands",
          "Ohio",
          "Oklahoma",
          "Oregon",
          "Palau",
          "Pennsylvania",
          "Puerto Rico",
          "Rhode Island",
          "South Carolina",
          "South Dakota",
          "Tennessee",
          "Texas",
          "Utah",
          "Vermont",
          "Virgin Island",
          "Virginia",
          "Washington",
          "West Virginia",
          "Wisconsin",
          "Wyoming",
        ],
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
};

// GET "/destinations/:destinationId" destinationsCtrl.show
const show = (req, res) => {
  let { destinationId } = req.params;
  Destination.findById(destinationId)
    .populate({ path: "postOfThisDestination" })
    .then((destination) => {
      res.render("destinations/show", {
        destination,
        title: destination.name,
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
};

// POST "/destinations" destinationsCtrl.create
const create = (req, res) => {
  let userId = req.user.profile._id;
  req.body.creator = userId;
  Destination.create(req.body)
    .then((destination) => {
      res.redirect("/destinations");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
};

export { 
    index, 
    create, 
    show, 
};
