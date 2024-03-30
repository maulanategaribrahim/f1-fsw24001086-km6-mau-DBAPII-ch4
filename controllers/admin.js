const Car = require("../models/cars");

const adminPage = async (req, res) => {
  let fullUrl = "http://localhost:3000/dashboard";
  try {
    const url = req.url;
    let seat = 0;
    if (url === "/?category=small") {
      fullUrl += url.slice(1);
      seat = 1;
    } else if (url === "/?category=medium") {
      fullUrl += url.slice(1);
      seat = 4;
    } else if (url === "/?category=large") {
      fullUrl += url.slice(1);
      seat = 7;
    }

    const { category, search } = req.query;

    const condition = {};

    if (category) {
      condition.seats = { $gte: Number(seat), $lt: Number(seat) + 3 };
    }

    if (search) {
      condition.name = new RegExp(search, "i");
    }

    

    const cars = await Car.find().where(condition).exec();
    res.render("index", {
      title: "dashboard",
      fullUrl,
      cars,
      message: req.flash("message", ""),
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};

const createCarPage = async (req, res) => {
  try {
    // const newCar = await Car.create(req.body);
    res.render("create", {
      title: "create car",
      // cars,
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};

const editCarPage = async (req, res) => {
  try {
    const car = await Car.find().where({
      _id: req.query.id,
    });
    res.render("edit", {
      car,
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};

const createCar = async (req, res) => {
  const { name, priceRent, seats, type } = req.body;
  const file = req.file
  try {
    if (!req.file) {
      throw new Error('No image file provided');
    }
     // dapatkan extension file nya
    const split = file.originalname.split(".")
    const extension = split[split.length - 1]

    // Simpan data mobil ke basis data
    const car = await Car.create({
      name,
      priceRent,
      seats,
      type,
      image: `/images/${req.file.filename}`,
    });

    req.flash("message", "Ditambah");
    res.redirect("/dashboard");
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
}

const editCar = async (req, res) => {
  const { name, priceRent, seats, type } = req.body;
  const file = req.file; // Mengambil file dari form jika ada
  let imgUrl;

  try {
    const id = req.query.id;

  // Jika ada file yang diunggah
  if (file && file.filename) {
    imgUrl = `/images/${file.filename}`; 
  } else {
    // Jika tidak ada file yang diunggah, gunakan URL gambar yang ada di database
    const lastFile = await Car.findById(id);
    if (lastFile && lastFile.image) {
      imgUrl = lastFile.image;
    } else {
      // Handle jika lastFile atau lastFile.image kosong
      console.error('File atau URL gambar tidak ditemukan');
    }
  }

    // Perbarui data mobil
    const now = new Date();
    const dateTimeString = `${now.toDateString()} ${now.toTimeString()}`;

    const updateCar = {
      name,
      priceRent,
      seats,
      type,
      image: imgUrl,
      lastModified: dateTimeString,
    };

    await Car.findByIdAndUpdate(id, updateCar, { new: true });
    req.flash("message", "DiUpdateerbarui");
    res.redirect("/dashboard");
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};

const deleteCar = async (req, res) => {
  try {
    const id = req.params.id;
    await Car.findByIdAndRemove(id);
    req.flash("message", "DiHapus")
    res.redirect("/dashboard");
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};

module.exports = {
  adminPage,
  createCarPage,
  editCarPage,
  createCar,
  editCar,
  deleteCar,
};
