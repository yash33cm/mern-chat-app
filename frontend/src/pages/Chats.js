import { Box } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Chatbox from "../components/chatsui/Chatbox";
import ListChat from "../components/chatsui/ListChat";
import SideDrawer from "../components/chatsui/SideDrawer";
import { Chatstate } from "../contextprovider/Chatprovider";

function Chats() {
  const { isuser } = Chatstate();
  // console.log(userid);
  // console.log(profilepic);
  const [fetchagain, setFetchagain] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      {isuser && <SideDrawer />}
      <Box d="flex" justifyContent="space-between" w="100%" h="90vh" p="10px">
        {isuser && <ListChat fetchagain={fetchagain} />}
        {isuser && (
          <Chatbox fetchagain={fetchagain} setFetchagain={setFetchagain} />
        )}
      </Box>
    </div>
  );
}

export default Chats;
