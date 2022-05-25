import { Box } from "@chakra-ui/react";
import React from "react";
import { Chatstate } from "../../contextprovider/Chatprovider";
import LoneChat from "./LoneChat";

const Chatbox = ({ fetchagain, setFetchagain }) => {
  const { selectedchat } = Chatstate();
  return (
    <Box
      d={{ base: selectedchat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      bg="white"
      w={{ base: "100%", md: "69%" }}
      borderRadius="lg"
    >
      <LoneChat fetchagain={fetchagain} setFetchagain={setFetchagain} />
    </Box>
  );
};

export default Chatbox;
