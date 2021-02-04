import React from "react";
import { Content } from "antd/lib/layout/layout";
import AddVideoBtn from "../../components/AddVideoBtn/AddVideoBtn";
import style from "./canvas.module.css";
import VideoRecord from "../../components/VideoRecord/VideoRecord";

const Canvas: React.FC = (): React.ReactElement => {
  const [modal, setModal] = React.useState(false);
  const handleClick = React.useCallback(() => setModal(true), []);
  const handleOk = () => setModal(false);
  const handleCancel = () => setModal(false);
  return (
    <Content className={style.canvas}>
      <AddVideoBtn handleClick={handleClick} />
      <VideoRecord onOk={handleOk} onCancel={handleCancel} visible={modal} />
    </Content>
  );
};

export default Canvas;
