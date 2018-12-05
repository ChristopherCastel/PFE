import React from "react";
import { Row, Col, ButtonToolbar, Button } from "react-bootstrap";

const PlaylistPreview = ({ playlist }) => {
  return (
    <div>
      <h3>{playlist["name"]}</h3>
      <p>description: {playlist["description"]}</p>
      <p>creation_date: {playlist["creation_date"]}</p>
      <p>dislikes_number: {playlist["dislikes_number"]}</p>
      <p>id_tag: {playlist["id_tag"]}</p>
      <p>id_user: {playlist["id_user"]}</p>
      <p>last_update_date: {playlist["last_update_date"]}</p>
      <p>likes_number: {playlist["likes_number"]}</p>
      <Button>Full playlist !</Button>
    </div>
  );
};

export default PlaylistPreview;
