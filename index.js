//an array with all the driver numbers then we choose
// a rondom one from it then give it to api to retreive a recording
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const driverArr = [
  1, 2, 3, 4, 10, 11, 14, 16, 18, 20, 22, 23, 24, 27, 31, 44, 55, 63, 77, 81,
];

// const num = Math.floor(Math.random() * driverArr.length);

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const num1 = Math.floor(Math.random() * driverArr.length); //first random number to pick a random driver from the array

    const driverNum = driverArr[num1];
    const driverN = await axios.get(
      `https://api.openf1.org/v1/drivers?driver_number=${driverNum}&session_key=9158`
    );
    const driverName = driverN.data[0].full_name;

    const audioRaw = await axios.get(
      `https://api.openf1.org/v1/team_radio?session_key=9158&driver_number=${driverNum}`
    );
    console.log(audioRaw.data);
    const num2 = Math.floor(Math.random() * audioRaw.data.length); //second random num to choose from array of diff recordings
    const audioURL = audioRaw.data[num2].recording_url;
    const audioDate = audioRaw.data[num2].date;

    res.render("index.ejs", {
      driverNam: driverName,
      audio: audioURL,
      date: audioDate,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error fetching driver data");
  }
});
app.listen(port, () => {
  console.log("Listening at port 3000");
});
