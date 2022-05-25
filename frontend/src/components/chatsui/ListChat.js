import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { fetchsender } from "../../config/Chattinglogic";
import { Chatstate } from "../../contextprovider/Chatprovider";
import GroupModal from "../Modals/GroupModal";
import Chatloading from "./Chatloading";

const ListChat = ({ fetchagain }) => {
  const { selectedchat, setselectedchat, user, chats, setchats } = Chatstate();
  const [loggeduser, setloggeduser] = useState();
  const toast = useToast();

  const fetchchats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("http://localhost:5000/chats/", config);
      setchats(data);
    } catch (error) {
      toast({
        isClosable: true,
        title: "Error fetching chat",
        description: "failed to load chats",
        status: "error",
        duration: 3000,
        position: "bottom-left",
      });
    }
  };
  useEffect(() => {
    setloggeduser(JSON.parse(localStorage.getItem("userInfo")));
    fetchchats();
  }, [fetchagain]);
  console.log(loggeduser);
  return (
    <Box
      d={{ base: selectedchat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      bg="white"
      w={{ base: "100%", md: "30%" }}
      borderRadius="lg"
    >
      <Box
        fontSize={{ base: "28px", md: "30px" }}
        d="flex"
        w="100%"
        pb={3}
        mt={3}
        px={3}
        justifyContent="space-between"
        alignItems="center"
        fontWeight="normal"
      >
        My Chats
        <GroupModal>
          <Button
            d="flex"
            alignItems="center"
            justifyContent="center"
            rightIcon={<AddIcon />}
          >
            New group chat
          </Button>
        </GroupModal>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        w="100%"
        h="100%"
        overflowY="hidden"
        borderRadius="lg"
        bg="#F8F8F8"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setselectedchat(chat)}
                cursor="pointer"
                bg={selectedchat === chat ? "#60C9CA" : "#E8E8E8"}
                color={selectedchat === chat ? "white" : "black"}
                p={2.5}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? fetchsender(loggeduser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <Chatloading />
        )}
      </Box>
    </Box>
  );
};

export default ListChat;
