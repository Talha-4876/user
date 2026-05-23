import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

/* =====================================================
   FILE FILTER
===================================================== */

const fileFilter = (req, file, cb) => {

  const allowedTypes = [

    "image/jpeg",

    "image/png",

    "image/webp",

    "image/jpg",

  ];

  if (
    allowedTypes.includes(file.mimetype)
  ) {

    cb(null, true);

  } else {

    cb(
      new Error(
        "Only JPG, PNG and WEBP images are allowed"
      ),
      false
    );
  }
};

/* =====================================================
   MEMORY STORAGE
===================================================== */

const storage = multer.memoryStorage();

/* =====================================================
   CLOUDINARY UPLOAD
===================================================== */

export const uploadToCloudinary = (
  buffer,
  folder = "restaurant-tables"
) => {

  return new Promise(
    (resolve, reject) => {

      cloudinary.uploader
        .upload_stream(

          {
            folder,

            resource_type: "image",

            transformation: [

              {
                width: 1200,
                crop: "limit",
                quality: "auto",
              },

            ],
          },

          (error, result) => {

            if (error) {

              reject(error);

            } else {

              resolve(result);
            }
          }

        )
        .end(buffer);
    }
  );
};

/* =====================================================
   MULTER UPLOAD
===================================================== */

const upload = multer({

  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

});

export default upload;