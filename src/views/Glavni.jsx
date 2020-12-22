import React, { Component } from "react";
import {
  Navbar,
  NavbarBrand,
  Nav,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Button,
} from "reactstrap";
import Porudzbina from "components/Porudzbina";
import myFetch from "myFetch";
import RingLoader from "react-spinners/RingLoader";
import ModalNovaPorudzbinaSaCentrale from "components/ModalNovaPorudzbinaSaCentrale";
import ModalUpit from "components/ModalUpit";

var refModalNova = React.createRef();
var refModalUpit = React.createRef();

export default class Glavni extends Component {
  state = {
    dropdownOpen: false,
    porudzbinaModal: null,
    porudzbine: [],
    prikazano: {},
    aktivan: false,
  };

  componentDidMount() {
    myFetch("/vozacApi/proveraAktivnosti").then((res) => {
      this.promenaAktivnost(res.aktivan);
    });
  }

  dropdownToggle = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  componentWillUnmount() {
    this.ocistiIntervale();
  }

  ocistiIntervale() {
    clearInterval(this.intervalPorudzbineCekanje);
    clearInterval(this.intervalPorudzbine);
    clearInterval(this.intervalPreostalo);
    clearInterval(this.intervalUpiti);
  }

  dajPorudzbineNaCekanju = () => {
    myFetch("/vozacApi/porudzbineNaCekanju").then((res) => {
      var naCekanju = res.result;
      if (naCekanju.length > 0) {
        if(this.state.porudzbinaModal == null || naCekanju[0].id != this.state.porudzbinaModal.id) {
          this.setState({ porudzbinaModal: naCekanju[0] });        
          refModalNova.current.otvori();
        }        
      } else this.setState({ porudzbinaModal: null });
    });
    this.intervalPorudzbineCekanje = setTimeout(
      this.dajPorudzbineNaCekanju,
      1000
    );
  };

  dajUpite = () => {
    myFetch("/vozacApi/upiti").then((res) => {
      var upiti = res.result;
      if (upiti.length > 0) {
        if(this.state.prikazaniUpit == null || upiti[0].id != this.state.prikazaniUpit.id) {
          this.setState({ prikazaniUpit: upiti[0] });        
          refModalUpit.current.otvori();
        }        
      } else this.setState({ prikazaniUpit: null });
    });
    this.intervalUpiti = setTimeout(
      this.dajUpite,
      1000
    );
  };

  dajPorudzbine = () => {
    myFetch("/vozacApi/aktivnePorudzbine").then((res) => {
      var porudzbine = res.result;
      porudzbine.forEach((p) => {
        if (this.state["preostalo_" + p.id] == null) {
          var obj = {};

          var sistemsko = new Date(res.result[0].sistemskoVreme);
          var razlika = sistemsko - new Date();
          var ocekivano = new Date(p.ocekivanoVremePreuzimanja);
          ocekivano.setMilliseconds(ocekivano.getMilliseconds() - razlika);
          var preostalo = Math.floor((ocekivano - new Date()) / 1000);

          obj["ocekivano_" + p.id] = ocekivano;
          obj["preostalo_" + p.id] = preostalo;

          this.setState(obj);
        }
      });
      this.setState({ porudzbine: res.result });
    });
    this.intervalPorudzbine = setTimeout(this.dajPorudzbine, 1000);
  };

  updatePreostalo = () => {
    var obj = {};
    for (var i = 0; i < this.state.porudzbine.length; i++) {
      var p = this.state.porudzbine[i];
      if (this.state["ocekivano_" + p.id] != null) {
        var ocekivano = this.state["ocekivano_" + p.id];
        var razlika = Math.round((ocekivano - new Date()) / 1000);
        obj["preostalo_" + p.id] = razlika;
      }
    }
    this.setState(obj);
    this.intervalPreostalo = setTimeout(this.updatePreostalo, 1000);
  };

  krajRada = () => {
    myFetch("/vozacApi/krajRada", "POST", {}).then(() => {
      this.promenaAktivnost(false);
    });
  };

  pocetakRada = () => {
    myFetch("/vozacApi/pocetakRada", "POST", {}).then(() => {
      this.promenaAktivnost(true);
    });
  };

  promenaAktivnost(aktivan) {
    this.setState({ aktivan });
    this.ocistiIntervale();
    if (aktivan) {
      this.dajPorudzbine();
      this.dajPorudzbineNaCekanju();
      this.updatePreostalo();
      this.dajUpite();
    }

    if (window.JSInterface != null) {
      if (aktivan) window.JSInterface.pocetakRada();
      else window.JSInterface.krajRada();
    }
  }

  render() {
    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Navbar
          color="primary"
          sticky={true}
          onClick={this.krajRada}
          style={{
            margin: 0,
            minHeight: "unset",
            flexWrap: "unset",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/*<NavbarBrand>
            Donosimo015 { - Vozač <b>{localStorage.getItem("ime")}</b> }
          </NavbarBrand>*/}
          <p
            align="center"
            style={{
              fontSize: 18,
              fontWeight:"bold",
              marginTop: 0,
              marginBottom: 0,
              color: "white",
            }}
          >
            Donosimo 015
          </p>
          <p
            align="center"
            style={{
              fontSize: 15,
              marginTop: 0,
              marginBottom: 0,
              color: "white",
            }}
          >
            Vozač: <b>{localStorage.getItem("ime")}</b>
          </p>
          <p
            align="center"
            hidden={!this.state.aktivan}
            style={{
              fontSize: 15,
              marginTop: 0,
              marginBottom: 0,
              color: "white",
            }}
          >
            <b>{this.state.porudzbine.length}</b> aktivnih porudžbina
          </p>          
        </Navbar>
        <div id="mainDiv">
          {this.state.porudzbinaModal != null ? (
            <ModalNovaPorudzbinaSaCentrale
              obj={this.state.porudzbinaModal}
              ref={refModalNova}
            />
          ) : (
            ""
          )}
          {this.state.prikazaniUpit != null ? (
            <ModalUpit
              upit={this.state.prikazaniUpit}
              ref={refModalUpit}
            />
          ) : (
            ""
          )}

          <div id="porudzbine">
            {this.state.aktivan ? (
              this.state.porudzbine.length === 0 ? (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    verticalAlign: "center",
                    //backgroundColor: "red",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <RingLoader
                    //css={override}
                    size={150}
                    color="#51bcda"
                    loading={this.state.loading}
                  />
                  <h4 style={{fontSize: 20}} align="center">Nema aktivnih porudžbina</h4>
                </div>
              ) : (
                this.state.porudzbine.map((porudzbina) => (
                  <Porudzbina
                    obj={porudzbina}
                    preostalo={this.state["preostalo_" + porudzbina.id]}
                    vozaci={[]}
                  />
                ))
              )
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  verticalAlign: "center",
                  //backgroundColor: "red",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <Button size="lg" color="success" onClick={this.pocetakRada}>
                  <i className="fas fa-wifi mr-2" />
                  Početak rada
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
