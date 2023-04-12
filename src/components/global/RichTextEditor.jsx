import { EditorState, ContentState } from "draft-js";
import { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { convertToHTML } from "draft-convert";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const RichTextEditor = ({ setContent }) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  useEffect(() => {
    let html = convertToHTML(editorState.getCurrentContent());
    setContent(html);
  }, [editorState]);
  return (
    <div>
      <Editor
        editorState={editorState}
        onEditorStateChange={setEditorState}
        toolbarClassName="toolbarClassName border bg-bg text-textColor"
        wrapperClassName="wrapperClassName w-full bg-bg"
        editorClassName="border px-3 min-h-[100px] bg-bg max-w-full overflow-x-auto"
      />
    </div>
  );
};

export default RichTextEditor;
