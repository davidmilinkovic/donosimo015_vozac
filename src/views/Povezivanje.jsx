import React, { Component } from "react";
import { Input, Button, Form } from "reactstrap";
import myFetch from "myFetch";

export default class Povezivanje extends Component {
  state = {
    progress: false,
  };

  potvrdi = (e) => {
    e.preventDefault();
    this.setState({ progress: true });
    myFetch("/vozacApi/proveriKod", "POST", {
      kod: document.getElementById("kod").value,
    }).then((res) => {
      if (res.status === "ok") {
        localStorage.setItem("token", res.token);
        localStorage.setItem("id", res.id);
        localStorage.setItem("ime", res.ime);
        window.location.reload(true);
      } else {
        alert(res.message);
        this.setState({ progress: false });
        document.getElementById("kod").value = "";
      }
    });
  };
 
  render() {
    return (
      <div id="divPovezivanje">
        <div className="container">
          <div id="info">
            <img alt="" id="logo" src={require("assets/img/ic_vozac.png")} />
            <p id="naslov">Donosimo 015</p>
            <p id="podnaslov">Aplikacija za Vozače</p>
          </div>
          <div id="unosKoda">
            <p id="description">Unesite verifikacioni kod dodeljen vozaču</p>
            <Form id="form">
              <Input
                type="number"
                id="kod"
                placeholder="Verifikacioni kod..."
              ></Input>
              <Button
                disable={this.state.progress}
                color="primary"
                id="potvrdi"
                type="submit"
                onClick={this.potvrdi}
              >
                <i className="fas fa-check mr-1" />
                Potvrdi
              </Button>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}
