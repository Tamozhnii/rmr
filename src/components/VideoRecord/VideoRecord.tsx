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
const getStatus = (status: string): string => {
  switch (status) {
    case "stopped":
      return "Запиcь окончена";
      break;
    case "recording":
      return "Запись";
      break;
    case "acquiring_media":
      return "Подключение камеры";
      break;
    case "idle":
      return "Режим ожидания";
      break;
    default:
      return "...";
      break;
  }
};
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
  const [stat, setStat] = React.useState<string>("acquiring_media");
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
        mediaRecorderOptions={{ status: stat }}
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
          setStat(status);
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
              <p>{getStatus(status)}</p>
              <button onClick={startRecording}>Start Recording</button>
              <button onClick={stopRecording}>Stop Recording</button>
              <button
                onClick={() => {
                  pauseRecording();
                  setStat("stopping");
                }}
              >
                Pause Recording
              </button>
              <button
                onClick={() => {
                  resumeRecording();
                  setStat("recording");
                }}
              >
                Resume Recording
              </button>
              <button
                onClick={() => {
                  clearBlobUrl();
                  mediaBlobUrl = null;
                  setVideo(undefined);
                  setStat("idle");
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
