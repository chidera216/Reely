import multer from "multer";
import path from "node:path";
import fs from "node:fs";

const uploadDir = path.resolve("uploads");

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadDir);
  },

  filename: (_req, file, callback) => {
    const extension = file.mimetype === "video/mp4" ? ".mp4" : ".webm";

    callback(
      null,
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`,
    );
  },
});

const fileFilter = (_req, file, callback) => {
  const allowedTypes = ["video/mp4", "video/webm"];

  if (!allowedTypes.includes(file.mimetype)) {
    return callback(new Error("Only MP4 and WebM videos are allowed."));
  }

  callback(null, true);
};

const uploadVideo = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 250 * 1024 * 1024,
    files: 1,
  },
});

export default uploadVideo;
