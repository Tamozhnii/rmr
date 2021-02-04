import Modal from "antd/lib/modal/Modal";
import React from "react";
import { ReactMediaRecorder } from "react-media-recorder";
import styles from "./VideoRecord.module.css";

enum EStatus {
  "stopped" = "запсиь окончена",
  "recording" = "запись",
  "acquiring_media" = "подключение камеры",
  "idle" = "режим ожидания",
}
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
  return (
    <video
      ref={videoRef}
      height={300}
      width={600}
      autoPlay
      className={styles.video}
    />
  );
};

const VideoRecord: React.FC<IVideoRecord> = ({
  onCancel,
  visible,
  videoUrl,
  setVideo,
}): React.ReactElement => {
  return (
    <Modal
      title={"Запись видео-ответа"}
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
                <video
                  src={videoUrl}
                  controls
                  height={300}
                  width={600}
                  className={styles.video}
                />
              ) : (
                <VideoPreview stream={previewStream} />
              )}
              <p>{status}</p>
              <button onClick={startRecording}>Start Recording</button>
              <button onClick={stopRecording}>Stop Recording</button>
              <button
                onClick={() => {
                  pauseRecording();
                  status = "stopping";
                }}
              >
                Pause Recording
              </button>
              <button
                onClick={() => {
                  resumeRecording();
                  status = "recording";
                }}
              >
                Resume Recording
              </button>
              <button
                onClick={() => {
                  status = "idle";
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
