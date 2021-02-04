import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload } from "antd";
import Modal from "antd/lib/modal/Modal";
import { RcFile } from "antd/lib/upload";
import React from "react";
import { ReactMediaRecorder } from "react-media-recorder";
import styles from "./VideoRecord.module.css";

const getStatus = (status: string): string => {
  switch (status) {
    case "stopped":
      return "Запиcь окончена";
    case "recording":
      return "Запись";
    case "acquiring_media":
      return "Подключение камеры";
    case "idle":
      return "Режим ожидания";
    default:
      return "...";
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
  const [uploading, setUploading] = React.useState(false);
  const [fileList, setFileList] = React.useState<Array<RcFile>>([]);
  const onRemove = () => setFileList([]);
  const beforeUpload = (file: RcFile): boolean => {
    setFileList([file]);
    return false;
  };

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
          setFileList([
            {
              uid: blobUrl,
              webkitRelativePath: blobUrl,
              lastModifiedDate: new Date(),
              lastModified: 1,
              name: "file",
              ...blob,
            },
          ]);
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
                  status = "stopping";
                  setStat(status);
                }}
              >
                Pause Recording
              </button>
              <button
                onClick={() => {
                  resumeRecording();
                  status = "recording";
                  setStat(status);
                }}
              >
                Resume Recording
              </button>
              <button
                onClick={() => {
                  clearBlobUrl();
                  mediaBlobUrl = null;
                  setVideo(undefined);
                  status = "idle";
                  setStat(status);
                }}
              >
                Clear Recording
              </button>
              <Upload
                fileList={fileList}
                onRemove={onRemove}
                beforeUpload={beforeUpload}
              >
                <Button icon={<UploadOutlined />}>Select File</Button>
              </Upload>
              <Button
                type="primary"
                onClick={() => setUploading(true)} // Сервис для отправки
                disabled={fileList.length === 0}
                loading={uploading}
                style={{ marginTop: 16 }}
              >
                {uploading ? "Загружено" : "Начать загрузку"}
              </Button>
            </div>
          );
        }}
      />
    </Modal>
  );
};

export default VideoRecord;
