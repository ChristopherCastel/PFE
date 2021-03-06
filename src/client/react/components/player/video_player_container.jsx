import React from "react";
import videojs from "video.js";
import youtube from "videojs-youtube";
import { createNotification } from "react/utils/notifs";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faForward, faBackward } from "@fortawesome/free-solid-svg-icons";

export default class VideoPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.options = {
      fluid: true,
      autoplay: false,
      controls: true,
      techOrder: ["youtube", "html5"],
      sources: [
        {
          type: "video/youtube",
          src: "https://youtube.com/"
        }
      ]
    };
    this.loadVideo = this.loadVideo.bind(this);
    this.previousVideo = this.previousVideo.bind(this);
    this.nextVideo = this.nextVideo.bind(this);
    this.videoId = 0;
  }

  wrapSource(url) {
    return {
      type: "video/youtube",
      src: url
    };
  }

  componentDidMount() {
    if (videojs.getPlugin("youtube") === undefined) {
      videojs.registerPlugin("youtube", () => youtube);
    }
    this.player = videojs(this.videoNode, this.options, () => {
      console.log("Player ready");
      this.loadVideo(this.props.videoId);
    });
    this.player.on("ended", this.nextVideo);
  }

  componentDidUpdate() {
    this.loadVideo(this.props.videoId);
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  loadVideo(videoId) {
    if (videoId < 0 || videoId >= this.props.videos.length) {
      createNotification("error", "Video index OOB");
      return;
    }
    if (videoId !== undefined) this.videoId = videoId;
    let src = this.wrapSource(this.props.videos[this.videoId].url_video);
    this.player.src(src);
    this.player.poster(this.props.videos[this.videoId].url_thumbnail);
    this.player.load();
    this.player.play();
  }

  previousVideo() {
    if (this.videoId - 1 < 0) {
      createNotification("info", "This is the first video");
      return;
    }
    this.videoId--;
    this.loadVideo();
  }

  nextVideo() {
    if (this.videoId + 1 >= this.props.videos.length) {
      createNotification("info", "This is the last video");
      return;
    }
    this.videoId++;
    this.loadVideo();
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <div data-vjs-player>
            <video
              id="video-1"
              ref={node => (this.videoNode = node)}
              data-setup={JSON.stringify(this.state.options)}
              className="video-js vjs-default-skin vjs-big-play-centered"
            />
          </div>
        </div>
        <div className="custom-video-player text-center">
          <Button
            variant="secondary"
            onClick={() => {
              this.previousVideo();
            }}
          >
            <FontAwesomeIcon icon={faBackward} />
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              this.nextVideo();
            }}
          >
            <FontAwesomeIcon icon={faForward} />
          </Button>
        </div>
      </React.Fragment>
    );
  }
}
