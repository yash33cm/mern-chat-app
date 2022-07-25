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

  useEffect(() => {
    (function (d, m) {
      var kommunicateSettings = {
        appId: "38737c536c0a2bf055059d6dfad2502e2",
        popupWidget: true,
        automaticChatOpenOnNavigation: true,
      };
      var s = document.createElement("script");
      s.type = "text/javascript";
      s.async = true;
      s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
      var h = document.getElementsByTagName("head")[0];
      h.appendChild(s);
      window.kommunicate = m;
      m._globals = kommunicateSettings;
    })(document, window.kommunicate || {});
    /* NOTE : Use web server to view HTML files as real-time update will not work if you directly open the HTML file in the browser. */
  }, []);

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
