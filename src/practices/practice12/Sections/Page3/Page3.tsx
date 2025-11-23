import { Chip } from "./Chip";
import "./style.css";
import Thumbnail1 from "/projectImg/scroll_thumbnail.webp";
import Thumbnail2 from "/projectImg/project2_thumbnail.png";
import Thumbnail3 from "/projectImg/project3_thumbnail.png";

export const Page3 = () => {
  return (
    <div className={"third-page page3-background"}>
      <div className="page3-container">
        <div className="page3-header">토이 프로젝트 </div>
        <div className="page3-items">
          <div className="page3-item">
            <div className="page3-thumbnail">
              <img
                src={Thumbnail1}
                onClick={() => window.open("https://scrollmotion-ykh.vercel.app/")}
                width={128}
                style={{ justifySelf: "center", cursor: "pointer" }}
              />
            </div>
            <div className="page3-description">
              영상없이 SVG의 노이즈를 이용한 물결표현, GSAP의 scrolltrigger을 이용한 스크롤
              애니메이션, Adobe Photoshop의 생성형 채우기를 이용한 배경이미지 제작
            </div>
            <div className="chips">
              <Chip label="#GSAP" color="#fde405" />
              <Chip label="#SVG" color="#f0f0f0" />
            </div>
            <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
              <button
                className="linkButton"
                onClick={() => window.open("https://scrollmotion-ykh.vercel.app/")}
              >
                링크
              </button>
            </div>
          </div>
          {/**/}
          <div className="page3-item">
            <div className="page3-thumbnail">
              <img
                src={Thumbnail2}
                onClick={() => window.open("https://ykh-portfolio.vercel.app/project/3")}
                width={128}
                style={{ justifySelf: "center", cursor: "pointer" }}
              />
            </div>
            <div className="page3-description">
              IR 리버브를 이용해 거리에 따른 사운드의 잔향감, 감쇠 표현, THREE.js의 Light를 활용한
              조명 효과와 ReflectorMaterial 실험
            </div>
            <div className="chips">
              <Chip label="#THREE.js" color="#a8e6ff" />
              <Chip label="#IR" color="#f0f0f0" />
            </div>
            <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
              <button
                className="linkButton"
                onClick={() => window.open("https://ykh-portfolio.vercel.app/project/3")}
              >
                링크
              </button>
            </div>
          </div>
          <div className="page3-item">
            <div className="page3-thumbnail">
              <img
                src={Thumbnail3}
                onClick={() => window.open("https://ykh-portfolio.vercel.app/project/2")}
                width={128}
                style={{ justifySelf: "center", cursor: "pointer" }}
              />
            </div>
            <div className="page3-description">
              THREE.js 요소를 이용한 여러 날씨 환경 구현, GLSL 쉐이더를 이용한 구름과 빛 효과
            </div>
            <div className="chips">
              <Chip label="#THREE.js" color="#a8e6ff" />
              <Chip label="#GLSL" color="#a0a0a0" />
            </div>
            <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
              <button
                className="linkButton"
                onClick={() => window.open("https://ykh-portfolio.vercel.app/project/3")}
              >
                링크
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
