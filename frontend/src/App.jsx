import { Routes, Route } from "react-router-dom";
import { HomePage, ChatPage } from "./pages";
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </div>
  );
};

export default App;
