import { useHistory } from "react-router-dom";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";

const Signup = () => {
  const history = useHistory();
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [cpassword, setcpassword] = useState("");
  const [show, setshow] = useState(false);
  const [show1, setshow1] = useState(false);
  const [pic, setpic] = useState("");
  const [loading, setloading] = useState(false);
  const toast = useToast();
  const handleshow = () => {
    setshow(!show);
  };
  const handleshow1 = () => {
    setshow1(!show1);
  };

  const postdetails = (pics) => {
    setloading(true);
    if (pics === undefined) {
      toast({
        title: "select an image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (
      pics.type === "image/jpeg" ||
      pics.type === "image/png" ||
      pics.type === "image/jpg" ||
      pics.type === "image/svg"
    ) {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "sociocon");
      data.append("cloud_name", "cm33yash");
      fetch("https:api.cloudinary.com/v1_1/cm33yash/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setpic(data.url.toString());
          console.log(data.url.toString());
          setloading(false);
        })
        .catch((err) => {
          console.log(err);
          setloading(false);
        });
    } else {
      toast({
        title: "select file of type image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
  };
  const handlesubmit = async () => {
    setloading(true);
    if (!name || !email || !password || !cpassword) {
      toast({
        title: "Fill all fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      setloading(false);
      return;
    }
    if (password !== cpassword) {
      toast({
        title: "password and confirm password not matching",
        status: "warning",
        duration: "3000",
        isClosable: true,
        position: "top",
      });
      setloading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "http://localhost:5000/user/register",
        {
          name,
          email,
          password,
          profilepic: pic,
        },
        config
      );
      console.log(data);
      toast({
        title: "Registration done !!",
        isClosable: true,
        duration: 3000,
        status: "success",
        position: "top",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setloading(false);
      history.push("/chat");
    } catch (error) {
      toast({
        title: "Error occured",
        description: error.response.data.message,
        status: "error",
        duration: "3000",
        isClosable: true,
        position: "top",
      });
      setloading(false);
    }
  };
  return (
    <VStack spacing="5px">
      <FormControl id="name" isRequired>
        <FormLabel r>Name</FormLabel>
        <Input
          placeholder="Enter your name"
          onChange={(e) => setname(e.target.value)}
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your email"
          onChange={(e) => setemail(e.target.value)}
        />
      </FormControl>

      <FormControl id="pasword" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            placeholder="Enter your password"
            type={show ? "text" : "password"}
            onChange={(e) => setpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleshow}>
              {show ? "hide" : "show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="cpassword" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            placeholder="confirm password"
            type={show1 ? "text" : "password"}
            onChange={(e) => setcpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleshow1}>
              {show1 ? "hide" : "show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="pic">
        <FormLabel>Profile Pic</FormLabel>
        <Input
          type={"file"}
          p={1.5}
          accept="image/*"
          placeholder="Enter your name"
          onChange={(e) => postdetails(e.target.files[0])}
        />
      </FormControl>

      <Button
        colorScheme="linkedin"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={handlesubmit}
        isLoading={loading}
      >
        Signup
      </Button>
    </VStack>
  );
};

export default Signup;
