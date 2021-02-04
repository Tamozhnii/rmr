import Modal from "antd/lib/modal/Modal";
import React from "react";
import { ReactMediaRecorder } from "react-media-recorder";

interface IVideoRecord {
  onOk: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  visible: boolean;
}

const VideoRecord: React.FC<IVideoRecord> = ({
  onOk: handleOk,
  onCancel: handleCancel,
  visible,
}): React.ReactElement => {
  return (
    <Modal onOk={handleOk} onCancel={handleCancel} visible={visible}>
      <ReactMediaRecorder
        video
        render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
          <div>
            <p>{status}</p>
            <button onClick={startRecording}>Start Recording</button>
            <button onClick={stopRecording}>Stop Recording</button>
            <video src={mediaBlobUrl!!} controls />
          </div>
        )}
      />
    </Modal>
  );
};

export default VideoRecord;
