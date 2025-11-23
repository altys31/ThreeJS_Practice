import { BrowserRouter, Route, Routes } from "react-router";
import { Practice12 } from "./practices/practice12/practice12";
import Projects from "./Page/Proejcts";

export default function App() {
  //라우팅
  return (
    <>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </>
  );
}

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Practice12 isDebug={false} />} />
      <Route path="/project/1" element={<Projects selectedProject={5} />} />
      <Route path="/project/2" element={<Projects selectedProject={6} />} />
      <Route path="/project/3" element={<Projects selectedProject={4} />} />
    </Routes>
  );
};
