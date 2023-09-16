import { useState, useEffect } from "react";
import axios from "axios";

const HomePage = () => {
  const [chats, setChats] = useState([]);
  useEffect(() => {
    (async () => {
      const { data } = await axios.get("http://localhost:5000/demo/api/chat");
      console.log(data);
      setChats(data);
    })();
  }, []);
  return (
    <div>
      {chats.map((chat) => (
        <h1 key={chat._id}>{chat.chatName}</h1>
      ))}
    </div>
  );
};

export default HomePage;
