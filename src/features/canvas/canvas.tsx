import React from "react";
import { Content } from "antd/lib/layout/layout";
import AddVideoBtn from "../../components/AddVideoBtn/AddVideoBtn";
import style from "./canvas.module.css";
import VideoRecord from "../../components/VideoRecord/VideoRecord";

const Canvas: React.FC = (): React.ReactElement => {
  const [modal, setModal] = React.useState(false);
  const [url, setUrl] = React.useState<string | undefined>(undefined);
  const handleSetVideo = (value: string | undefined) => setUrl(value);
  const handleClick = React.useCallback(() => setModal(true), []);
  const handleCancel = () => setModal(false);

  return (
    <Content className={style.canvas}>
      <AddVideoBtn handleClick={handleClick} />
      <VideoRecord
        onCancel={handleCancel}
        visible={modal}
        setVideo={handleSetVideo}
        videoUrl={url}
      />
    </Content>
  );
};

export default Canvas;
