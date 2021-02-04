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
  return <video ref={videoRef} height={300} width={600} autoPlay />;
};

const VideoRecord: React.FC<IVideoRecord> = ({
  onOk: handleOk,
  onCancel: handleCancel,
  visible,
}): React.ReactElement => {
  const [url, setUrl] = React.useState<string | undefined>();
  const [streams, setStreams] = React.useState<MediaStream | null>(
    new MediaStream()
  );

  return (
    <Modal
      onCancel={handleCancel}
      closeIcon={false}
      cancelText={"Ok"}
      visible={visible}
      width={800}
    >
      <ReactMediaRecorder
        video
        onStop={(blobUrl: string, blob: Blob) => {
          setUrl(blobUrl);
        }}
        mediaRecorderOptions={{
          mediaBlobUrl: url,
          previewStream: streams,
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
                  setUrl(undefined);
                  new MediaDevices()
                    .getUserMedia()
                    .then((value: MediaStream) => setStreams(value))
                    .catch();
                }}
              >
                Clear Recording
              </button>
              {mediaBlobUrl ? (
                <video src={mediaBlobUrl} controls height={300} width={600} />
              ) : (
                <VideoPreview stream={previewStream} />
              )}
            </div>
          );
        }}
      />
    </Modal>
  );
};

export default VideoRecord;
