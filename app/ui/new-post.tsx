"use client";

import { useState, useRef, useEffect } from "react";
import Post from "@/app/ui/post";

export default function NewPost() {
  const [preview, setPreview] = useState(false);
  const [content, setContent] = useState("");
  const cursorPos = useRef(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handlePreview(formdata: FormData) {
    if (!preview && textareaRef.current) {
      cursorPos.current = textareaRef.current.selectionStart;
    }
    setPreview(!preview);
    if (!preview) {
      setContent(formdata.get("content") as string);
    }
  }

  function handleTab(keyPressed: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (keyPressed.key === "Tab") {
      keyPressed.preventDefault();
      const textarea = keyPressed.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const tab = "  ";
      textarea.value =
        textarea.value.substring(0, start) +
        tab +
        textarea.value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + tab.length;
    }
  }

  useEffect(() => {
    if (!preview && textareaRef.current) {
      textareaRef.current.selectionStart = cursorPos.current;
      textareaRef.current.selectionEnd = cursorPos.current;
    }
  }, [preview]);

  return (
    <div className="border-t rounded-xl border-gray-300 h-full">
      <form action={handlePreview} className="h-full prose prose-white max-w-none">
        <button type="submit">Preview</button>
        {!preview && <label htmlFor="content"></label>}
        {!preview && (
          <textarea
            ref={textareaRef}
            name="content"
            autoFocus
            defaultValue={content}
            className="resize-none outline-hidden h-full w-full tab-2"
            onKeyDown={handleTab}
          />
        )}
        {preview && <Post content={content} className="w-full h-full" />}
      </form>
    </div>
  );
}
