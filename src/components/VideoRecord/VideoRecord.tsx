import Modal from "antd/lib/modal/Modal";
import React from "react";
import { ReactMediaRecorder } from "react-media-recorder";

interface IVideoRecord {
  onOk: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  visible: boolean;
}

const VideoPreview = ({ stream }: { stream: MediaStream | null }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  if (!stream) {
    return null;
  }
  return <video ref={videoRef} width={500} height={500} autoPlay controls />;
};

const VideoRecord: React.FC<IVideoRecord> = ({
  onOk: handleOk,
  onCancel: handleCancel,
  visible,
}): React.ReactElement => {
  return (
    <Modal onOk={handleOk} onCancel={handleCancel} visible={visible}>
      <ReactMediaRecorder
        video
        render={({
          status,
          startRecording,
          stopRecording,
          mediaBlobUrl,
          previewStream,
        }) => {
          return (
            <div>
              <p>{status}</p>
              <button onClick={startRecording}>Start Recording</button>
              <button onClick={stopRecording}>Stop Recording</button>
              {mediaBlobUrl ? (
                <video src={mediaBlobUrl} controls height={300} width={600} />
              ) : (
                <VideoPreview stream={previewStream} />
              )}
            </div>
          );
        }}
        onStop={(blobUrl: string, blob: Blob) => {
          console.log(blobUrl);
        }}
        mediaRecorderOptions={{ mediaBlobUrl: "" }}
      />
    </Modal>
  );
};

export default VideoRecord;
