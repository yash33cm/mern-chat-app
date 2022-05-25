import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { Chatstate } from "../../contextprovider/Chatprovider";
import ProfileModal from "../Modals/ProfileModal";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Chatloading from "./Chatloading";
import UserlistItem from "../User display/UserlistItem";

const SideDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, setselectedchat, chats, setchats } = Chatstate();
  const history = useHistory();
  const [search, setsearch] = useState("");
  const [searchresult, setsearchresult] = useState([]);
  // const [selectedchat,setselectedchat]=useState()
  const [loading, setloading] = useState(false);
  const [loadingchat, setloadingchat] = useState(false);

  const handlelogout = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };
  const toast = useToast();
  const handlesearch = async () => {
    try {
      setloading(true);
      if (!search) {
        toast({
          isClosable: true,
          title: "Please type to search",
          status: "warning",
          duration: 3000,
          position: "top-left",
        });
        setloading(false);
        return;
      }
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5000/user?search=${search}`,
        config
      );
      setloading(false);
      setsearchresult(data);
    } catch (error) {
      toast({
        isClosable: true,
        title: "Error occured",
        status: "error",
        duration: 3000,
        position: "bottom-left",
      });
      setloading(false);
    }
  };

  const accesschat = async (userid) => {
    try {
      console.log(userid);
      // console.log(user.token);
      setloadingchat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "http://localhost:5000/chats/",
        { userid },
        config
      );
      if (!chats.find((c) => c._id === data._id)) setchats([data, ...chats]);
      setselectedchat(data);
      setloadingchat(false);
      onClose();
    } catch (error) {
      toast({
        isClosable: true,
        title: "Error fetching chat",
        description: error.message,
        status: "error",
        duration: 3000,
        position: "bottom-left",
      });
      setloadingchat(false);
    }
  };
  return (
    <>
      <Box
        d="flex"
        width="100%"
        bg="white"
        p="5px"
        justifyContent="space-between"
        alignItems="center"
      >
        <Tooltip label="search contacts" hasArrow placement="bottom">
          <Button variant="ghost" onClick={onOpen}>
            <i class="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px="4" fontWeight="normal">
              Search user
            </Text>
          </Button>
        </Tooltip>
        <Text
          fontFamily="Akaya Telivigala, cursive"
          fontSize="4xl"
          fontWeight="bold"
        >
          Sociocon
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
          </Menu>
          <Menu>
            <MenuButton
              p={1}
              as={Button}
              bg="white"
              rightIcon={<ChevronDownIcon />}
            >
              <Avatar
                size="sm"
                cursor="pointer"
                src={user.pic}
                name={user.name}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={handlelogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search User</DrawerHeader>

          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="search by name or email..."
                onChange={(e) => setsearch(e.target.value)}
              />
              <Button ml={1} mb={1} onClick={handlesearch}>
                search
              </Button>
            </Box>
            {loading ? (
              <Chatloading />
            ) : (
              searchresult?.map((user) => (
                <UserlistItem
                  key={user._id}
                  user={user}
                  handleselect={() => accesschat(user._id)}
                />
              ))
            )}
            {loadingchat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>

          {/* <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </DrawerFooter> */}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
