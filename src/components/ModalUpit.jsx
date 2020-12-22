import React, { Component } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Col,
  Row,
  Input,
  FormGroup,
  Label,
} from "reactstrap";
import myFetch from "myFetch";
import { isNumeric } from "jquery";
import Moment from "react-moment";
var Sound = require("react-sound").default;

export default class ModalUpit extends Component {
  state = {
    progress: false,
    isOpen: false,
    vremeDoPartnera: null,
    vremeDostave: null,
  };

  componentDidMount() {
    this.setState({ isOpen: true });
  }

  otvori = () => {
    this.setState({ vremeDoPartnera: null, vremeDostave: null });
    this.setState({ isOpen: true, progress: false });
  };

  ucitava = () => {
    this.setState({ isOpen: false });
  };

  licitiraj = () => {
    this.ucitava();
    myFetch("/vozacApi/licitiraj", "POST", {
      id: this.props.upit.id,
      vremeDoPartnera: this.state.vremeDoPartnera,
      vremeDostave: this.state.vremeDostave,
    });
  };

  odbij = () => {
    this.ucitava();
    myFetch("/vozacApi/odbijLicitaciju", "POST", {
      id: this.props.upit.id,
    });
  };

  render() {
    var { upit } = this.props;
    var obj = upit.AktivnaPorudzbina;
    var vremena = [10, 15, 20, 25, 30, 45];
    return (
      <>
        <Sound
          url={require("assets/sounds/alarm.mp3")}
          //playStatus={Sound.status.PLAYING}
        />

        <Modal isOpen={this.state.isOpen} className="dmModalUpit">
          <ModalHeader>
            <i className="fas fa-phone mr-1 text-info align-middle" />
            Licitacija - porudžbina #{obj.id}
          </ModalHeader>
          <ModalBody>
            <div id="body">
              <div id="info">
                <div className="divOkvir mb-2">
                  {obj.zakazanaZa != null && (
                    <p>
                      <i className="fas fa-clock fa-fw mr-1" />
                      Zakazana za:{" "}
                      <b>
                        <Moment format="hh:mm">{obj.zakazanaZa}</Moment>
                      </b>
                    </p>
                  )}
                  <p>
                    <i className="fas fa-store fa-fw mr-1" />
                    Partner: <b>{obj.partnerString}</b>
                  </p>
                  {obj.ime !== null && obj.ime.length !== 0 ? (
                    <p>
                      <i className="fas fa-user fa-fw mr-1" />
                      Ime: <b>{obj.ime}</b>
                    </p>
                  ) : (
                    ""
                  )}
                  {obj.adresa !== null && obj.adresa.length !== 0 ? (
                    <p>
                      <i className="fas fa-address-book fa-fw mr-1" />
                      Adresa:{" "}
                      <b>
                        {obj.adresa}, {obj.Mesto.naziv}
                      </b>
                    </p>
                  ) : (
                    ""
                  )}

                  {obj.telefon !== null && obj.telefon.length !== 0 ? (
                    <p>
                      <i className="fas fa-phone fa-fw mr-1" />
                      Telefon: <b>{obj.telefon}</b>
                    </p>
                  ) : (
                    ""
                  )}
                  {obj.napomena != null ? (
                    <p>
                      Napomena:
                      <b> {obj.napomena}</b>
                    </p>
                  ) : (
                    ""
                  )}
                  <hr />
                  <p>Porudžbinu mogu preuzeti za: </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      columnGap: 5,
                    }}
                  >
                    {vremena.map((t) => (
                      <Button
                        className="mt-1 mb-1"
                        onClick={() => this.setState({ vremeDoPartnera: t })}
                        color={
                          this.state.vremeDoPartnera == t
                            ? "primary"
                            : "secondary"
                        }
                      >
                        {t} min.
                      </Button>
                    ))}
                  </div>
                  <hr />
                  <p>Od momenta preuzimanja, porudžbinu mogu dostaviti za: </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      columnGap: 5,
                    }}
                  >
                    {vremena.map((t) => (
                      <Button
                        className="mt-1 mb-1"
                        onClick={() => this.setState({ vremeDostave: t })}
                        color={
                          this.state.vremeDostave == t ? "info" : "secondary"
                        }
                      >
                        {t} min.
                      </Button>
                    ))}
                  </div>
                  <hr />

                  {obj.stavke != null ? (
                    <>
                      <h5
                        style={{
                          fontWeight: "bold",
                          fontSize: 16,
                          marginBottom: 5,
                        }}
                        align="center"
                      >
                        <i className="fas fa-list mr-2 text-info" />
                        Stavke porudžbine
                      </h5>
                      <ol>
                        {obj.stavke.map((stavka) => (
                          <li>
                            <span>
                              <b>
                                {stavka.kolicina} x {stavka.naziv}
                              </b>{" "}
                              {stavka.opis != null && stavka.opis.length > 0
                                ? " - " + stavka.opis.replace("\n", "; ") + " "
                                : " "}
                              <i>({stavka.kolicina * stavka.cena} din.)</i>
                            </span>
                          </li>
                        ))}
                      </ol>
                    </>
                  ) : (
                    ""
                  )}

                  {obj.opis != null && obj.opis.length > 0 ? (
                    <p>
                      <i className="fas fa-list fa-fw mr-1" />
                      Opis:
                      <br />
                      <ul className="bold">
                        {obj.opis.split("\n").map((stavka) => (
                          <li>{stavka}</li>
                        ))}
                      </ul>
                    </p>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              onClick={this.odbij}
              disabled={this.state.progress}
            >
              <i className="fas fa-times mr-1" /> Odbij
            </Button>
            <Button
              color="success"
              onClick={this.licitiraj}
              disabled={
                this.state.progress ||
                !this.state.vremeDostave ||
                !this.state.vremeDoPartnera
              }
            >
              <i className="fas fa-check mr-1" />
              Licitiraj
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
