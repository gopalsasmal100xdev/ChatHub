import { Box } from "@chakra-ui/react";
import { ChatState } from "../context/ChatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatViewer, MyChats } from "../components";

const ChatPage = () => {
  const { user } = ChatState();
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px">
        {user && <MyChats />}
        {user && <ChatViewer />} {/* ChatBox */}
      </Box>
    </div>
  );
};

export default ChatPage;
