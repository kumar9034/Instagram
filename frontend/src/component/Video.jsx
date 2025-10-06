import React, { useState, useEffect, useContext } from "react";
import Story from "./story";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./Contextapi";

const Video = () => {
  const [data, setData] = useState({ posts: [] });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate("")
  const { setId } = useContext(UserContext)

  // Try to get userId from localStorage; if not present, try decoding JWT.
  const getUserIdFromStorageOrToken = () => {
    const stored = localStorage.getItem("userId");
    if (stored) return stored;

    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const payload = token.split(".")[1];
      // base64 url -> base64
      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      // decode, handle unicode
      const json = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      const obj = JSON.parse(json);
      // Common fields where id may be stored
      return obj?.id || obj?.userId || obj?._id || obj?.sub || null;
    } catch (e) {
      console.warn("Failed to decode token for userId:", e);
      return null;
    }
  };

  // Normalize likes -> number
  const normalizeCount = (likes) => {
    if (Array.isArray(likes)) return likes.length;
    if (typeof likes === "number") return likes;
    return 0;
  };

  // Check if current user is in likes array (handles array of ids or array of objects)
  const userInLikes = (likes, userId) => {
    if (!userId) return false;
    if (!likes) return false;
    if (Array.isArray(likes)) {
      return likes.some((l) => {
        if (!l) return false;
        if (typeof l === "string") return l === userId;
        if (typeof l === "object") return l._id === userId || l.id === userId || l.userId === userId;
        return false;
      });
    }
    return false;
  };

  // Fetch posts and attach liked + likesCount fields
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const API = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("token");
      const userId = getUserIdFromStorageOrToken();

      const res = await axios.get(`${API}/post/allpost`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // handle different shapes: res.data.posts or res.data itself is array
      const posts = Array.isArray(res.data) ? res.data : res.data.posts || res.data.data || [];
       console.log(posts)
      const updated = posts.map((p) => ({
        ...p,
        likesCount: normalizeCount(p.likes),
        liked: userInLikes(p.likes, userId),
      }));

      setData({ posts: updated });
    } catch (err) {
      console.error("fetchPosts error:", err.response?.data || err.message || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Like/unlike with optimistic UI + rollback on error (refetch)
  const handleLike = async (postId) => {
    const token = localStorage.getItem("token");
    const API = import.meta.env.VITE_API_URL;
    const userId = getUserIdFromStorageOrToken();

    // Optimistic update
    setData((prev) => ({
      ...prev,
      posts: prev.posts.map((p) => {
        if (p._id !== postId) return p;
        const newLiked = !p.liked;
        const newCount = newLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1);
        return { ...p, liked: newLiked, likesCount: newCount };
      }),
    }));

    try {
      const res = await axios.post(
        `${API}/post/${postId}/likes`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Server may return likes as array or number, and liked boolean
      const serverLikes = res.data?.likes ?? res.data;
      const serverLiked = typeof res.data?.liked === "boolean" ? res.data.liked : userInLikes(serverLikes, userId);
      const serverCount = normalizeCount(serverLikes);

      setData((prev) => ({
        ...prev,
        posts: prev.posts.map((p) =>
          p._id === postId ? { ...p, likes: serverLikes, likesCount: serverCount, liked: serverLiked } : p
        ),
      }));
    } catch (err) {
      console.error("handleLike error:", err.response?.data || err.message || err);
      // rollback by refetching posts (simple and reliable)
      fetchPosts();
    }
  };

  return (
    <div className="h-auto w-full sm:ml-23 sm:pl-0 pl-8">
      <Story />
      <div className="sm:w-[50vw] w-[82%] h-auto ml-8 sm:mt-5 gap-5 sm:pt-10 sm:p-15 px-5 flex flex-col">
        {loading && <div className="ml-6">Loading posts...</div>}

        {Array.isArray(data.posts) &&
          data.posts.map((item) => (
            <div key={item._id} className="flex flex-col gap-2">
              {/* Profile */}
              <div 
              onClick={()=>{navigate(`/:${item.user._id}/userprofile`) , setId(item.user._id)}}
              className="sm:w-[20vw]  h-auto flex gap-2 cursor-pointer">
                <div className="sm:w-10 w-10 sm:h-10 h-10 rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
                  <div className="w-full h-full rounded-full bg-white p-[2px]">
                    <img
                      src={item.user?.profile?.image || "profile.png"}
                      alt="profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>
                <p className="sm:text-sm text-[12px] font-[500] mt-3">{item.user?.username}</p>
              </div>

              {/* Post image */}
              <div className="w-auto h-auto rounded hover:shadow-xl hover:scale-102 transform transition duration-300">
                <img className="object-container rounded w-full h-full" src={item.image} alt="" />
              </div>

              {/* Like/Comment/Share */}
              <div className="flex w-[40vw] h-[5vh] gap-5 ml-4 sm:mt-2">
                <div className="sm:w-10 w-5 h-full" onClick={() => handleLike(item._id)} role="button" tabIndex={0}>
                    {console.log(item.liked )}
                  {item.liked ? (
                    <img className="sm:w-9 w-6 sm:h-9 h-5 cursor-pointer" src="love (1).png" alt="liked" />
                  ) : (
                    <img className="sm:w-9 w-5 sm:h-9 h-5 cursor-pointer" src="love.png" alt="unliked" />
                  )}
                </div>
                <img className="sm:w-7 w-4  sm:h-7 h-4 cursor-pointer" src="chat.png" alt="chat" />
                <img className="sm:w-7 w-4 sm:h-7 h-4 cursor-pointer" src="share.png" alt="share" />
                <img className="sm:w-6 w-3 sm:h-6 h-3 sm:ml-70" src="bookmark.png" alt="bookmark" />
              </div>

              {/* Likes count */}
              <div className="sm:text-md text-sm ml-6">{item.likesCount || 0} likes</div>
              <div className="sm:text-sm text-[12px] ml-6 -mt-2 text-[#737373]">view all comments</div>
              <div className="sm:w-[40vw] w-auto mt-5 border-1 border-[#dbdbdb]"></div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Video;
