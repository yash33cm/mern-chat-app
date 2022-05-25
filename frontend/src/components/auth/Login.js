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
import axios from "axios";
import React, { useState } from "react";

const Login = () => {
  const history = useHistory();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [show, setshow] = useState(false);
  const [loading, setloading] = useState(false);
  const toast = useToast();
  const handleSubmit = async () => {
    setloading(true);
    if (!password || !email) {
      toast({
        title: "Fill all fields",
        duration: 3000,
        status: "warning",
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
        "http://localhost:5000/user/login",
        {
          email,
          password,
        },
        config
      );

      toast({
        title: "Login done !!",
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
        duration: 3000,
        status: "error",
        isClosable: true,
        position: "top",
      });
      setloading(false);
    }
  };
  return (
    <VStack spacing="5px">
      <FormControl id="emails" isRequired>
        <FormLabel>Email </FormLabel>
        <Input
          value={email}
          placeholder="Enter your registered Email"
          onChange={(e) => setemail(e.target.value)}
        />
      </FormControl>

      <FormControl id="passwords" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            value={password}
            placeholder="Enter your Password"
            onChange={(e) => setpassword(e.target.value)}
          ></Input>
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setshow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        width="100%"
        style={{ marginTop: 15 }}
        colorScheme="linkedin"
        onClick={handleSubmit}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        width="100%"
        style={{ marginTop: 15 }}
        colorScheme="green"
        onClick={() => {
          setemail("guest@example.com");
          setpassword("guest");
        }}
      >
        Try with Guest Credentials
      </Button>
    </VStack>
  );
};

export default Login;
