import React from "react";

const Video: React.FC = (): JSX.Element => {
  navigator.getUserMedia(
    { video: true, audio: true },
    (steam) => {
      const video = document.querySelector("video");
      if (video) video.src = window.URL.createObjectURL(steam);
    },
    (err) => {}
  );

  return <video autoPlay width={300} height={200} />;
};

export default Video;
