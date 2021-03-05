import React from "react";
import { ReactMediaRecorder } from "react-media-recorder";

const Video: React.FC = (): JSX.Element => {
  const constraints = { video: { width: { max: 320 } }, audio: true };

  let theStream: any;
  let theRecorder: any;
  let recordedChunks: Array<any> = [];
  let recorder: MediaStream;

  const startFunction = () => {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(gotMedia)
      .catch((e) => {
        console.error("getUserMedia() failed: " + e);
      });
  };

  const gotMedia = (stream: MediaStream) => {
    theStream = stream;
    let video = document.querySelector("video");
    if (video) video.srcObject = stream;
    try {
      recorder = new MediaStream(stream);
    } catch (e) {
      console.error("Exception while creating MediaRecorder: " + e);
      return;
    }

    recordedChunks.push(recorder.getVideoTracks()[0]);
  };

  // From @samdutton's "Record Audio and Video with MediaRecorder"
  // https://developers.google.com/web/updates/2016/01/mediarecorder
  const download = () => {
    // theRecorder.stop();
    theStream.getTracks().forEach((track: any) => {
      track.stop();
    });

    let blob = new Blob(recordedChunks, { type: "video/mp4" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.href = url;
    a.download = "test.mp4";
    a.click();
    // setTimeout() here is needed for Firefox.
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 100);
  };

  /////////////////
  //   navigator.getUserMedia(
  //     { video: true, audio: true },
  //     (steam) => {
  //       const video = document.querySelector("video");
  //       if (video) video.src = window.URL.createObjectURL(steam);
  //     },
  //     (err) => {}
  //   );

  return (
    <div>
      <video id="video" width={320} autoPlay />
      <button onClick={startFunction}>{"Grab video & start recording"}</button>
      <button onClick={download}>{"Download! (and stop video)"}</button>
    </div>
  );
  //   return <video autoPlay width={300} height={200} />;
};

export default Video;
