const fs = require("fs");
const Car = require("../models/cars");

const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json({
      status: "success",
      requestTime: req.requestTime,
      length: cars.length,
      data: {
        cars,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err.message,
    });
  }
};


const getCarById = async  (req, res) => {
  try{
      const id = req.params.id;
      const car = await Car.findById(id)
      res.status(200).json({
          status: "success",
          data: {
              car
          }
      })
  } catch(err) {
      res.status(400).json({
          status: "fail",
          message: err.message
      })
  }
}

const updateCar = async (req, res) => {
  try {
      const id = req.params.id

      const car = await Car.findByIdAndUpdate(id, req.body, {
          new:true, //return the updated document
          runValidators: true //validate before saving
      })
      
      res.status(200).json({
          status:"succes",
          message: "data updated",
          data:{car}
      })
  } catch (err) {
      res.status(400).json({
          status: "fail",
          message: err.message
      })
  }
}

const deleteCar = async (req, res) => {
  try {
      const id = req.params.id;
      
      await Car.findByIdAndDelete(id)
      res.status(200).json({
          status: 'success',
          message:'Data has been deleted'
      });
  } catch (err) {
      res.status(400).json({
          status: "fail",
          message: err.message
      })
  }
}

const createCar = async (req, res) => {
  try {
      const newCar = await Car.create(req.body)
      res.status(201).json({
          status: 'success',
          data:newCar
      })
  } catch (err) {
      res.status(400).json({
          status: "fail",
          message: err.message
      })
  }
}


module.exports = {
  getAllCars,
  getCarById, 
  updateCar,
  deleteCar, 
  createCar,
};
