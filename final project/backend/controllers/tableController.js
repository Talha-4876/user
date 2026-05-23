import Table from "../models/tableModel.js";
import Reservation from "../models/reservationModels.js";

import {
  uploadToCloudinary,
} from "../middleware/multer.js";

/* =========================================================
   ADD TABLE (ADMIN)
========================================================= */
export const addTable = async (req, res) => {

  try {

    console.log("BODY:", req.body);

    console.log("FILE:", req.file);

    const body = req.body || {};

    const {
      tableNumber,
      seats,
      label,
      location,
      type,
      furniture,
      description,
      price,
    } = body;

    /* =====================================================
       FEATURES PARSE
    ===================================================== */

    const parsedFeatures =
      body.features
        ? JSON.parse(body.features)
        : [];

    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!tableNumber || !seats) {

      return res.status(400).json({
        success: false,
        message:
          "tableNumber and seats are required",
      });
    }

    /* =====================================================
       CHECK EXISTING TABLE
    ===================================================== */

    const exists = await Table.findOne({
      tableNumber,
    });

    if (exists) {

      return res.status(400).json({
        success: false,
        message:
          "Table number already exists",
      });
    }

    /* =====================================================
       IMAGE UPLOAD
    ===================================================== */

    let image = "";

    if (req.file) {

      const uploadedImage =
        await uploadToCloudinary(
          req.file.buffer,
          "restaurant-tables"
        );

      image =
        uploadedImage.secure_url;
    }

    console.log(
      "IMAGE URL:",
      image
    );

    /* =====================================================
       CREATE TABLE
    ===================================================== */

    const table = await Table.create({

      tableNumber,

      seats,

      label,

      location,

      type,

      furniture,

      description,

      image,

      price,

      features: parsedFeatures,

    });

    res.status(201).json({
      success: true,
      table,
    });

  } catch (err) {

    console.error(
      "ADD TABLE ERROR:",
      err
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to add table",
    });
  }
};

/* =========================================================
   GET ALL TABLES
========================================================= */
export const getAllTables = async (req, res) => {

  try {

    const tables = await Table.find({
      isActive: true,
    }).sort({ tableNumber: 1 });

    res.json({
      success: true,
      tables,
    });

  } catch (err) {

    console.error(
      "GET TABLES ERROR:",
      err
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch tables",
    });
  }
};

/* =========================================================
   DELETE TABLE
========================================================= */
export const deleteTable = async (req, res) => {

  try {

    await Table.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
      message: "Table deleted",
    });

  } catch (err) {

    console.error(
      "DELETE TABLE ERROR:",
      err
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete table",
    });
  }
};

/* =========================================================
   UPDATE TABLE
========================================================= */
export const updateTable = async (req, res) => {

  try {

    const updatedTable =
      await Table.findByIdAndUpdate(

        req.params.id,

        req.body,

        { new: true }

      );

    if (!updatedTable) {

      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    res.json({
      success: true,
      table: updatedTable,
    });

  } catch (err) {

    console.error(
      "UPDATE TABLE ERROR:",
      err
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update table",
    });
  }
};

/* =========================================================
   GET TABLES WITH STATUS
========================================================= */
export const getTablesWithStatus = async (req, res) => {

  try {

    const { date, time } = req.query;

    const tables = await Table.find({
      isActive: true,
    }).sort({ tableNumber: 1 });

    let reservations = [];

    if (date && time) {

      reservations =
        await Reservation.find({

          "table.date": date,

          "table.time": time,

          status: {
            $ne: "cancelled",
          },
        });

    } else {

      reservations =
        await Reservation.find({
          status: "active",
        });
    }

    const tablesWithStatus =
      tables.map((t) => {

        const isBooked =
          reservations.some(
            (r) =>
              r.table.tableNumber ===
              t.tableNumber
          );

        return {

          _id: t._id,

          tableNumber:
            t.tableNumber,

          seats: t.seats,

          label: t.label,

          location:
            t.location,

          type: t.type,

          furniture:
            t.furniture,

          image: t.image,

          description:
            t.description,

          price: t.price,

          features:
            t.features,

          status: isBooked
            ? "Booked"
            : "Available",
        };
      });

    res.json({
      success: true,
      tables: tablesWithStatus,
    });

  } catch (err) {

    console.error(
      "STATUS ERROR:",
      err
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch tables status",
    });
  }
};

/* =========================================================
   GET SINGLE TABLE DETAILS
========================================================= */
export const getSingleTableDetails =
  async (req, res) => {

    try {

      const table =
        await Table.findOne({

          tableNumber:
            req.params.tableNumber,

          isActive: true,
        });

      if (!table) {

        return res.status(404).json({
          success: false,
          message:
            "Table not found",
        });
      }

      const reservations =
        await Reservation.find({

          "table.tableNumber":
            table.tableNumber,

          status: {
            $ne: "cancelled",
          },
        });

      const bookedSlots =
        reservations.map((r) => ({

          date: r.table.date,

          time: r.table.time,

          guests:
            r.table.guests,

          user:
            r.user?.name ||
            "Guest",
        }));

      res.json({

        success: true,

        table: {

          _id: table._id,

          tableNumber:
            table.tableNumber,

          seats: table.seats,

          label: table.label,

          location:
            table.location,

          type: table.type,

          furniture:
            table.furniture,

          image: table.image,

          description:
            table.description,

          price: table.price,

          features:
            table.features,

          bookedSlots,
        },
      });

    } catch (err) {

      console.error(
        "TABLE DETAIL ERROR:",
        err
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch table details",
      });
    }
  };

/* =========================================================
   GET BOOKINGS
========================================================= */
export const getTableBookings =
  async (req, res) => {

    try {

      const {
        tableNumber,
        date,
      } = req.query;

      if (
        !tableNumber ||
        !date
      ) {

        return res.status(400).json({
          success: false,
          message:
            "tableNumber and date required",
        });
      }

      const reservations =
        await Reservation.find({

          "table.tableNumber":
            parseInt(tableNumber),

          "table.date": date,

          status: {
            $ne: "cancelled",
          },
        });

      const bookings =
        reservations.map((r) => ({

          time: r.table.time,

          guests:
            r.table.guests,

          user:
            r.user?.name ||
            "Guest",
        }));

      res.json({
        success: true,
        bookings,
      });

    } catch (err) {

      console.error(
        "GET BOOKINGS ERROR:",
        err
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch bookings",
      });
    }
  };