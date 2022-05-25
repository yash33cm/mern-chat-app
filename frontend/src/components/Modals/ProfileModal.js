import { ViewIcon } from "@chakra-ui/icons";
import {
  Button,
  IconButton,
  Image,
  Modal,
  ModalBody,
  // ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

const ProfileModal = ({ user, children }) => {
  if (user.profilepic) user.pic = user.profilepic;
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent height="400px">
          <ModalHeader
            d="flex"
            fontSize="40px"
            fontWeight="medium"
            justifyContent="center"
          >
            {user.name}
          </ModalHeader>
          {/* <ModalCloseButton /> */}
          <ModalBody
            d="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Image
              src={user.pic}
              alt={user.name}
              borderRadius="full"
              boxSize="150px"
            />
            <Text fontSize="lg" mt={5} d={{ base: "26px", md: "30px" }}>
              Email: {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
