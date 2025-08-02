import React, { useState } from "react";
import "./App.css";
import PathGuider from "./PathGuider";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const renderPage = () => {
    return <PathGuider />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main>{renderPage()}</main>
    </div>
  );
}

export default App;
