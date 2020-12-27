import React, { useEffect } from "react";
import "./Popup.scss";
import Link from "./components/Link";
import Header from "./components/Header";

export default function Popup() {
  useEffect(() => {
    // Example of how to send a message to eventPage.ts.
    chrome.runtime.sendMessage({ popupMounted: true });
  }, []);


  return(
      <div className="popupContainer">
          <Header/>
          <Link/>
      </div>
  );
}
