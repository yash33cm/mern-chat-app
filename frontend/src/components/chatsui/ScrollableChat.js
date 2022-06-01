import { Avatar, Tooltip } from "@chakra-ui/react";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSamesUser,
} from "../../config/Chattinglogic";
import { Chatstate } from "../../contextprovider/Chatprovider";
const ScrollableChat = ({ messages }) => {
  const { user } = Chatstate();
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user.id) ||
              isLastMessage(messages, i, user.id)) && (
              <Tooltip label={m.sender.name} placement="bottom" hasArrow>
                <Avatar
                  name={m.sender.name}
                  src={m.sender.profilepic}
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user.id ? "#89F5D0" : "#BEE3F8"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(messages, m, i, user.id),
                marginTop: isSamesUser(messages, m, i, user._id) ? 3 : 10,
              }}
            >
              {m.Content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
