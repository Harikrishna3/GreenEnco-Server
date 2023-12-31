require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const { logger, logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const multer = require("multer");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
const assignmentSch = require("./models/Assignment");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3500;

connectDB();

app.use(logger);

app.use(express.json());

app.use(cors(corsOptions));

app.use(cookieParser());

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));

app.get("/details", cors(corsOptions), (req, res) => {
  assignmentSch.find({}).then((data, err) => {
    if (err) {
      console.log(err);
    }
    res.send(data);
    // res.render('assignments',{items: data})
  });
});

const convertDataHeat = (data) => {
  return data.map((item) => ({
    id: item.Month.toLowerCase(),
    data: Object.entries(item)
      .filter(([key, value]) => key !== "Month" && key !== "_id")
      .map(([key, value]) => ({ x: key, y: value })),
  }));
};

app.get("/details/heatmap", cors(corsOptions), async (req, res) => {
  // assignmentSch.find({}).then((data, err) => {
  //   if (err) {
  //     console.log(err);
  //   }
  //   res.send(data);
  //   // res.render('assignments',{items: data})
  // });
  try {
    const data = await assignmentSch
      .find({})
      .lean()
      .then((data) => {
        return data;
      });
    // console.log(data);
    const convertedData = convertDataHeat(data);
    // console.log(convertedData);
    res.send(convertedData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

const convertDataLine = (data) => {
  return data.map((item) => ({
    id: item.Month.toLowerCase(),
    color: "hsl(105, 70%, 50%)",
    data: Object.entries(item)
      .filter(([key, value]) => key !== "Month" && key !== "_id")
      .map(([key, value]) => ({ x: key, y: value })),
  }));
};

app.get("/details/line", cors(corsOptions), async (req, res) => {
  // assignmentSch.find({}).then((data, err) => {
  //   if (err) {
  //     console.log(err);
  //   }
  //   res.send(data);
  //   // res.render('assignments',{items: data})
  // });
  try {
    const data = await assignmentSch
      .find({})
      .lean()
      .then((data) => {
        return data;
      });
    // console.log(data);
    const convertedData = convertDataLine(data);
    // console.log(convertedData);
    res.json(convertedData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

const convertData = (data) => {
  return data.map((item) => ({
    id: item.Month.toLowerCase(),
    data: Object.entries(item)
      .filter(([key, value]) => key !== "Month" && key !== "_id")
      .map(([key, value]) => ({ x: key, y: value })),
  }));
};

app.get("/details/piechart/:id", cors(corsOptions), async (req, res) => {
  // assignmentSch.find({}).then((data, err) => {
  //   if (err) {
  //     console.log(err);
  //   }
  //   res.send(data);
  //   // res.render('assignments',{items: data})
  // });
  try {
    const data = await assignmentSch.findById(req.params.id).then((data) => {
      return data;
    });
    // console.log(data);
    const convertedData = [];

    // Define the properties and labels for the new data format
    const properties = [
      "PVSYST_GHI",
      "PVSYST_GTI",
      "PVSYST_Energy",
      "Contractual_Energy",
      "Actual_GTI",
      "Actual_GHI",
      "PVSyst_GTI_vs_Actual_GTI",
      "PVSyst_GHI_vs_Actual_GHI",
      "PVSyst_Energy_vs_Contractual_Energy",
      "T_Cell_Avg_C",
      "Actual_Inverter_Energy_KWh",
      "Actual_Export_Energy_KWh",
      "Actual_Import_Energy_KWh",
      "AC_loss_per",
      "Net_Energy",
      "Normalised_Energy_KWh",
      "Excess_Shortfall_Normalised_KWh",
      "Excess_Shortfall_Normalised_in_percentage",
      "Excess_Shortfall_KWh",
      "Excess_Shortfall__in_percentage",
    ];
    // let k=0;
    // console.log(data);
    // for (let i in data) {
    //   console.log(i);
    //   for (let j in data[i]) {
    //     const color = `hsl(10%, 70%, 50%)`;

    //     convertedData.push({
    //       id: i,
    //       label: i,
    //       value: data[i][j],
    //       color
    //     });
    //   }
    // }
    //   data.forEach(res => {
    //     Object.entries(res).forEach(([key, value]) => {
    //     // console.log(key + ": " + value ); //subing console.log so it prints here
    //     const color = `hsl(10%, 70%, 50%)`;

    //       convertedData.push({
    //         id: key,
    //         label: key,
    //         value: value,
    //         color
    //       });
    //     })
    // })
    // var dataa = JSON.stringify(data);
    // var dataa = JSON.parse(data);
    // dataa.forEach(function (obj, index) {
    //   console.log(index);
    //   for (var key in obj) {
    //     console.log(key, obj[key]);
    //     convertedData.push({
    //       id: key,
    //       label: key,
    //       value: obj[key],
    //       // color
    //     });
    //   }
    // });
    // console.log(convertedData);
    // res.json(convertedData);
    const result = {};
const keys = Object.keys(data);
for (let i = 0; i < keys.length; i++) {
  const key = keys[i];
  id = key;
  result[key] = data[key];
}

const transformedData = [];

for (const key in result._doc) {
  if (key !== '_id' && key !== 'Month') {
    transformedData.push({
      id: key,
      label: key,
      value: result._doc[key],
      color: `hsl(51, 70%, 50%)`,
    });
  }
}

// console.log(transformedData);
res.send(transformedData)

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/details/:id", cors(corsOptions), async (req, res) => {
  try {
    // const { id } = req.params;
    await assignmentSch.findById(req.params.id).then((data, err) => {
      if (err) {
        console.log(err);
      }
      res.send(data);
    });
    // res.status(200).json({success:true});
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the details." });
  }
});

app.post("/details", cors(corsOptions), upload.any(), (req, res, next) => {
  console.log("posting");

  console.log(req.body.Month);

  var obj = {
    Month: req.body.Month,
    PVSYST_GHI: req.body.PVSYST_GHI,
    PVSYST_GTI: req.body.PVSYST_GTI,
    PVSYST_Energy: req.body.PVSYST_Energy,
    Contractual_Energy: req.body.Contractual_Energy,
    Actual_GTI: req.body.Actual_GTI,
    Actual_GHI: req.body.Actual_GHI,
    PVSyst_GTI_vs_Actual_GTI: req.body.PVSyst_GTI_vs_Actual_GTI,
    PVSyst_GHI_vs_Actual_GHI: req.body.PVSyst_GHI_vs_Actual_GHI,
    PVSyst_Energy_vs_Contractual_Energy:
      req.body.PVSyst_Energy_vs_Contractual_Energy,
    T_Cell_Avg_C: req.body.T_Cell_Avg_C,
    Actual_Inverter_Energy_KWh: req.body.Actual_Inverter_Energy_KWh,
    Actual_Export_Energy_KWh: req.body.Actual_Export_Energy_KWh,
    Actual_Import_Energy_KWh: req.body.Actual_Import_Energy_KWh,
    AC_loss_per: req.body.AC_loss_per,
    Net_Energy: req.body.Net_Energy,
    Normalised_Energy_KWh: req.body.Normalised_Energy_KWh,
    Excess_Shortfall_Normalised_KWh: req.body.Excess_Shortfall_Normalised_KWh,
    Excess_Shortfall_Normalised_in_percentage:
      req.body.Excess_Shortfall_Normalised_in_percentage,
    Excess_Shortfall_KWh: req.body.Excess_Shortfall_KWh,
    Excess_Shortfall__in_percentage: req.body.Excess_Shortfall__in_percentage,
  };
  assignmentSch.create(obj).then(
    (message) => {
      console.log("Then success:" + message);
      res.redirect("/");
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        // item.save();
        console.log("redirecting.....");
      }
    }
  );
});

app.patch("/details/:id", cors(corsOptions), async (req, res) => {
  const {
    Month,
    PVSYST_GHI,
    PVSYST_GTI,
    PVSYST_Energy,
    Contractual_Energy,
    Actual_GTI,
    Actual_GHI,
    PVSyst_GTI_vs_Actual_GTI,
    PVSyst_GHI_vs_Actual_GHI,
    PVSyst_Energy_vs_Contractual_Energy,
    T_Cell_Avg_C,
    Actual_Inverter_Energy_KWh,
    Actual_Export_Energy_KWh,
    Actual_Import_Energy_KWh,
    AC_loss_per,
    Net_Energy,
    Normalised_Energy_KWh,
    Excess_Shortfall_Normalised_KWh,
    Excess_Shortfall_Normalised_in_percentage,
    Excess_Shortfall_KWh,
    Excess_Shortfall__in_percentage,
  } = req.body;

  // var Month = req.body.Month,
  // var PVSYSTGHI = req.body.PVSYSTGHI,
  // const PVSYST_GTI = req.body.PVSYSTGHI,
  // const PVSYST_Energy = req.body.PVSYSTEnergy,
  // const Contractual_Energy = req.body.ContractualEnergy,
  // const Actual_GTI = req.body.ActualGTI,
  // const PVSyst_GTI_vs_Actual_GTI = req.body.PVSystGTIvsActualGTI,
  //  const PVSyst_GHI_vs_Actual_GHI = req.body.PVSystGHIvsActualGHI,
  // const PVSyst_Enegy_vs_Contractual_Energy = req.body.PVSystEnegyvsContractualEnergy,
  // const T_Cell_Avg_C = req.body.TCellAvgC,
  //  const Actual_Inverter_Energy_KWh = req.body.ActualInverterEnergyKWh,
  // const Actual_Export_Energy_KWh = req.body.ActualExportEnergyKWh,
  // const Actual_Import_Energy_KWh = req.body.ActualImportEnergyKWh,
  // const AC_loss_per = req.body.AC_loss_per,
  // const Net_Energy = req.body.Net_Energy,
  // const Normalised_Energy_KWh = req.body.Normalised_Energy_KWh,
  // const ExcessShortfall_Normalised_KWh = req.body.ExcessShortfallNormalisedKWh,
  // const Excess_Shortfall_Normalised_in_percentage = req.body.ExcessShortfallNormalisedinpercentage,
  // const Excess_Shortfall_KWh = req.body.Excess_Shortfall_KWh,
  // const Excess_Shortfall__in_percentage = req.body.ExcessShortfallinpercentage,

  assignmentSch
    .findByIdAndUpdate(req.params.id, {
      Month,
      PVSYST_GHI,
      PVSYST_GTI,
      PVSYST_Energy,
      Contractual_Energy,
      Actual_GTI,
      Actual_GHI,
      PVSyst_GTI_vs_Actual_GTI,
      PVSyst_GHI_vs_Actual_GHI,
      PVSyst_Energy_vs_Contractual_Energy,
      T_Cell_Avg_C,
      Actual_Inverter_Energy_KWh,
      Actual_Export_Energy_KWh,
      Actual_Import_Energy_KWh,
      AC_loss_per,
      Net_Energy,
      Normalised_Energy_KWh,
      Excess_Shortfall_Normalised_KWh,
      Excess_Shortfall_Normalised_in_percentage,
      Excess_Shortfall_KWh,
      Excess_Shortfall__in_percentage,
    })
    .then((data) => {
      res.json(data);
      res.end();
    });
});

app.delete("/details/:id", cors(corsOptions), async (req, res) => {
  try {
    // const { id } = req.params;
    await assignmentSch.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the details." });
  }
});

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
