import { Button, Modal } from "antd";
import React from "react";
import VideoRecorder from "react-video-recorder-ru";
import "./Recorder.module.css";

const ReactVideoRecorder = ({ onCancel, visible }) => {
  const [file, setFile] = React.useState();
  console.log(VideoRecorder);

  const handleClick = React.useCallback(() => {
    console.log(file);
  }, [file]);

  // const kostil = React.useCallback(() => {
  //   let btn = document.querySelector('button[data-qa="turn-on-camera"]');
  //   if (btn) {
  //     btn.innerHTML = "Пися";
  //   }

  //   btn = document.querySelector('button[data-qa="start-replaying"]');
  //   if (btn) {
  //     btn.innerHTML = "Сися";
  //   }
  // });

  // React.useEffect(() => {
  //   console.log("Козёл");
  //   setTimeout(() => kostil(), 0);
  // }, [kostil]);

  return (
    <Modal
      title={"Запись видео-ответа"}
      onCancel={() => {
        // setFile(undefined);
        onCancel();
      }}
      visible={visible}
      footer={null}
    >
      <VideoRecorder
        showReplayControls={true}
        replayVideoAutoplayAndLoopOff={true}
        countdownTime={0}
        isRunningCountdown={false}
        onRecordingComplete={(videoBlob) => {
          setFile(videoBlob);
        }}
        onStopReplaying={() => setFile(undefined)}
      />
      <Button onClick={handleClick}>Отпрвить видео</Button>
    </Modal>
  );
};

export default ReactVideoRecorder;
