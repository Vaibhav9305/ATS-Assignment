import Home from "./components/Home"
import Invalid from "./components/Invalid";
import Login from "./components/Login"

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Invalid />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
