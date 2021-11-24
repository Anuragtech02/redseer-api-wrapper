var express = require("express");
var cors = require("cors");
var app = express();
const axios = require("axios");

const PORT = process.env.PORT || 5000;

const FORMS_API_ENDPOINT = "http://20.198.125.25/forms";
const FORMS_SAVE_ENDPOINT = "http://20.198.125.25/formresult";

app.use(cors());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

app.get("/", function (req, res, next) {
  res.json({
    msg: "This is CORS-enabled for all origins",
  });
});

const headers = {
  "Content-Type": "application/json",
};

async function getForms() {
  return await axios.get(FORMS_API_ENDPOINT);
}

async function getForm(id) {
  return await axios.get(`${FORMS_API_ENDPOINT}/${id}`);
}

async function postForm(form, type) {
  return await axios.post(FORMS_API_ENDPOINT, form, {
    headers,
  });
}

app.get("/forms", async (req, res) => {
  const id = req.query.id;
  const result = id ? await getForm(id) : getForms();

  if (result.data.status === "success") {
    res.status(200).json(result.data);
  } else {
    res.status(400).json(result.data);
  }
});

app.post("/formresult", async (req, res) => {
  const { form } = req.body;
  if (form) {
    const result = await postForm(form);

    res.status(200).json(result.data);
  }
});

app.listen(PORT, function () {
  console.log("CORS-enabled web server listening on port 80");
});
