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

export default class ModalNovaPorudzbinaSaCentrale extends Component {
  state = {
    progress: false,
    isOpen: false,
  };

  componentDidMount() {
    this.setState({ isOpen: true });
  }

  otvori = () => {
    this.setState({ isOpen: true, progress: false });
  };

  ucitava = () => {
    this.setState({ isOpen: false });
  };

  prihvati = () => {
    this.ucitava();
    myFetch("/vozacApi/prihvati", "POST", {
      id: this.props.obj.id,
    });
  };

  odbij = () => {
    this.ucitava();
    myFetch("/vozacApi/odbij", "POST", {
      id: this.props.obj.id,
    });
  };

  render() {
    var { obj } = this.props;
    var vremena = [5, 10, 15, 20, 25, 30];
    return (
      <>
        <Sound
          url={require("assets/sounds/alarm.mp3")}
          playStatus={Sound.status.PLAYING}
        />

        <Modal
          isOpen={this.state.isOpen}
          className="dmModalNovaPorudzbinaSaCentrale"
        >
          <ModalHeader>
            <i className="far fa-bell mr-1 text-info align-middle" />
            Nova porudžbina (#{obj.id})
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

                  {obj.stavke != null ? (
                    <>
                      <p>
                        <i className="fas fa-list fa-fw mr-1" />
                        Stavke:
                      </p>
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
                  {obj.napomena != null ? (
                    <p>
                      Napomena:
                      <b> {obj.napomena}</b>
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
              onClick={this.prihvati}
              disabled={this.state.progress}
            >
              <i className="fas fa-check mr-1" />
              Prihvati
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
