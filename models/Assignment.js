const mongoose = require("mongoose");
const Double = require("mongodb").Double;

const assignmentSchema = new mongoose.Schema({
  Month: {
    type: String,
    //required: true
  },
  PVSYST_GHI: {
    type: Number,
    double: true,
    // required: true
  },
  PVSYST_GTI: {
    type: Number,
    double: true,
    //required: true
  },
  PVSYST_Energy: {
    type: Number,
    double: true,
    //required: true
  },
  Contractual_Energy: {
    type: Number,
    double: true,
    //required: true
  },
  Actual_GTI: {
    type: Number,
    double: true,
    //required: true
  },
  Actual_GHI: {
    type: Number,
    double: true,
    //required: true
  },
  PVSyst_GTI_vs_Actual_GTI: {
    type: Number,
    double: true,
    //required: true
  },
  PVSyst_GHI_vs_Actual_GHI: {
    type: Number,
    double: true,
    //required: true
  },
  PVSyst_Energy_vs_Contractual_Energy: {
    type: Number,
    double: true,
    //required: true
  },
  T_Cell_Avg_C: {
    type: Number,
    double: true,
    //required: true
  },
  Actual_Inverter_Energy_KWh: {
    type: Number,
    double: true,
    //required: true
  },
  Actual_Export_Energy_KWh: {
    type: Number,
    double: true,
    //required: true
  },
  Actual_Import_Energy_KWh: {
    type: Number,
    double: true,
    //required: true
  },
  AC_loss_per: {
    type: Number,
    double: true,
    //required: true
  },
  Net_Energy: {
    type: Number,
    double: true,
    //required: true
  },
  Normalised_Energy_KWh: {
    type: Number,
    double: true,
    //required: true
  },
  Excess_Shortfall_Normalised_KWh: {
    type: Number,
    double: true,
    //required: true
  },
  Excess_Shortfall_Normalised_in_percentage: {
    type: Number,
    double: true,
    //required: true
  },
  Excess_Shortfall_KWh: {
    type: Number,
    double: true,
    //required: true
  },
  Excess_Shortfall__in_percentage: {
    type: Number,
    double: true,
    //required: true
  },
});

module.exports = mongoose.model("assignments", assignmentSchema);
