import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserListItem";

const SideDrawer = () => {
  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleserach = async () => {
    if (!searchQuery) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5000/api?search=${searchQuery}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `http://localhost:5000/api/chat`,
        { userId },
        config
      );

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoadingChat(false);
    }
  };

  useEffect(() => {
    const timeId = setTimeout(() => {
      if (searchQuery) handleserach();
    }, 500);
    return () => {
      clearTimeout(timeId);
    };
  }, [searchQuery]);

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px">
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant={"ghost"} onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontWeight={"bold"} fontFamily="Work sans">
          Chat Hub
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="1.5xl" m={1} />
            </MenuButton>
          </Menu>
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user?.name}
                src={user?.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
              />
              <Button onClick={handleserach}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
