import {
  nets,
  draw,
  resizeResults,
  detectAllFaces,
  matchDimensions,
  createCanvasFromMedia,
  TinyFaceDetectorOptions,
} from 'face-api.js';

class FaceDetection {
  constructor(body, video) {
    this.body = document.querySelector(body);
    this.video = document.querySelector(video);
  }

  loadModels() {
    Promise.all([
      nets.tinyFaceDetector.loadFromUri('/src/lib/models'),
      nets.faceLandmark68Net.loadFromUri('/src/lib/models'),
      nets.faceRecognitionNet.loadFromUri('/src/lib/models'),
      nets.faceExpressionNet.loadFromUri('/src/lib/models'),
    ]);
  }

  startVideo() {
    const { video } = this;

    navigator.mediaDevices
      .getUserMedia({ audio: false, video })
      .then((stream) => {
        video.srcObject = stream;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  addDrawEvent() {
    this.video.addEventListener('play', () => {
      const canvas = createCanvasFromMedia(this.video);

      this.body.append(canvas);

      const displaySize = {
        width: this.video.width,
        height: this.video.height,
      };

      matchDimensions(canvas, displaySize);

      setInterval(async () => {
        const detections = await detectAllFaces(
          this.video,
          new TinyFaceDetectorOptions()
        )
          .withFaceLandmarks()
          .withFaceExpressions();

        const resizedDetections = resizeResults(detections, displaySize);

        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

        draw.drawDetections(canvas, resizedDetections);
      }, 100);
    });
  }

  init() {
    if (this.body && this.video) {
      this.loadModels();
      this.startVideo();
      this.addDrawEvent();
    }
  }
}

export default FaceDetection;
