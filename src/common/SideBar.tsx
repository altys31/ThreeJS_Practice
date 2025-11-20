import type { JSX } from "react";
import "./SideBar.css";

interface SideBarProps {
  visible: boolean;
  selected: number;
  handleSelected: (num: number) => void;
  contentList: JSX.Element[];
  isDebug?: boolean;
  setDebugMode?: () => void;
  setVisible: (visible: boolean) => void;
}

export const SideBar = ({
  visible,
  selected,
  handleSelected,
  contentList,
  isDebug,
  setDebugMode,
}: SideBarProps) => {
  return (
    <>
      <aside className={`sideBar ${visible ? `unfold` : `fold`}`}>
        {contentList.map((_, i) => {
          return (
            <div
              key={i}
              className={`content ${selected === i && `selected`} `}
              onClick={() => handleSelected(i)}
            >
              {i === 4 ? "Practice " + (i + 1) + " 🔊" : "Practice " + (i + 1)}
            </div>
          );
        })}
        <button onClick={setDebugMode}>Debug: {isDebug ? "On" : "Off"}</button>
      </aside>
    </>
  );
};
