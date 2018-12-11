import React from "react";
import {
  Row,
  Col,
  ButtonToolbar,
  Button,
  Card,
  CardImg,
  ListGroup,
  ListGroupItem,
  Badge
} from "react-bootstrap";
import Reactions from "react/components/reactions/reactions_component";
import { Nav } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { withPlaylists } from "react/context/playlists";
import DateUtils from "react/utils/date";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
class PlaylistPreview extends React.Component {
  constructor(props) {
    super(props);
    this.playlist = this.props.playlist;
    this.goToPlaylist = this.goToPlaylist.bind(this);
  }

  goToPlaylist() {
    const toUrl = "/playlists/" + this.props.playlist["id_playlist"];
    console.log(toUrl);
    this.props.history.push(toUrl);
  }

  render() {
    const playlist = this.playlist;
    if (playlist["url_thumbnail"] === null)
      playlist["url_thumbnail"] = "https://place-hold.it/16x9/212425";
    return (
      <Card className="floatHover h-100" onClick={this.goToPlaylist}>
        <CardImg
          variant="top"
          width="100%"
          src={playlist["url_thumbnail"]}
          alt="Card image cap"
        />
        <Card.Body>
          <Card.Title>
            <h3>{playlist["name"]}</h3>
          </Card.Title>
          <Card.Text>{playlist["description"]}</Card.Text>
          <h4 className="joinedBadges bottomRightCardBody">
            <Badge variant="primary">
              {playlist["likes_number"]} <FontAwesomeIcon icon={faThumbsUp} />
            </Badge>
            <Badge variant="danger">
              {playlist["dislikes_number"]}{" "}
              <FontAwesomeIcon icon={faThumbsDown} />
            </Badge>
          </h4>
        </Card.Body>
        <ListGroup className="list-group-flush">
          <ListGroupItem>
            <strong>Catégorie</strong>
            <span>{playlist["id_tag"]}</span>
          </ListGroupItem>
          <ListGroupItem>
            <strong>Créé le </strong>
            <span>{DateUtils.toReadable(playlist["creation_date"])}</span>
          </ListGroupItem>
          <ListGroupItem>
            <strong>Modifié le </strong>
            <span>{DateUtils.toReadable(playlist["last_update_date"])}</span>
          </ListGroupItem>
        </ListGroup>
      </Card>
    );
  }
}

export default withPlaylists(withRouter(PlaylistPreview));
