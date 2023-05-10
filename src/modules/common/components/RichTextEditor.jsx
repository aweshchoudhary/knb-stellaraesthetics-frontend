import React, { Suspense, useEffect, useState } from "react";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { convertToHTML } from "draft-convert";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const RichTextEditor = ({ setContent, clear, setIsClear, placeholder }) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  function handleClear() {
    setEditorState(EditorState.createEmpty());
    setIsClear(false);
  }

  useEffect(() => {
    if (clear) {
      handleClear();
    }
  }, [clear]);

  useEffect(() => {
    let html = convertToHTML(editorState.getCurrentContent());
    setContent(html);
  }, [editorState]);
  return (
    <Suspense>
      <Editor
        editorState={editorState}
        onEditorStateChange={setEditorState}
        placeholder={placeholder}
        toolbarClassName="toolbarClassName border bg-bg text-textColor"
        wrapperClassName="wrapperClassName w-full bg-bg"
        editorClassName="border px-3 min-h-[100px] bg-bg max-w-full overflow-x-auto"
      />
    </Suspense>
  );
};

export default RichTextEditor;
