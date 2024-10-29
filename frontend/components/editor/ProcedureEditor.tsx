"use client";

import { useState, useContext } from "react";
import { NextPage } from "next";
// Type
import { PostFields, PostUpdateType } from "@/types/post";
// Component
import { EditorContext } from "@/components/post/PostEditor";
// Icon
import { IoCloseOutline } from "react-icons/io5";

// Props is based on input, so we declare in the component
type EditorProps = {
  procedures: string[];
};

const ProcedureEditor: NextPage<EditorProps> = (state) => {
  const dispatch = useContext(EditorContext);
  const [input, setInput] = useState<string>("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editInput, setEditInput] = useState<string>("");

  const addTag = (event: React.KeyboardEvent) => {
    event.preventDefault();
    if (input.trim() && !state.procedures.includes(input.trim())) {
      dispatch({
        type: PostUpdateType.PROCEDURE,
        payload: [...state.procedures, input.trim()],
      });
      setInput("");
    }
  };

  const removeTag = (index: number) => {
    dispatch({
      type: PostUpdateType.PROCEDURE,
      payload: state.procedures.filter((_, i) => i !== index),
    });
  };

  const startEditing = (index: number) => {
    setEditIndex(index);
    setEditInput(state.procedures[index]);
  };

  const saveEdit = (index: number) => {
    if (editInput.trim()) {
      const newTags = [...state.procedures];
      newTags[index] = editInput.trim();
      dispatch({
        type: PostUpdateType.PROCEDURE,
        payload: newTags,
      });
    }
    setEditIndex(null);
    setEditInput("");
  };

  const handleEditKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === "Enter") saveEdit(index);
  };

  return (
    <div>
      <p className="font-medium mb-2">Methods</p>
      <div className="flex flex-wrap gap-1">
        {state.procedures.map((procedure, idx) => (
          <div
            key={idx}
            className="flex w-full items-center rounded-sm px-2 py-1 border border-gray-100 
                has-[input:focus]:border-secondary transition-all duration-200"
          >
            {/* width spacing for remove button */}
            <p className="flex justify-start w-[calc(100%-28px)]">
              <span className="font-light text-secondary">
                {idx + 1}.&nbsp;
              </span>
              {/* width spacing for number */}
              {editIndex === idx ? (
                <input
                  type="text"
                  value={editInput}
                  onChange={(e) => setEditInput(e.target.value)}
                  onKeyDown={(e) => handleEditKeyDown(e, idx)}
                  onBlur={() => saveEdit(idx)}
                  className="inline-block w-[calc(100%-17.5px)] outline-none"
                  autoFocus
                />
              ) : (
                <span
                  onClick={() => startEditing(idx)}
                  className="inline-block cursor-text w-[calc(100%-17.5px)] break-words"
                >
                  {procedure}&nbsp;
                </span>
              )}
            </p>
            <button
              type="button"
              onClick={() => removeTag(idx)}
              className="px-1 hover:text-secondary transition-colors duration-200"
            >
              <IoCloseOutline size={20} />
            </button>
          </div>
        ))}
        {/* width coming from placeholder + plus icon */}
        <label
          htmlFor={PostFields.Procedures}
          className="relative flex w-full px-2 items-center border border-dashed rounded-sm 
            has-[input:focus]:border-secondary transition-all duration-200"
        >
          <span className="font-light text-secondary">
            {state.procedures.length + 1}.&nbsp;
          </span>
          <input
            type="text"
            id={PostFields.Procedures}
            name={PostFields.Procedures}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTag(e)}
            className="peer w-full py-1 rounded-sm outline-none placeholder:font-light placeholder:text-zinc-300"
            placeholder="Tell us how to cook the dish..."
          />
        </label>
      </div>
    </div>
  );
  //   return (
  //     <div className="max-w-full">
  //       <div className="flex flex-wrap gap-2 p-2 border rounded-lg focus-within:border-blue-500">
  //         {state.procedures.map((procedure, idx) => (
  //           <div
  //             key={idx}
  //             className="inline-block w-full p-2 bg-blue-100 rounded-lg text-blue-700 break-words"
  //           >
  //             <span className="mr-1 font-bold text-blue-700">{idx + 1}.</span>
  //             <span className="">{procedure}</span>
  //             {/* <button
  //               type="button"
  //               onClick={() => removeTag(idx)}
  //               className="ml-2 text-sm font-bold text-blue-700 hover:text-blue-900"
  //             >
  //               ×
  //             </button> */}
  //           </div>
  //         ))}
  //         <div className="flex items-center">
  //           <span className="mr-1 font-bold text-gray-500">
  //             {state.procedures.length + 1}.
  //           </span>
  //           <input
  //             type="text"
  //             value={input}
  //             onChange={(e) => setInput(e.target.value)}
  //             onKeyDown={(e) => e.key === "Enter" && addTag(e)}
  //             className="flex-grow p-1 outline-none min-w-[80px]"
  //             placeholder="Add a tag"
  //           />
  //         </div>
  //       </div>
  //     </div>
  //   );
};

export default ProcedureEditor;
