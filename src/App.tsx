import { useState } from "react";
import { SideBar } from "./common/SideBar";
import { Practice1 } from "./practices/practice1/practice1";
import "./App.css";
import { GiHamburgerMenu } from "react-icons/gi";
import Practice2 from "./practices/practice2/practice2";
import { Practice4 } from "./practices/practice4/practice4";
import { Practice3 } from "./practices/practice3/practice3";
import { Practice5 } from "./practices/practice5/practice5";
import { Practice6 } from "./practices/practice6/practice6";
import { Practice7 } from "./practices/practice7/practice7";

export default function App() {
  const [visible, setVisible] = useState<boolean>(true);
  const [selected, setSelected] = useState<number>(0);

  const contentList = [
    <div />,
    <Practice1 />,
    <Practice2 />,
    <Practice3 />,
    <Practice4 />,
    <Practice5 />,
    <Practice6 />,
    <Practice7 />,
  ];

  const handleSelected = (num: number) => {
    setSelected(num);
  };

  const SelectedContent = (num: number) => {
    return contentList[num];
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <SideBar
        visible={visible}
        selected={selected}
        handleSelected={handleSelected}
        contentList={contentList}
      />
      <button
        style={{ zIndex: "9999" }}
        className={`sidebarButton`}
        onClick={(e) => {
          e.stopPropagation();
          setVisible(!visible);
        }}
      >
        <GiHamburgerMenu size={24} />
      </button>
      <div
        style={{
          position: "absolute",
          top: `calc(100% - 4rem)`,
          left: `calc(100% - 10rem)`,
          opacity: "75%",
          textAlign: "center",
          userSelect: "none",
          fontSize: "14px",
          zIndex: "9999",
        }}
      >
        Designed & Created <br />
        by KyuHyeon Yang
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        {SelectedContent(selected)}
      </div>
    </div>
  );
}
