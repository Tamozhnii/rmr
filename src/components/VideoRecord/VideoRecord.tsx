import Modal from "antd/lib/modal/Modal";
import React from "react";
import { ReactMediaRecorder } from "react-media-recorder";

interface IVideoRecord {
  onCancel: () => void;
  visible: boolean;
  setVideo: Function;
  videoUrl?: string;
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
  return <video ref={videoRef} height={300} width={600} autoPlay />;
};

const VideoRecord: React.FC<IVideoRecord> = ({
  onCancel,
  visible,
  videoUrl,
  setVideo,
}): React.ReactElement => {
  return (
    <Modal
      onCancel={() => {
        setVideo(undefined);
        onCancel();
      }}
      visible={visible}
      footer={null}
      width={600}
    >
      <ReactMediaRecorder
        video
        onStop={(blobUrl: string, blob: Blob) => {
          setVideo(blobUrl);
        }}
        render={({
          status,
          startRecording,
          stopRecording,
          pauseRecording,
          resumeRecording,
          mediaBlobUrl,
          previewStream,
          clearBlobUrl,
        }) => {
          setVideo(mediaBlobUrl);
          return (
            <div>
              {videoUrl && mediaBlobUrl ? (
                <video src={videoUrl} controls height={300} width={600} />
              ) : (
                <VideoPreview stream={previewStream} />
              )}
              <p>{status}</p>
              <button onClick={startRecording}>Start Recording</button>
              <button onClick={stopRecording}>Stop Recording</button>
              <button onClick={pauseRecording}>Pause Recording</button>
              <button onClick={resumeRecording}>Resume Recording</button>
              <button
                onClick={() => {
                  mediaBlobUrl = null;
                  clearBlobUrl();
                  setVideo(undefined);
                }}
              >
                Clear Recording
              </button>
            </div>
          );
        }}
      />
    </Modal>
  );
};

export default VideoRecord;
