import React from "react";
import PlaylistsComponent from "../../components/playlists/playlists_component";
import { connect } from "react-redux";

class MyPlaylistsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { playlists: [] };
  }

  componentDidMount() {
    fetch("/playlists", { method: "GET" })
      .then(resp => {
        return resp.json();
      })
      .then(playlists => {
        this.setState(Object.assign({}, this.state, { playlists: playlists }));
      });
  }

  render() {
    return (
      <PlaylistsComponent playlists={this.state.playlists} {...this.props} />
    );
  }
}

export default connect()(MyPlaylistsContainer);