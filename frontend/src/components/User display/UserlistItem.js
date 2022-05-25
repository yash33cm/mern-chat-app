import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";

const UserlistItem = ({ user, handleselect }) => {
  return (
    <Box
      onClick={handleselect}
      d="flex"
      bg="#E8E8E8"
      alignItems="center"
      px={3}
      py={2}
      cursor="pointer"
      width="100%"
      _hover={{ background: "#60C9CA", color: "white" }}
      mb={2}
      borderRadius="lg"
    >
      <Avatar size="sm" name={user.name} src={user.profilepic} />
      <Box pl={3}>
        <Text>{user.name}</Text>
        <Text fontSize="sm">
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserlistItem;
