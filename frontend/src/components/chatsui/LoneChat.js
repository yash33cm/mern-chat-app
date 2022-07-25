import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { fetchsender, fetchsenderfull } from "../../config/Chattinglogic";
import { Chatstate } from "../../contextprovider/Chatprovider";
import ProfileModal from "../Modals/ProfileModal";
import UpdateModal from "../Modals/UpdateModal";
import ScrollableChat from "./ScrollableChat";
import "./style.css";
import io from "socket.io-client";
import Lottie from "lottie-react";
import animationData from "../../animations/typing.json";
// import Messages from "../../../../models/Messages";
const endpoint = "http://localhost:5000";
let socket, selectedchatcmp;

function LoneChat({ fetchagain, setFetchagain }) {
  const { user, selectedchat, setselectedchat } = Chatstate();
  const [loading, setloading] = useState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setnewMessage] = useState();
  const [socketconn, setsocketconn] = useState(false);
  const [typing, settyping] = useState(false);
  const [istyping, setistyping] = useState(false);
  const toast = useToast();

  // const defaultOptions = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: animationData,
  //   rendererSettings: {
  //     perserveAspectRatio: "xMidYMid slice",
  //   },
  // };

  const fetchmessages = async () => {
    if (!selectedchat) return;
    try {
      setloading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:5000/messages/${selectedchat._id}`,
        config
      );
      setMessages(data);
      setloading(false);
      socket.emit("join chat", selectedchat._id);
    } catch (error) {
      // console.log(error);
      toast({
        duration: 3000,
        position: "top",
        isClosable: true,
        status: "warning",
        title: error.message,
      });
    }
  };

  useEffect(() => {
    socket = io(endpoint);
    socket.emit("newroom", user);
    socket.on("connected", () => {
      setsocketconn(true);
    });
    socket.on("typing", () => setistyping(true));
    socket.on("stop typing", () => setistyping(false));
  }, []);

  useEffect(() => {
    fetchmessages();
    selectedchatcmp = selectedchat;
  }, [selectedchat]);

  useEffect(() => {
    socket.on("send message", (incomingmessage) => {
      if (
        !selectedchatcmp ||
        selectedchatcmp._id !== incomingmessage.chat._id
      ) {
        //give notification
      } else {
        setMessages([...messages, incomingmessage]);
      }
    });
  });
  const sendmessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        socket.emit("stop typing", selectedchat._id);
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setnewMessage("");
        const { data } = await axios.post(
          "http://localhost:5000/messages",
          {
            content: newMessage,
            chatid: selectedchat._id,
          },
          config
        );
        console.log(data);
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          duration: 3000,
          position: "top",
          isClosable: true,
          status: "warning",
          title: error.message,
        });
      }
    }
  };

  const handletyping = (e) => {
    setnewMessage(e.target.value);

    if (!socketconn) return;

    if (!typing) {
      settyping(true);
      socket.emit("typing", selectedchat._id);
    }

    let lasttypetime = new Date().getTime();
    var timerlength = 3000;

    setTimeout(() => {
      let timenow = new Date().getTime();
      let timediff = timenow - lasttypetime;
      if (timediff >= timerlength) {
        socket.emit("stop typing", selectedchat._id);
        settyping(false);
      }
    }, timerlength);
  };
  return (
    <>
      {selectedchat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            px={3}
            pb={2}
            w="100%"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setselectedchat("")}
            />
            {!selectedchat.isGroupChat ? (
              <>
                {fetchsender(user, selectedchat.users)}
                <ProfileModal
                  user={fetchsenderfull(user, selectedchat.users)}
                />
              </>
            ) : (
              <>
                {selectedchat.chatName.toUpperCase()}
                <UpdateModal
                  fetchagain={fetchagain}
                  setFetchagain={setFetchagain}
                  fetchmessages={fetchmessages}
                />
              </>
            )}
          </Text>
          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="98%"
            h="88%"
            overflowY="scroll"
            borderRadius="lg"
          >
            {loading ? (
              <Spinner
                height={20}
                width={20}
                margin="auto"
                alignSelf="center"
              />
            ) : (
              <div
                className="messages"
                style={{ marginBottom: istyping ? 10 : 0 }}
              >
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendmessage} mt={2}>
              {istyping ? (
                <div>
                  <Lottie
                    loop="true"
                    autoplay="true"
                    animationData={animationData}
                    style={{
                      width: 70,
                      // marginTop: 15
                      marginBottom: 15,
                      marginLeft: 0,
                    }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant={"filled"}
                placeholder="Enter a message"
                bg="#E0E0E0"
                value={newMessage}
                onChange={handletyping}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          d="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
          fontSize="3xl"
        >
          Select a chat to message/chatting
        </Box>
      )}
    </>
  );
}

export default LoneChat;
