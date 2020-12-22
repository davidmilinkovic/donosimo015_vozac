import React from "react";
import ReactDOM from "react-dom";

import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/paper-dashboard.scss?v=1.2.0";
import "assets/demo/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";

import Glavni from "views/Glavni";
import Povezivanje from "views/Povezivanje";
import myFetch from "myFetch";
import { Button } from "reactstrap";

var component = null;

myFetch("/vozacApi/verifikujToken", "POST", {
  token: localStorage.getItem("token"),
}, false).then((res) => {
  
  if (res.status == "ok") {
    component = (
      <Glavni/>
    );
  } else {
    localStorage.removeItem("token");
    component = <Povezivanje />;
  }
})
.catch(() => {
  component = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <h3 style={{ marginBottom: 10 }}>Server nedostupan</h3>
      <Button color="info" onClick={() => {
        window.location.reload();
      }}>
        <i className="fas fa-undo mr-1" /> Pokušaj ponovo
      </Button>
    </div>
  );
})
.finally(() => {
  ReactDOM.render(component, document.getElementById("root"));
})