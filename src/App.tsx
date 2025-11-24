import { BrowserRouter, Route, Routes } from "react-router";
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
      <Route path="/" element={<Projects selectedProject={11} />} />
      <Route path="/test" element={<Projects testMode={true} />} />
      <Route path="/project/1" element={<Projects selectedProject={5} />} />
      <Route path="/project/2" element={<Projects selectedProject={4} />} />
      <Route path="/project/3" element={<Projects selectedProject={6} />} />
    </Routes>
  );
};
