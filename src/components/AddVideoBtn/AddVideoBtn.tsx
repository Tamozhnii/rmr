import React from "react";
import style from "./AddVideoBtn.module.css";
import { PlusOutlined } from "@ant-design/icons";

interface IAddVideoBtn {
  handleClick: () => void;
}
const AddVideoBtn: React.FC<IAddVideoBtn> = ({
  handleClick,
}): React.ReactElement => {
  return (
    <>
      <div className={style.videoBtn} onClick={handleClick}>
        <PlusOutlined className={style.img} />
        <p className={style.title}>Добавить видео-ответ</p>
      </div>
    </>
  );
};

export default AddVideoBtn;
