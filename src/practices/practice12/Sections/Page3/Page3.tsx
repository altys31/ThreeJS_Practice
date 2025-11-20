import "./style.css";
import Thumbnail1 from "/projectImg/scroll_thumbnail.webp";

export const Page3 = () => {
  return (
    <div className={"third-page pageBackground"}>
      <div className="page-container">
        <div className="page-header">토이 프로젝트 (작성중)</div>
        <div className="project-items">
          <div className="project-item">
            <img src={Thumbnail1} width={128} style={{ justifySelf: "center" }} />
            <div className="project-title">
              영상없이 SVG의 노이즈를 이용한 물결표현, GSAP의 scrolltrigger을 이용한 스크롤
              애니메이션, Adobe Photoshop의 생성형 채우기를 이용한 배경이미지 제작
            </div>
            <button onClick={() => window.open("https://scrollmotion-ykh.vercel.app/")}>
              링크
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
