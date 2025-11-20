import "./style.css";
import LogoLoop from "../../../../components/logoLoop/LogoLoop";
import { useState } from "react";
import shooot from "/logo/shooot!.png";
import agijagi from "/logo/agijagi.png";
import rebu from "/logo/rebu.svg";
import high from "/logo/SolSolHigh_Logo.png";
import { ImageCarousel } from "../../../../components/ImageCarousel/ImageCarousel";
import shoootimg1 from "/projectImg/shooot!/shooot_serverTest.gif";
import shoootimg2 from "/projectImg/shooot!/shooot_upload.gif";
import shoootimg3 from "/projectImg/shooot!/shooot_build.gif";
import agijagiimg1 from "/projectImg/agijagi/agijagi_login.gif";
import agijagiimg2 from "/projectImg/agijagi/agijagi_overview.webp";
import agijagiimg3 from "/projectImg/agijagi/agijagi_record.gif";
import agijagiimg4 from "/projectImg/agijagi/agijagi_storybook.gif";
import solsolHighimg1 from "/projectImg/solsolHigh/solsolHigh_main1.png";
import solsolHighimg2 from "/projectImg/solsolHigh/solsolHigh_main2.png";
import solsolHighimg3 from "/projectImg/solsolHigh/solsolHigh_main3.png";
import rebuimg1 from "/projectImg/rebu/rebu_overview.png";
import rebuimg2 from "/projectImg/rebu/rebu_mode.png";

