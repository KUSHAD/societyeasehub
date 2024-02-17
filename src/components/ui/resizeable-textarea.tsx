import React, { useEffect, useRef, useState, useId } from "react";
import { Textarea } from "./textarea";
import { cn } from "~/lib/utils";

interface ResizableTextareaProps
  extends Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    "onChange" | "value" | "id"
  > {
  onMessageSubmit: (message: string) => void;
  placeholder?: string;
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  value?: string;
}

const ResizableTextarea: React.FC<ResizableTextareaProps> = ({
  onMessageSubmit,
  placeholder,
  className,
  onChange: customOnChange,
  value: customValue,
  ...textareaProps
}) => {
  const [message, setMessage] = useState<string>(customValue ?? "");
  const [inputRows, setInputRows] = useState<number>(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const id = useId();

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
    if (customOnChange) customOnChange(event);
    adjustInputRows();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    } else if (event.key === "Enter" && event.shiftKey) {
      adjustInputRows();
    }
  };

  const sendMessage = () => {
    if (message.trim() !== "") {
      onMessageSubmit(message);
      setMessage("");
      setInputRows(1);
    }
  };

  const adjustInputRows = () => {
    const textareaElement = document.getElementById(id);
    if (textareaElement) {
      const newRows = Math.min(textareaElement.scrollHeight / 20, 2);
      setInputRows(newRows);
    }
  };

  useEffect(() => {
    adjustInputRows();
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.scrollTop = textarea.scrollHeight;
    }
  }, [message, id]);

  return (
    <Textarea
      id={id}
      ref={textareaRef}
      rows={inputRows}
      value={message}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className={cn("resize-none overflow-y-auto", className)}
      {...textareaProps}
    />
  );
};

export default ResizableTextarea;
