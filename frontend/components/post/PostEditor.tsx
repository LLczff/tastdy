"use client";

import {
  useReducer,
  useEffect,
  useRef,
  createContext,
  Dispatch,
  useState,
  FormEvent,
} from "react";
import { NextPage } from "next";
// Type
import { Category, ErrorMessage } from "@/types";
import { PostEditorProps } from "@/types/props";
import { PostUpdateType, PostState, PostAction } from "@/types/post";
// Component
import ImageUploader from "@/components/editor/ImageUploader";
import DishField from "@/components/editor/DishField";
import CategoryRadio from "@/components/editor/CategoryRadio";
import IngredientList from "@/components/editor/IngredientList";
import ProcedureEditor from "@/components/editor/ProcedureEditor";
import PostReview from "@/components/post/PostReview";
import Modal from "@/components/Modal";
import Loading from "@/components/Loading";
// Server
import { createRecipe, updateRecipe } from "@/app/actions";
// Utility
import { isArrayEqual } from "@/utils";

const reducer = (state: PostState, action: PostAction) => {
  switch (action.type) {
    case PostUpdateType.DISH:
      return { ...state, dish: action.payload };
    case PostUpdateType.CATEGORY:
      return { ...state, category: action.payload };
    case PostUpdateType.INGREDIENT:
      return { ...state, ingredients: action.payload };
    case PostUpdateType.PROCEDURE:
      return { ...state, procedures: action.payload };
    case PostUpdateType.IMAGE:
      return { ...state, image: action.payload };
    case PostUpdateType.IMAGE_NAME:
      return { ...state, imageName: action.payload };
    default:
      return state;
  }
};

export const EditorContext = createContext<
  Dispatch<PostAction> | Dispatch<void>
>(() => {});

const PostEditor: NextPage<PostEditorProps> = ({ closeFunc, post }) => {
  // state
  const initialState: PostState = {
    dish: post?.dish ?? "",
    image: post?.image ?? "",
    category: post?.category ?? Category.MainDish,
    ingredients: post?.ingredients ?? [],
    procedures: post?.procedures ?? [],
    imageName: post?._id
      ? `${post.dish}_${Date.parse(post.createdAt)}.jpg`
      : "",
  };
  // state
  const [state, dispatch] = useReducer(reducer, initialState);
  const [stage, setStage] = useState<"edit" | "review">("edit");
  const [warningModalOpen, setWarningModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  // ref
  const modalRef = useRef<HTMLDivElement>(null);

  // DOM cannot be access via SSR
  // we need to make this as client component and use useEffect hook
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const renderHeader = () => {
    switch (stage) {
      case "edit":
        return post?._id ? "Modify your Recipe" : "Make your Recipe";
      case "review":
        return post?._id ? "Review your changes" : "Review your Recipe";
      default:
        return "";
    }
  };

  const handleDiscard = () => {
    // Check if user has edit the content
    const keys = Object.keys(initialState);
    for (let i = 0; i < keys.length; i++) {
      // typescript not allow passing string key to strict object
      const stateKey = keys[i] as keyof PostState;
      if (["dish", "image", "category"].includes(stateKey)) {
        // string comparison
        if (initialState[stateKey] !== state[stateKey]) {
          setWarningModalOpen(true);
          return;
        }
      } else if (stateKey === "ingredients" || stateKey === "procedures") {
        // array comparision
        if (!isArrayEqual(initialState[stateKey], state[stateKey])) {
          setWarningModalOpen(true);
          return;
        }
      }
    }

    // if not, close the modal
    closeFunc();
  };

  const isStateEmpty = () => {
    return (
      state.dish === "" ||
      state.image === "" ||
      state.ingredients.length === 0 ||
      state.procedures.length === 0
    );
  };

  const isSubmitDisable = () => {
    if (isStateEmpty()) return true;

    if (post?._id)
      return (
        state.dish === initialState.dish &&
        state.image === initialState.image &&
        state.imageName === initialState.imageName &&
        isArrayEqual(state.ingredients, initialState.ingredients) &&
        isArrayEqual(state.procedures, initialState.procedures)
      );
    else
      return (
        state.dish === initialState.dish ||
        state.image === initialState.image ||
        isArrayEqual(state.ingredients, initialState.ingredients) ||
        isArrayEqual(state.procedures, initialState.procedures)
      );
  };

  const handleNextStage = (event: React.MouseEvent) => {
    // Although its type button, the form is somehow refresh
    event.preventDefault(); // so we need this line
    if (!isSubmitDisable()) setStage("review");
  };

  const handleClickOutside = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const target = event.target as HTMLElement;

    if (modalRef.current && !modalRef.current.contains(target)) handleDiscard();
  };

  // the state is complicate, we cannot rely on server action
  async function handleSubmit(event: FormEvent): Promise<void> {
    event.preventDefault();
    try {
      setLoading(true);
      if (post?._id) await updateRecipe(post._id, state);
      else await createRecipe(state);
    } catch (error) {
      throw new Error(ErrorMessage.ServerError);
    } finally {
      setLoading(false);
    }
    closeFunc();
  }

  return (
    <div className="modal-bg py-10" onClick={(e) => handleClickOutside(e)}>
      <section
        ref={modalRef}
        className="bg-white py-3 px-3 rounded-sm w-full h-full max-h-fit overflow-x-scroll max-w-lg 
        md:max-w-3xl lg:max-w-5xl transition-all"
      >
        <h2 className="text-2xl font-semibold text-center mb-3">
          {renderHeader()}
        </h2>
        <form
          className="flex flex-col gap-3"
          autoComplete="off"
          // action={formAction}
          onSubmit={handleSubmit}
        >
          {stage === "edit" ? (
            <>
              <EditorContext.Provider value={dispatch}>
                <ImageUploader
                  image={state.image}
                  imageName={state.imageName}
                />
                <DishField dish={state.dish} />
                <CategoryRadio category={state.category} />
                <IngredientList ingredients={state.ingredients} />
                <ProcedureEditor procedures={state.procedures} />
              </EditorContext.Provider>
              <div className="flex gap-2">
                <button
                  className="btn-secondary w-full"
                  type="button"
                  onClick={handleDiscard}
                >
                  Discard
                </button>
                <button
                  className="btn-primary w-full disabled:bg-gray-300"
                  type="button"
                  onClick={(e) => handleNextStage(e)}
                  disabled={isSubmitDisable()}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <>
              <PostReview {...state} />
              <p className="text-red-500 text-sm">{errorMessage}</p>
              <div className="flex gap-2">
                <button
                  className="btn-secondary w-full"
                  type="button"
                  onClick={() => setStage("edit")}
                >
                  Previous
                </button>
                <button
                  className="btn-primary w-full disabled:select-none disabled:cursor-default disabled:bg-gray-300"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <Loading /> : <span>Confirm</span>}
                </button>
              </div>
            </>
          )}
        </form>
        {/* Warning discard modal */}
        {warningModalOpen && (
          <Modal className="max-w-72">
            <h3 className="text-center text-xl font-semibold mb-2">
              Discard post?
            </h3>
            <p className="text-center text-sm font-light mb-3">
              If you leave, your edit won't be saved.
            </p>
            <div className="flex gap-2">
              <button
                className="btn-secondary w-full"
                type="button"
                onClick={() => setWarningModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn-danger w-full"
                type="button"
                onClick={closeFunc}
              >
                Discard
              </button>
            </div>
          </Modal>
        )}
      </section>
    </div>
  );
};

export default PostEditor;
