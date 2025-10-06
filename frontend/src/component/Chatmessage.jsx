import React, { useEffect, useState } from "react";
import Menubar from "./Menubar";
import axios from "axios";
import { io } from "socket.io-client";
import { FaArrowLeftLong } from "react-icons/fa6"

const Chatmessage = () => {
    const [info, setData] = useState([]); // array banaya, kyunki messages list aa sakti hai
    const [loading, setLoading] = useState(true);
    const friend = info?.friends
    const username = info?.user?.username
    const userId =  info?.user?.id
    const [selectuser, setselect] = useState(null)
    const [message, setMessages] = useState([])
    const SOCKET_URL = import.meta.env.VITE_API_URL
    const [socket, setSocket] = useState(null);
    const [newMsg, setNewMsg] = useState("")
 

    const detail = async () => {
        try {
            const API = import.meta.env.VITE_API_URL;
            const token = localStorage.getItem("token");

            const res = await axios({
                url: `${API}/user/friendschats`,
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            
            setData(res.data); // yaha ensure karo ke API array bhejti hai
        } catch (err) {
            console.error("Error fetching messages:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        detail();
    }, []);

    //socket.io
    // useEffect(() => {
    //     // console.log("Updated info state:", info);
    // }, [info]);


    useEffect(() => {
        if (!selectuser?.id) return;

        const s = io(SOCKET_URL, { query: { userId: localStorage.getItem("userId") } });
        setSocket(s);

        s.on("receiveMessage", (msg) => {
            if (msg.sender === selectuser?.id) setMessages(prev => [...prev, msg]);
        });

        s.on("messageSent", (msg) => setMessages(prev => [...prev, msg]));

        return () => s.disconnect();
    }, [selectuser]);

    const handleSend = () => {
  if (!newMsg.trim() || !socket || !selectuser) return;

  const msg = {
    _id: Date.now(), // temporary id for UI, backend will generate real _id
    sender: localStorage.getItem("userId"),
    receiver: selectuser.id,
    text: newMsg,
    createdAt: new Date().toISOString(),
  };

  // Add to state immediately
  setMessages(prev => [...prev, msg]);

  // Send to backend via socket
  socket.emit("sendMessage", { receiverId: selectuser.id, text: newMsg });

  setNewMsg("");
   if (e.key === "Enter") handleSend();
};


    useEffect(() => {
        if (selectuser?.id) {
            fetchMessages();
        }
    }, [selectuser]);


    const fetchMessages = async () => {
        const API = import.meta.env.VITE_API_URL
        const token = localStorage.getItem('token')
        const res = await axios({
            url: `${API}/chat/message/${selectuser.id}`, headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setMessages(res.data);
    };

    const handleKeyPress = (e) => {
  if (e.key === "Enter") handleSend();
};



    return (
        <div className="w-full h-screen">
            {/* Menubar */}
            <div className="fixed">
                <Menubar />
            </div>

            <div className="w-full h-screen sm:pl-30 pl-15 flex">
                {/* LEFT SIDEBAR */}
                <div className={`sm:w-4/11 w-full h-full border-1 border-gray-300 ${selectuser ? "hidden sm:block" : "block"}`}>
                    <h1 className="text-xl font-[700] mt-10 ml-7">{username}</h1>

                    {/* Search */}
                    <div className="sm:w-90 w-60 mr-5 h-10 border-1 border-gray-300 rounded-lg mt-5 bg-gray-50 flex ml-7">
                        <img className="w-5 h-5 mt-2 ml-3" src="search.png" alt="" />
                        <input
                            className="w-full h-full px-4 py-2 outline-none"
                            type="text"
                            placeholder="Search"
                        />
                    </div>

                    {/* Chats List */}
                    <div
                        // onClick={h}
                        className="cursor-pointer">
                        {loading ? (
                            <p className="mt-5 ml-7">Loading chats...</p>
                        ) : info && friend.length > 0 ? (
                            friend.map((chat, idx) => (
                                <div
                                    
                                    onClick={() => { setselect(chat);localStorage.setItem("userId", userId)  }}
                                    key={idx}
                                    className="mt-4 flex hover:bg-gray-100 pl-4 py-2"
                                >
                                    <div className="w-12 h-12 rounded-full bg-red-400">
                                        <img className="w-full h-full rounded-full object-cover" src={chat.avatar} alt="" />
                                    </div>
                                    <div className="flex-col flex">
                                        <h1 className="text-lg font-[500]  ml-4">
                                            {chat.fullname || "Unknown"}
                                        </h1>
                                        <h1 className="text-[12px] font-[400] -mt-1 ml-4">
                                            {chat.username || "Unknown"}
                                        </h1>

                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="mt-5 ml-7">No chats found</p>
                        )}
                    </div>
                </div>

                {/* RIGHT SIDE (Chat Window Placeholder) */}
                <div className={`w-full h-auto ${selectuser ? "block" : "hidden sm:block"}`}>
                    <span className="text-md font-[600] px-2 mt-4 flex gap-2 "><FaArrowLeftLong  size={18}className="mt-1" />Back </span>
                    <div className="w-full h-20 mt-2  bg-gradient-to-r from-[#feda75] via-[#d62976] to-[#4f5bd5]  border-1 border-gray-200 flex items-center sm:pl-10 pl-5 pr-20 fixed">
                        <div className="flex">
                            <div className="sm:w-15 w-10  sm:h-15 h-10 rounded-full bg-red-500">
                                <img className="w-full h-full object-cover rounded-full " src={selectuser?.avatar} alt="" />
                            </div>
                            <div>
                                <h1 className="sm:text-lg text-sm font-[500] ml-5">{selectuser?.fullname}</h1>
                                <h1 className="sm:text-sm text-[10px] font-[400] ml-5 -mt-1">{selectuser?.username}</h1>
                            </div>
                        </div>
                        <div className="w-50 h-15 sm:ml-87 ml-10 flex sm:gap-5 gap-2 items-center">
                            <img className="sm:w-10 w-5 sm:h-10 h-5" src="phone-call.png" alt="" />
                            <img className="sm:w-8 w-5 sm:h-8 h-5" src="cam-recorder.png" alt="" />
                            <img className="sm:w-8 w-5 sm:h-8 h-5" src="info.png" alt="" />
                        </div>
                    </div>
                    <div>
                        <div className="w-full h-[65vh]  mt-20 sm:pl-10 pl-5 overflow-hidden overflow-y-scroll">
                            
                            {message.length > 0 ? (
                                message.map((msg, idx) => (
                                    <div key={idx} className="py-4">
                                        <div
                                            className={`w-auto px-2   rounded-xl ${msg.sender === localStorage.getItem("userId")
                                                ? " self-end"
                                                : " self-start"
                                                }`}
                                        >
                                            <p className="sm:text-sm text-[12px]">{msg.text}</p>
                                        </div>
                                        <span className="text-[10px] text-gray-500">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}</span>

                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 text-center mt-5">No messages yet</p>
                            )}
                        </div>
                        <div className="px-4 py-2 flex gap-5 ">
                            <input
                                value={newMsg}
                                onChange={(e) => setNewMsg(e.target.value)}
                                onKeyDown={handleKeyPress}
                                className="w-[47vw] h-13 px-4 py-2 border-1 border-gray-300 rounded-xl outline-none " type="text" placeholder="message..." />
                            <button
                                onClick={handleSend}
                                className="px-5 py-1 bg-green-500 text-white rounded-lg text-md ">send</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chatmessage;
