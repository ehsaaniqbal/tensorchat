import React, { Fragment, useEffect, useState, useRef } from "react";
import { Button, Alert, Modal, ModalBody, ModalFooter } from "reactstrap";
import Peer from "simple-peer";
import io from "socket.io-client";
import Clipboard from "react-clipboard.js";
const socket = io(process.env.REACT_APP_WS_URL);

function Room(props) {
  let client = {},
    localStream;
  let hostStream = useRef(null);
  let remoteStream = useRef(null);
  let webShare = useRef(null);

  const roomName = props.match.params.roomname;
  const [roomExists, setRoomExists] = useState(true);
  const [errors, setErrors] = useState({});
  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [roomUrl, setRoomUrl] = useState(window.location.href);
  const [gotStream, setGotStream] = useState(false);
  const hidden = gotStream ? "hidden" : "";
  const classNames = `v-container ${hidden} `;

  const getRoomStatus = async () => {
    try {
      const response = await fetch("/room", {
        method: "POST",
        body: JSON.stringify({ roomName: roomName }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      const json = await response.json();
      if (json.data.msg === "room_exists") {
        setRoomExists(true);
        getMedia();
      } else if (json.data.msg === "room_does_not_exist") {
        setRoomExists(false);
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getRoomStatus();
  });

  //handle modal close
  const handleClose = () => {
    setVisible(false);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  //get access to media devices
  const getMedia = () => {
    navigator.getMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true
      })
      .then(stream => {
        //set media stream
        localStream = stream;
        hostStream.current.srcObject = stream;
        //subscribe to room
        socket.emit("subscribe", roomName);

        //peer constructor
        const initPeer = type => {
          let peer = new Peer({
            initiator: type === "init" ? true : false,
            stream: localStream,
            trickle: false
          });
          peer.on("stream", stream => {
            setGotStream(true);
            remoteStream.current.srcObject = stream;
          });
          return peer;
        };

        //create initiator
        const createHost = () => {
          client.gotAnswer = false;
          let peer = initPeer("init");
          peer.on("signal", data => {
            if (!client.gotAnswer) {
              socket.emit("offer", roomName, data);
            }
          });
          client.peer = peer;
        };

        //create remote
        const createRemote = offer => {
          let peer = initPeer("notinit");
          peer.on("signal", data => {
            socket.emit("answer", roomName, data);
          });
          peer.signal(offer);
          client.peer = peer;
        };

        //handle answer
        const handleAnswer = answer => {
          client.gotAnswer = true;
          let peer = client.peer;
          peer.signal(answer);
        };

        const session_active = () => {
          alert("session active");
        };

        //socket events
        socket.on("create_host", createHost);
        socket.on("new_offer", createRemote);
        socket.on("new_answer", handleAnswer);
        socket.on("end", end);
        socket.on("session_active", session_active);
      })
      .catch(error => {
        //error alerts
        setErrors({
          msg:
            "App needs permissions to access media devices to work! Try again."
        });
        setVisible(true);
        console.log(error);
      });
  };
  const hangup = () => {
    socket.emit("user_disconnected", roomName);
    end();
  };

  //end connection
  const end = () => {
    window.location.href = "/";
  };

  //disable video
  const disableVideo = () => {
    let videoTracks = localStream.getVideoTracks();
    for (var i = 0; i < videoTracks.length; ++i) {
      videoTracks[i].enabled = !videoTracks[i].enabled;
    }
  };

  //disable audio
  const disableAudio = () => {
    let audioTracks = localStream.getAudioTracks();
    for (var i = 0; i < audioTracks.length; ++i) {
      audioTracks[i].enabled = !audioTracks[i].enabled;
    }
  };

  //web share
  const share = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "TensorChat",
          text: "Share this session URL with friends",
          url: window.location.href
        })
        .then(() => {
          showCheck();
        })
        .catch(console.error);
    } else {
      setModalVisible(true);
      showCheck();
    }
  };

  const showCheck = () => {
    webShare.current.className = "fas fa-clipboard-check";
    setTimeout(() => {
      webShare.current.className = "fas fa-share-alt";
    }, 2000);
  };

  const onSuccess = () => {
    setModalVisible(false);
  };

  //content to render
  const content = roomExists ? (
    <Fragment>
      <div className="hostStream">
        <video autoPlay={true} muted playsInline ref={hostStream}></video>
      </div>
      <Modal isOpen={modalVisible} toggle={handleModalClose}>
        <div className="modal-header">
          <h5 className="modal-title">TensorChat</h5>
        </div>
        <ModalBody>
          <p>Share the session URL to invite friends.</p>
          <input
            autoFocus
            type="text"
            name="roomUrl"
            onChange={e => setRoomUrl(e.target.value)}
            className="form-control"
            value={roomUrl}
            style={{ color: "black" }}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Clipboard
            className=" btn btn-info"
            data-clipboard-text={roomUrl}
            onSuccess={onSuccess}
          >
            Copy
          </Clipboard>
        </ModalFooter>
      </Modal>

      <Alert color="danger" isOpen={visible}>
        {errors.msg}
        <button onClick={handleClose} className="btn-round btn-icon close">
          <i className="fas fa-times"></i>
        </button>
      </Alert>

      <div role="group" id="actionbar">
        <Button
          onClick={share}
          color="info"
          className="btn-round btn-icon actionbar-icon"
        >
          <i className="fas fa-share-alt" ref={webShare}></i>
        </Button>
        <Button
          onClick={disableVideo}
          color="info"
          className="btn-round btn-icon actionbar-icon"
        >
          <i className="fas fa-video-slash"></i>
        </Button>
        <Button
          onClick={disableAudio}
          color="info"
          className="btn-round btn-icon actionbar-icon"
        >
          <i className="fas fa-microphone-slash"></i>
        </Button>
        <Button
          onClick={hangup}
          className="btn-round btn-icon actionbar-icon"
          color="danger"
        >
          <i className="fas fa-phone-slash"></i>
        </Button>
      </div>

      <div className="fullscreen-video-wrap">
        <video
          id="remoteStream"
          autoPlay={true}
          muted
          playsInline
          ref={remoteStream}
        ></video>
      </div>

      <div className={classNames}>
        <h1> Share this session URL to invite friends!</h1>
      </div>
    </Fragment>
  ) : (
    <Modal isOpen={modalVisible} toggle={handleModalClose} size="sm">
      <div className="modal-header">
        <h5 className="modal-title">TensorChat</h5>
      </div>
      <ModalBody>
        <p>
          <span style={{ fontWeight: "bold" }}>"{roomName}"</span> does not
          exist,<a href="/#howitworks"> need help?</a>
        </p>
      </ModalBody>
      <ModalFooter>
        <Button
          color="secondary"
          onClick={() => {
            props.history.push("/");
          }}
        >
          Home
        </Button>
        <Button
          color="secondary"
          onClick={() => {
            props.history.push("/createroom");
          }}
        >
          Create
        </Button>
      </ModalFooter>
    </Modal>
  );

  return <Fragment>{content}</Fragment>;
}

export default Room;
