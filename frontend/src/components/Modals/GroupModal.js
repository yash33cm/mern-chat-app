import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  useToast,
  FormControl,
  Input,
  Text,
  Box,
} from "@chakra-ui/react";
import { Chatstate } from "../../contextprovider/Chatprovider";
import axios from "axios";
import UserlistItem from "../User display/UserlistItem";
import Adduserlabel from "../User display/Adduserlabel";

const GroupModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, chats, setchats } = Chatstate();
  const [groupname, setgroupname] = useState("");
  const [selectmembers, setselectmembers] = useState([]);
  const [search, setsearch] = useState("");
  const [searchresult, setsearchresult] = useState([]);
  const [loading, setloading] = useState(false);
  const toast = useToast();

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

  const handlegroup = (adduser) => {
    if (selectmembers.includes(adduser)) {
      toast({
        duration: 3000,
        status: "warning",
        isClosable: true,
        title: "user already added",
      });
      return;
    }
    setselectmembers([...selectmembers, adduser]);
  };

  const handledel = (u) => {
    setselectmembers(selectmembers.filter((c) => c._id != u._id));
  };
  const handlecreate = async () => {
    if (!groupname || !selectmembers) {
      toast({
        duration: 3000,
        status: "warning",
        isClosable: true,
        position: "top",
        title: "please Fill all fields",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `http://localhost:5000/chats/group`,
        {
          name: groupname,
          members: JSON.stringify(selectmembers.map((u) => u._id)),
        },
        config
      );
      setchats([data, ...chats]);
      onClose();
      toast({
        duration: 3000,
        status: "success",
        isClosable: true,
        position: "top",
        title: "Group created!!!",
      });
    } catch (error) {
      toast({
        duration: 3000,
        status: "error",
        isClosable: true,
        position: "top",
        description: error.message,
        title: "group not created",
      });
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create group</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <Input
                placeholder="Enter Group Name"
                mb={2}
                onChange={(e) => setgroupname(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add users eg: jane, john"
                mb={2}
                onChange={(e) => handlesearch(e.target.value)}
              />
            </FormControl>
            {/* selected user */}
            <Box d="flex" alignItems="center" flexWrap="wrap">
              {selectmembers.map((u) => (
                <Adduserlabel
                  user={u}
                  keu={u._id}
                  handledel={() => handledel(u)}
                />
              ))}
            </Box>
            {loading ? (
              <Text textAlign="center"> loading...</Text>
            ) : (
              searchresult
                ?.slice(0, 4)
                .map((user) => (
                  <UserlistItem
                    key={user._id}
                    user={user}
                    handleselect={() => handlegroup(user)}
                  />
                ))
            )}
            {/* render search res */}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handlecreate}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupModal;
