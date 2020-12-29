import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  CardTitle,
  CardFooter,
  Progress,
  Badge,
  Row,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  FormGroup,
  Label,
  Input,
  ModalFooter,
} from "reactstrap";
import myFetch from "myFetch";
import moment from "moment";
import "moment/locale/sr";
import Moment from "react-moment";

var Sound = require("react-sound").default;

var statusi = {
  1: "U pripremi", // 1
  2: "Čeka se preuzimanje", // 2
  3: "Dostavlja se", // 2
  6: "Otkazana",
};

var boje = {
  1: "secondary",
  2: "success",
  3: "info",
  6: "danger",
};

export default class Porudzbina extends Component {
  state = {
    progress: false,
    modalVozac: false,
    fade: false,
    zvukStatus: false,
  };

  componentDidMount() {
    setTimeout(() => this.setState({ fade: true }), 100);
    this.setState({ zvukStatus: true });
  }

  preuzeta = () => {
    this.setState({ progress: true });
    myFetch("/vozacApi/preuzeta", "POST", { id: this.props.obj.id });
  };

  dostavljena = () => {
    this.setState({ progress: true });
    myFetch("/vozacApi/dostavljena", "POST", { id: this.props.obj.id });
  };

  otkazVozacVideo = () => {
    this.setState({ progress: true });
    myFetch("/vozacApi/otkazVozacVideo", "POST", { id: this.props.obj.id });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.obj !== this.props.obj) {
      this.setState({ progress: false });
      if (prevProps.obj.status !== this.props.obj.status) {
        this.setState({ zvukStatus: true });
      }
    }
  }

  formatirajVreme = (sec) => {
    var color = "text-success";
    if (sec < 0) {
      sec *= -1;
      color = "text-danger";
    }
    var min = Math.floor(sec / 60);
    sec = sec - 60 * min;
    if (sec < 10) sec = "0" + sec;
    if (min < 10) min = "0" + min;
    return (
      <span
        style={{ fontSize: "130%", fontFamily: "monospace" }}
        className={color}
      >
        {min}:{sec}
      </span>
    );
  };

  render() {
    var { obj } = this.props;

    var dugmad = "";

    if (obj.status === 1) {
      dugmad = <Row form></Row>;
    } else if (obj.status === 2) {
      dugmad = (
        <>
          {obj.PartnerId == null && (
            <Button
              block
              color="secondary"
              disabled={this.state.progress}
              onClick={this.preuzeta}
            >
              <i className="fas fa-truck mr-1" />
              Preuzeta
            </Button>
          )}
        </>
      );
    } else if (obj.status === 3) {
      dugmad = (
        <Button
          block
          color="secondary"
          disabled={this.state.progress}
          onClick={this.dostavljena}
        >
          <i className="fas fa-truck mr-1" />
          Dostavljena
        </Button>
      );
    } else if (obj.status === 6) {
      dugmad = (
        <Button
          block
          color="secondary"
          disabled={this.state.progress}
          onClick={this.otkazVozacVideo}
        >
          <i className="fas fa-cancel mr-1" />
          Ukloni
        </Button>
      );
    }

    return (
      <Card className="dmCardPorudzbina" inverse color={boje[obj.status]}>
        <Sound
          url={require("assets/sounds/status.wav")}
          playStatus={this.state.zvukStatus ? "" : ""}
          onFinishedPlaying={() => this.setState({ zvukStatus: false })}
        />

        <Modal isOpen={this.state.modalOdbij} className="dmModal modalOdbij">
          <ModalHeader>
            <i className="fas fa-ban mr-1 text-danger " />
            Odbijanje porudžbine #{obj.id}
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="razlogOdbijanja">Razlog odbijanja:</Label>
              <Input
                type="textarea"
                id="razlogOdbijanja"
                placeholder="Navedite razlog odbijanja..."
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.odbij}>
              Potvrdi
            </Button>
          </ModalFooter>
        </Modal>

        <CardHeader>
          <CardTitle style={{ whiteSpace: "nowrap" }}>
            <Row className="align-items-center">
              <Col xs={6}>
                {obj.firebaseUID != null && (
                  <Badge className="ml-2" color="primary">
                    Iz aplikacije
                  </Badge>
                )}
                <Badge className="ml-2" color="info">
                  {statusi[obj.status]}
                </Badge>
              </Col>
              <Col
                hidden={obj.status !== 1}
                xs={6}
                style={{ textAlign: "right" }}
              >
                {this.formatirajVreme(this.props.preostalo)}
              </Col>
            </Row>
            <i className="fas fa-tags" /> Porudžbina #{obj.id}
          </CardTitle>
        </CardHeader>

        <CardBody>
          {obj.razlogOtkazivanja != null && (
            <p id="razlog">
              <i className="fas fa-times-circle mr-1" />
              Razlog otkazivanja: <b>{obj.razlogOtkazivanja}</b>
            </p>
          )}
          {obj.zakazanaZa != null && (
            <p id="razlog">
              <i className="fas fa-clock mr-1" />
              Zakazana za:{" "}
              <b>
                <Moment format="hh:mm">{obj.zakazanaZa}</Moment>
              </b>
            </p>
          )}

          <div className="divOkvir mb-2">
            <h6>
              <i className="fas fa-user mr-1" />
              Naručilac
            </h6>
            <ul>
              <li>
                Partner: <b>{obj.partnerString}</b>
              </li>
              {obj.ime !== null && obj.ime.length !== 0 ? (
                <li>
                  Ime: <b>{obj.ime}</b>
                </li>
              ) : (
                ""
              )}
              <li>
                Adresa:{" "}
                <b>
                  {obj.adresa}, {obj.Mesto.naziv}
                </b>
              </li>
              {obj.telefon !== null && obj.telefon.length !== 0 ? (
                <li>
                  Telefon:{" "}
                  <b>
                    <a
                      style={{ color: "white", textDecoration: "underline" }}
                      href={"tel:" + obj.telefon}
                    >
                      {obj.telefon}
                    </a>
                  </b>
                </li>
              ) : (
                ""
              )}
              <li>
                Cena dostave: <b>{obj.cenaDostave} din.</b>
              </li>

              {obj.cenaPorudzbine != null && obj.cenaPorudzbine.length != 0 ? (
                <li>
                  Cena porudžbine: <b>{obj.cenaPorudzbine} din.</b>
                </li>
              ) : (
                ""
              )}

              {obj.cenaPorudzbine != null && obj.cenaPorudzbine.length != 0 ? (
                <li>
                  Za naplatu: <b>{obj.cenaDostave + obj.cenaPorudzbine} din.</b>
                </li>
              ) : (
                ""
              )}
            </ul>
          </div>
          <div className="divOkvir">
            <h6>
              <i className="fas fa-file-alt mr-1" />
              Detalji
            </h6>
            {obj.stavke != null ? (
              <>
                <p style={{ margin: 0, paddingLeft: 0 }}>
                  <i className="fas fa-list mr-1 fa-fw" />
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
                        <i>
                          (
                          {obj.firebaseUID != null
                            ? stavka.cena
                            : stavka.cena * stavka.kolicina}{" "}
                          din.)
                        </i>
                      </span>
                    </li>
                  ))}
                </ol>
              </>
            ) : (
              ""
            )}
            <ul>
              {obj.opis != null && obj.opis.length > 0 ? (
                <li>
                  Opis:
                  <br />
                  <ul>
                    {obj.opis.split("\n").map((stavka) => (
                      <li>
                        <b>{stavka}</b>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                ""
              )}
            </ul>
            {obj.napomena !== null && obj.napomena !== "" ? (
              <p style={{ margin: 0 }}>
                Napomena:
                <b> {obj.napomena}</b>
              </p>
            ) : (
              ""
            )}
          </div>
        </CardBody>

        <CardFooter>
          <div className="padded">{dugmad}</div>
          <Progress
            hidden={obj.status !== 1}
            animated
            color={this.props.preostalo > 0 ? "success" : "danger"}
            value={
              this.props.preostalo > 0
                ? (this.props.preostalo / obj.odgovor) * 100
                : 100
            }
          />
        </CardFooter>
      </Card>
    );
  }
}
