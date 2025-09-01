import type { JSX } from "react";
import "./SideBar.css";

interface SideBarProps {
  visible: boolean;
  selected: number;
  handleSelected: (num: number) => void;
  contentList: JSX.Element[];
}

export const SideBar = ({ visible, selected, handleSelected, contentList }: SideBarProps) => {
  return (
    <aside className={`sideBar ${visible ? `unfold` : `fold`}`}>
      {contentList.map((a, i) => {
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
    </aside>
  );
};
