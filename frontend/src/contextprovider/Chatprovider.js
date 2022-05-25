import React, { createContext, useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";

const Chatcontext = createContext();

const Chatprovider = ({ children }) => {
  const history = useHistory();
  const [userid, setuserid] = useState("");
  const [profilepic, setprofilepic] = useState("");
  const [isuser, setisuser] = useState(false);
  const [user, setuser] = useState();
  const [selectedchat, setselectedchat] = useState();
  const [chats, setchats] = useState([]);

  useEffect(() => {
    const userinfo = JSON.parse(localStorage.getItem("userInfo"));
    console.log(userinfo);
    setisuser(true);
    setuser(userinfo);
    // setprofilepic(userinfo.pic);
    // setuserid(userinfo.id);
    if (!userinfo) history.push("/");
  }, [history]);

  return (
    <Chatcontext.Provider
      value={{
        // profilepic,
        // setprofilepic,
        user,
        setuser,
        isuser,
        setisuser,
        selectedchat,
        setselectedchat,
        chats,
        setchats,
      }}
    >
      {children}
    </Chatcontext.Provider>
  );
};

export const Chatstate = () => {
  return useContext(Chatcontext);
};

export default Chatprovider;
