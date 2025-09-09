const fileUpload = require('express-fileupload');
const os = require('os');
const path = require('path');

const uploadMiddleware = fileUpload({
  useTempFiles: true,
  tempFileDir: path.join(os.tmpdir(), 'blogss-temp'),
  limits: {
    fileSize: 20 * 1024 * 1024,
    files: 40
  },
  abortOnLimit: true,
  responseOnLimit: 'File size limit has been reached',
  createParentPath: true,
  debug: "development" === 'development',
  cleanup: false // Manually manage cleanup
});

const validateFileType = (file, allowedTypes) => {
  if (!file) return false;
  
  const fileType = file.mimetype;
  return allowedTypes.includes(fileType);
};

const validateImage = (file) => {
  const allowedImageTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ];
  return validateFileType(file, allowedImageTypes);
};

const validateVideo = (file) => {
  const allowedVideoTypes = [
    'video/mp4',
    'video/avi',
    'video/mov',
    'video/wmv',
    'video/flv',
    'video/webm'
  ];
  return validateFileType(file, allowedVideoTypes);
};

const validateFileSize = (file, maxSize = 10 * 1024 * 1024) => {
  if (!file) return false;
  return file.size <= maxSize;
};

const generateUniqueFilename = (originalName) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop();
  return `${timestamp}_${randomString}.${extension}`;
};

module.exports = {
  uploadMiddleware,
  validateImage,
  validateVideo,
  validateFileSize,
  generateUniqueFilename
};