export const Page2 = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const logos = [
    { src: shooot, alt: "shooot logo", href: "https://github.com/Shooot-PJT/shooot" },
    { src: agijagi, alt: "agijagi logo", href: "https://github.com/altys31/agijagi" },
    { src: rebu, alt: "rebu logo", href: "https://github.com/RebuProject/Rebu" },
    { src: high, alt: "SolSolHigh logo", href: "https://github.com/SolSolHigh/SolSolHigh-FE" },
  ];

  const projectImages = [
    [shoootimg1, shoootimg2, shoootimg3],
    [agijagiimg1, agijagiimg2, agijagiimg3, agijagiimg4],
    [solsolHighimg1, solsolHighimg2, solsolHighimg3],
    [rebuimg1, rebuimg2],
  ];

  const projectOverviews = [
    "웹 개발자를 위한 API 개발 & 테스트 통합 솔루션 (Shooot!)",
    "육아일기 기반의 소셜 네트워크 플랫폼 (아기자기)",
    "아동금융습관 형성을 돕는 솔루션 플랫폼 (SolSolHigh)",
    "뷰티, 예약, 리뷰를 한번에! 뷰티 리뷰 플랫폼 (Rebu)",
  ];

  const projectRoles = [
    [
      "SSE 데이터를 Canvas 기반 그래픽 요소로 실시간 변환",
      "모달·팝업 애니메이션 및 상태 관리 로직을 Custom Hook으로 설계, 일관된 인터랙션 흐름을 구축",
      "SSE 기반 실시간 로그 스트리밍 UI 구현—데이터 이벤트 발생 시 자연스러운 “타이핑 애니메이션” 적용 등 micro-interaction에 집중",
      "콘솔 방식의 개발자 도구 UI를 구축하며 복잡한 실시간 데이터 처리와 UI 퍼포먼스 최적화 경험",
      "Storybook 기반의 컴포넌트 문서화를 통해 재사용 가능한 인터랙티브 UI 시스템을 구성",
    ],
    [
      "서비스 전반의 인터랙션 & 애니메이션 시스템을 직접 디자인하고 구현하여 감성 중심 사용자 경험 제공",
      "디바이스별 사용 맥락에 맞춘 Interaction-aware 반응형 레이아웃 구축",
      "AI 동화 생성 등 비동기 흐름을 테스트하기 위한 msw 기반 개발 환경 구축",
      "공통 컴포넌트의 동적 UX 패턴을 Storybook으로 문서화하여 UI 시스템화",
      "세션 기반 인증/인가 구현",
    ],
    [
      "금융 도메인의 안정성 패턴을 아동 친화적 인터랙션으로 재해석한 UI 설계",
      "제한된 시간 속에서도 “핵심 사용자 여정” 중심의 인터랙티브 MVP 빠른 구축",
      "AI 텍스트 생성 흐름에 유연하게 대응하는 비동기 UX 구조 개발",
      "아동 접근성을 고려한 직관적 퀴즈·약속권 UI 및 피드백 설계",
      "병렬 협업 속도를 높이기 위한 컴포넌트 구조화 및 Storybook 기반 UI 공유 ",
    ],
    [
      "팀 기술 리더로서 React/Git 스터디를 주도하며 팀 전체의 역량과 작업 속도를 향상",
      "Figma를 기반으로 서비스의 핵심 UX(리뷰 탐색·예약 흐름)를 설계하며 서비스 구조 디자인을 주도",
      "JWT 인증·인가, Axios Interceptor 기반 토큰 재발급 등 서비스 전반의 인증 아키텍처 구축",
      "GlobalTheme 기반 라이트/다크 모드와 반응형 UI 설계로 초기 디자인 시스템의 기반 마련",
      "REST API와 Redux 상태 관리를 통해 서비스 전반의 데이터 흐름을 구조적으로 구현",
    ],
  ];

  const setBackgroundClass = () => {
    switch (selectedIndex) {
      case 0:
        return "pageBackground";
      case 1:
        return "agijagiBackground";
      case 2:
        return "solsolhighBackground";
      case 3:
        return "rebuBackground";
    }
  };

  const colorList = ["#825cff", "#fec006", "#0046ff", "#943aee"];
  const fadeoutColorList = ["#654491", "#ffc04b", "#4072fc", "#b83bfc"];
  return (
    <div className={"second-page pageBackground"}>
      <LogoLoop
        logos={logos}
        speed={120}
        direction="left"
        logoHeight={32}
        gap={40}
        hoverSpeed={0}
        scaleOnHover
        fadeOut
        fadeOutColor={fadeoutColorList[selectedIndex]}
        style={{
          background: colorList[selectedIndex],
          transition: "background 0.75s ease",
        }}
        ariaLabel="Technology partners"
      />
      <div className="page-container">
        <div className="project-header">프로젝트 소개</div>
        <div className="project-container">
          <div className="project-info" style={{ backgroundColor: colorList[selectedIndex] }}>
            <div className="project-image">
              <ImageCarousel images={projectImages[selectedIndex]} />
            </div>
            <div className="project-details">
              <div className="project-overview">{projectOverviews[selectedIndex]}</div>
              <div className="project-role">담당역할</div>
              <div className="project-description">
                <ul className="description-item">
                  {projectRoles[selectedIndex].map((role, idx) => (
                    <li key={idx}>{role}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="projects-list">
            <div
              onClick={() => setSelectedIndex(0)}
              className={selectedIndex === 0 ? "selected" : "notSelected"}
            >
              <img src={shooot} width={48} />
              Shooot! (슛!)
              <button className="projectButton" disabled>
                종료된 프로젝트
              </button>
            </div>
            <div
              onClick={() => setSelectedIndex(1)}
              className={"agijagiFont " + (selectedIndex === 1 ? "selected" : "notSelected")}
            >
              <img src="/logo/agijagi.png" width={48} />
              아기자기
              <button
                className="projectButton agijagiFont"
                onClick={(e) => {
                  window.open("https://agijagi.vercel.app/login", "_blank");
                  e.stopPropagation();
                }}
              >
                사이트 링크 (모킹 서버)
              </button>
            </div>

            <div
              onClick={() => setSelectedIndex(2)}
              className={selectedIndex === 2 ? "selected" : "notSelected"}
            >
              <img src={high} width={48} />
              SolSolHigh
              <button className="projectButton" disabled>
                종료된 프로젝트
              </button>
            </div>
            <div
              onClick={() => setSelectedIndex(3)}
              className={"rebuFont " + (selectedIndex === 3 ? "selected" : "notSelected")}
            >
              <img src={rebu} width={48} />
              Rebu
              <button className="projectButton" disabled>
                종료된 프로젝트
              </button>
            </div>
          </div>
        </div>
      </div>
      <LogoLoop
        logos={logos}
        speed={120}
        direction="right"
        logoHeight={32}
        gap={40}
        hoverSpeed={0}
        scaleOnHover
        fadeOut
        fadeOutColor={fadeoutColorList[selectedIndex]}
        ariaLabel="Technology partners"
        style={{
          background: colorList[selectedIndex],
          transition: "background 0.75s ease",
        }}
      />
    </div>
  );
};
