import {
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
  Spinner,
  Box,
  Text,
  Badge,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import UserListItem from "../UserListItem";
import UserBadgeItem from "../UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { user, chats, setChats } = ChatState();

  const handleSearch = async (search) => {
    search = search.trim();
    if (!search) {
      return;
    } else {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        };
        const { data } = await axios.get(
          `http://localhost:5000/api?search=${search}`,
          config
        );
        setLoading(false);
        setSearchResult(data);
      } catch (error) {
        setLoading(false);
        toast({
          title: "Error Occured!",
          description: "Failed to Load the Search Results",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }
    }
  };
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
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
        "http://localhost:5000/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers?.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      onClose();
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Failed to Create the Chat!",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };
  const handleGroup = (userToBeAdd) => {
    if (selectedUsers.includes(userToBeAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToBeAdd]);
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center">
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: John, Martin, Omega"
                mb={1}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
                value={searchQuery}
              />
            </FormControl>

            {/* selected users */}
            {selectedUsers.length > 0 && (
              <Text>
                Group Members{" "}
                <Badge colorScheme="green">{selectedUsers.length}</Badge>
              </Text>
            )}
            {selectedUsers.length > 0 && (
              <Box
                border={"1px"}
                margin={"5px"}
                padding={"5px"}
                borderRadius={"lg"}
                w={"100%"}
                display={"flex"}
                flexWrap={"wrap"}>
                {selectedUsers?.map((user) => (
                  <UserBadgeItem
                    key={user?._id}
                    user={user}
                    handleFunction={() => handleDelete(user)}
                  />
                ))}
              </Box>
            )}

            {loading ? (
              <Spinner thickness="4px" />
            ) : (
              searchQuery &&
              searchResult
                ?.slice(0, 4)
                .map((searchUser) => (
                  <UserListItem
                    user={searchUser}
                    key={searchUser?._id}
                    handleFunction={() => handleGroup(searchUser)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" onClick={handleSubmit}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
