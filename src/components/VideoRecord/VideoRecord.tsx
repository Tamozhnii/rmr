import React from "react";
import { PropertySafetyFilled, UploadOutlined } from "@ant-design/icons";
import { Button, Upload } from "antd";
import Modal from "antd/lib/modal/Modal";
import { RcFile } from "antd/lib/upload";
import { ReactMediaRecorder, StatusMessages } from "react-media-recorder";
import styles from "./VideoRecord.module.css";

const getStatus = (status: string): string => {
  switch (status) {
    case "stopped":
      return "Запиcь окончена";
    case "stopping":
      return "Пауза";
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

interface IStream {
  stream: MediaStream | null;
}

const VideoPreview: React.FC<IStream> = ({ stream }) => {
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
    <>
      {stream && (
        <video
          ref={videoRef}
          height={300}
          width={600}
          autoPlay
          className={styles.video}
        />
      )}
    </>
  );
};

const VideoRecord: React.FC<IVideoRecord> = ({
  onCancel,
  visible,
  videoUrl,
  setVideo,
}): React.ReactElement => {
  const [stat, setStat] = React.useState<StatusMessages>("idle");
  const [uploading, setUploading] = React.useState(false);
  const [fileList, setFileList] = React.useState<Array<RcFile>>([]);
  const onRemove = () => setFileList([]);
  const beforeUpload = (file: RcFile): boolean => {
    setFileList([file]);
    return true;
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
      {visible && (
        <ReactMediaRecorder
          video={visible}
          onStop={(blobUrl: string, blob: Blob) => {
            const date = new Date();
            setFileList([
              {
                uid: `${blobUrl}_${date.getTime()}`,
                webkitRelativePath: blobUrl,
                lastModifiedDate: date,
                lastModified: date.getTime(),
                name: `file_${date.getFullYear()}_${date.getMonth()}_${
                  date.getDate() + 1
                }_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}.mp4`,
                ...blob,
              },
            ]);
            setVideo(blobUrl);
          }}
          mediaRecorderOptions={{ status: stat }}
          render={({
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
                <p>{stat && getStatus(stat)}</p>
                <button
                  onClick={() => {
                    clearBlobUrl();
                    mediaBlobUrl = null;
                    setVideo(undefined);
                    onRemove();
                    startRecording();
                    setStat("recording");
                  }}
                >
                  Start Recording
                </button>
                <button
                  onClick={() => {
                    stopRecording();
                    setStat("stopped");
                  }}
                >
                  Stop Recording
                </button>
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
                    onRemove();
                    setStat("idle");
                  }}
                >
                  Clear Recording
                </button>
                <Upload
                  fileList={fileList}
                  onRemove={() => {
                    onRemove();
                    clearBlobUrl();
                    mediaBlobUrl = null;
                    setVideo(undefined);
                    setStat("idle");
                  }}
                  beforeUpload={(file: RcFile, _: RcFile[]) => {
                    onRemove();
                    clearBlobUrl();
                    mediaBlobUrl = null;
                    setVideo(undefined);
                    return beforeUpload(file);
                  }}
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
                  {uploading ? "Загрузка" : "Начать загрузку"}
                </Button>
              </div>
            );
          }}
        />
      )}
    </Modal>
  );
};

export default VideoRecord;
