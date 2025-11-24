import { useState } from "react";
import { Practice1 } from "../practices/practice1/practice1";
import Practice2 from "../practices/practice2/practice2";
import { Practice4 } from "../practices/practice4/practice4";
import { Practice3 } from "../practices/practice3/practice3";
import { Practice5 } from "../practices/practice5/practice5";
import { Practice6 } from "../practices/practice6/practice6";
import { Practice7 } from "../practices/practice7/practice7";
import { Practice8 } from "../practices/practice8/practice8";
import { Practice9 } from "../practices/practice9/Practice9";
import { Practice10 } from "../practices/practice10/Practice10";
import { Practice11 } from "../practices/practice11/practice11";
import { Practice12 } from "../practices/practice12/practice12";
import { Practice13 } from "../practices/practice13/practice13";
import { GiHamburgerMenu } from "react-icons/gi";
import { SideBar } from "../common/SideBar";
import "./style.css";
import { Practice14 } from "../practices/practice14/Practice14";

export default function Projects({
  selectedProject,
  testMode = false,
}: {
  selectedProject?: number;
  testMode?: boolean;
}) {
  const [visible, setVisible] = useState<boolean>(false);
  const [selected, setSelected] = useState<number>(selectedProject ? selectedProject : -1);
  const [isDebug, setIsDebug] = useState<boolean>(false);

  const contentList = [
    <Practice1 />,
    <Practice2 />,
    <Practice3 />,
    <Practice4 />,
    <Practice5 />,
    <Practice6 />,
    <Practice7 />,
    <Practice8 />,
    <Practice9 />,
    <Practice10 isDebug={isDebug} />,
    <Practice11 isDebug={isDebug} />,
    <Practice12 isDebug={isDebug} />,
    <Practice13 />,
    <Practice14 />,
  ];

  const handleSelected = (num: number) => {
    setSelected(num);
  };

  const SelectedContent = (num: number) => {
    if (num === -1) {
      return <></>;
    }
    return contentList[num];
  };

  const setDebugMode = () => {
    setIsDebug(!isDebug);
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
      {testMode && (
        <>
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
          <SideBar
            visible={visible}
            selected={selected}
            handleSelected={handleSelected}
            setDebugMode={setDebugMode}
            isDebug={isDebug}
            contentList={contentList}
            setVisible={setVisible}
          />
        </>
      )}

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
