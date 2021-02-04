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
  const [streaming, setStreaming] = React.useState<MediaStream | null>(
    new MediaStream()
  );
  return (
    <Modal
      onCancel={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setVideo(undefined);
        onCancel();
      }}
      visible={visible}
      footer={null}
      width={800}
    >
      <ReactMediaRecorder
        video
        onStop={(blobUrl: string, blob: Blob) => {
          setVideo(blobUrl);
        }}
        mediaRecorderOptions={{
          mediaBlobUrl: videoUrl,
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
          setStreaming(previewStream);
          return (
            <div>
              <p>{status}</p>
              <button onClick={startRecording}>Start Recording</button>
              <button onClick={stopRecording}>Stop Recording</button>
              <button onClick={pauseRecording}>Pause Recording</button>
              <button onClick={resumeRecording}>Resume Recording</button>
              <button
                onClick={() => {
                  clearBlobUrl();
                  setVideo(undefined);
                }}
              >
                Clear Recording
              </button>
              {videoUrl ? (
                <video src={videoUrl} controls height={300} width={600} />
              ) : (
                <VideoPreview stream={streaming} />
              )}
            </div>
          );
        }}
      />
    </Modal>
  );
};

export default VideoRecord;
