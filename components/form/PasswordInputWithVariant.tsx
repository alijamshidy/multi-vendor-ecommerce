"use client";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Dispatch, SetStateAction, useId, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function PasswordInputWithVariant({
  pass,
  setPass,
}: {
  pass?: string;
  setPass?: Dispatch<SetStateAction<string>>;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const id = useId();
  const [password, setPassword] = useState("");
  const toggleVisibility = () => setIsVisible(prevState => !prevState);
  const handlePassword = (str: string) => {
    setPassword(str);
    if (setPass) {
      setPass(str);
    }
  };
  return (
    <div className="relative mb-3">
      <Input
        required
        id={"password"}
        type={isVisible ? "text" : "password"}
        placeholder="Password"
        value={pass || password}
        onChange={e => handlePassword(e.target.value)}
        className="pr-9"
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleVisibility}
        className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent">
        {isVisible ? <EyeOffIcon /> : <EyeIcon />}
        <span className="sr-only">
          {isVisible ? "Hide password" : "Show password"}
        </span>
      </Button>
    </div>
  );
}
