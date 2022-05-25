import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  // ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { user, Chatstate } from "../../contextprovider/Chatprovider";
import Adduserlabel from "../User display/Adduserlabel";
import UserlistItem from "../User display/UserlistItem";
import axios from "axios";

function UpdateModal({ fetchagain, setFetchagain }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, selectedchat } = Chatstate();
  const [name, setname] = useState("");
  const [renameloading, setrenameloading] = useState(false);
  const [search, setsearch] = useState("");
  const [searchresult, setsearchresult] = useState([]);
  const [loading, setloading] = useState("");

  const toast = useToast();

  const handledel = () => {};
  const handleadd = () => {};
  const handleremove = () => {};
  const handlerename = () => {};
  const handlesearch = async (query) => {
    setsearch(query);
    if (!search) {
      return;
    }
    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5000/user?search=${search}`,
        config
      );
      setsearchresult(data);
      setloading(false);
    } catch (error) {
      toast({
        duration: 3000,
        status: "error",
        isClosable: true,
        title: "No search found",
        description: error.message,
      });
      setloading(false);
    }
  };
  return (
    <>
      <IconButton onClick={onOpen} icon={<ViewIcon />} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Ubuntu"
            fontWeight="light"
            d="flex"
            justifyContent="center"
          >
            {selectedchat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box d="flex" alignItems="center" flexWrap="wrap">
              {selectedchat.users.map((u) => (
                <Adduserlabel
                  user={u}
                  keu={u._id}
                  handledel={() => handledel(u)}
                />
              ))}
            </Box>
            <FormControl d="flex">
              <Input
                type="text"
                placeholder="Chat Name"
                mb={3}
                value={name}
                onChange={(e) => setname(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                isLoading={renameloading}
                ml={1}
                onclick={handlerename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add users to group"
                mb={2}
                onChange={(e) => handlesearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Text textAlign="center"> loading...</Text>
            ) : (
              searchresult
                ?.slice(0, 3)
                .map((user) => (
                  <UserlistItem
                    key={user._id}
                    user={user}
                    handleselect={() => handleadd(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleremove}>
              Leave group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateModal;
