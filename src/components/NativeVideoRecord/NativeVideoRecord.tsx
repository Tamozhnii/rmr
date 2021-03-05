import React from "react";
import {
  VideoRecorder,
  Options as VideoRecorderOptions,
} from "nativescript-videorecorder";

const VideoNative: React.FC = (): JSX.Element => {
  
const options: VideoRecorderOptions = {
    hd: true,
    saveToGallery: true,
}
const videorecorder = new VideoRecorder(options)

  const startFunction = () => {

videorecorder.record().then((data) => {
    console.log(data.file)
}).catch((err) => {
    console.log(err)
})
  }
  return (
    <div>
      <video id="video" width={320} autoPlay onClick={startFunction}/>
    </div>
  );
  //   return <video autoPlay width={300} height={200} />;
};

export default VideoNative;
