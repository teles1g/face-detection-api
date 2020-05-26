import FaceDetection from './modules/face-detection';

const faceDetection = new FaceDetection('body', '[data-preview="video"]');
faceDetection.init();
