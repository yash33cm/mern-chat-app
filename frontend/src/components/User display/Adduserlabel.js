import { CloseIcon } from "@chakra-ui/icons";
import { Badge, Box, IconButton, Text } from "@chakra-ui/react";
import React from "react";

const Adduserlabel = ({ user, handledel }) => {
  return (
    <Badge
      p={2}
      mx={1}
      my={2}
      variant="solid"
      colorScheme="twitter"
      borderRadius="md"
      cursor="pointer"
    >
      {user.name}
      <CloseIcon pl={1} onClick={handledel} />
    </Badge>
  );
};

export default Adduserlabel;
