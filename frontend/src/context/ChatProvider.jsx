import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const ChatContext = createContext();

export const ChatState = () => {
  return useContext(ChatContext);
};

const ChatProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [selectedChat, setSelectedChat] = useState({});
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      navigate("/");
    }
    setUser(userInfo);
  }, []);
  return (
    <>
      <ChatContext.Provider
        value={{
          user,
          setUser,
          selectedChat,
          setSelectedChat,
          notification,
          setNotification,
          chats,
          setChats,
        }}>
        {children}
      </ChatContext.Provider>
    </>
  );
};

export default ChatProvider;
