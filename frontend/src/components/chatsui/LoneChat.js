import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, IconButton, Text } from "@chakra-ui/react";
import React from "react";
import { fetchsender, fetchsenderfull } from "../../config/Chattinglogic";
import { Chatstate } from "../../contextprovider/Chatprovider";
import ProfileModal from "../Modals/ProfileModal";
import UpdateModal from "../Modals/UpdateModal";

function LoneChat({ fetchagain, setFetchagain }) {
  const { user, selectedchat, setselectedchat } = Chatstate();
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
            overflowY="hidden"
            borderRadius="lg"
          ></Box>
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
