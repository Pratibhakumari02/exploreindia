const express = require("express");
const cors = require("cors");
const data = require("./data.json");

const app = express();
app.use(cors());
app.use("/images", express.static("images"));

// Mapping for abbreviations
const abbreviations = {
  ap: "Andhra Pradesh",
  ar: "Arunachal Pradesh",
  as: "Assam",
  br: "Bihar",
  cg: "Chhattisgarh",
  gj: "Gujarat",
  hr: "Haryana",
  hp: "Himachal Pradesh",
  jk: "Jammu and Kashmir",
  jhk: "Jharkhand",
  ka: "Karnataka",
  kl: "Kerala",
  mp: "Madhya Pradesh",
  mh: "Maharashtra",
  mn: "Manipur",
  ml: "Meghalaya",
  mz: "Mizoram",
  nl: "Nagaland",
  od: "Odisha",
  pb: "Punjab",
  rj: "Rajasthan",
  sk: "Sikkim",
  tn: "Tamil Nadu",
  ts: "Telangana",
  tr: "Tripura",
  up: "Uttar Pradesh",
  ut: "Uttarakhand",
  wb: "West Bengal",
  ld: "Ladakh",
  lw: "Lakshadweep",
  ch: "Chandigarh",
  dl: "Delhi",
  an: "Andaman and Nicobar Islands",
  dnhdd: "Dadra and Nagar Haveli and Daman and Diu",
  pu: "Puducherry"
};

app.get("/api/state/:name", (req, res) => {
  const searchName = req.params.name.trim().toLowerCase();
  console.log("Searching for:", searchName);

  const lookupName = abbreviations[searchName] || searchName;

  let matchKey = Object.keys(data).find(
    key => key.toLowerCase() === lookupName.toLowerCase()
  );

  if (!matchKey) {
    matchKey = Object.keys(data).find(
      key => key.toLowerCase().includes(lookupName.toLowerCase())
    );
  }

  if (!matchKey) {
    console.log("Not found:", searchName);
    return res.status(404).json({
      success: false,
      message: "State / UT not found"
    });
  }

  console.log("Found:", matchKey);

  res.json({
    success: true,
    state: matchKey,
    ...data[matchKey]
  });
});

app.listen(5001, () => {
  console.log("Server running on http://localhost:5001");
});
