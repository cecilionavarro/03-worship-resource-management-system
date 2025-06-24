import { login } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    mutate: createAccount,
    isPending,
    isError,
  } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate("/", {
        replace: true,
      });
    },
  });
  return <div>Register</div>;
};

export default Register;
