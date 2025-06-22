"use client";

import { firaSansFont } from "@/app/lib/fonts";
import { IoCreateOutline } from "react-icons/io5";
import { useReducer, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useRecordsList } from "@/app/hooks/useRecordsList";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { z } from "zod";
import { website } from "@/db/schema";

interface createRecordStateType {
  isFormOpen: boolean;
  isPostRequestSuccess: boolean;
  submissionStatus: "submitted" | "submitting" | null;
  formData: {
    websiteName: string | null;
    websiteDomain: string | null;
  };
  formError: {
    websiteName: string | null;
    websiteDomain: string | null;
  };
}

type Action =
  | {
      type: "SET_FIELD";
      field: keyof createRecordStateType;
      value: string | boolean | null;
    }
  | {
      type: "SET_FORM_DATA";
      field: keyof createRecordStateType["formData"];
      value: string;
    }
  | {
      type: "SET_FORM_ERROR";
      field: keyof createRecordStateType["formError"];
      value: string | null;
    }
  | { type: "RESET" };

export function CreateRecord() {
  // function for reducer
  function reducer(state: createRecordStateType, action: Action) {
    switch (action.type) {
      case "SET_FIELD":
        return {
          ...state,
          [action.field]: action.value,
        };
      case "SET_FORM_DATA":
        return {
          ...state,
          formData: {
            ...state.formData,
            [action.field]: action.value,
          },
        };
      case "SET_FORM_ERROR":
        return {
          ...state,
          formError: {
            ...state.formError,
            [action.field]: action.value,
          },
        };
      case "RESET":
        return initialState;
      default:
        return state;
    }
  }

  // States, reducers, and refs
  const initialState: createRecordStateType = {
    isFormOpen: false,
    isPostRequestSuccess: false,
    submissionStatus: null,
    formData: {
      websiteName: null,
      websiteDomain: null,
    },
    formError: {
      websiteName: null,
      websiteDomain: null,
    },
  };

  // Hooks, refs and reducers
  const [state, dispatch] = useReducer(reducer, initialState);
  const { setRecords } = useRecordsList();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <section
      className={`create-record relative w-full h-fit flex flex-col gap-6 ${firaSansFont.className}`}
    >
      <div className="heading-description-stuff w-fit h-fit flex flex-col gap-2 relative">
        <h2 className="heading w-fit h-fit text-xl sm:text-2xl font-bold">
          Create a Record
        </h2>
        <p className="description w-fit h-fit">
          Hey Buddy :), you finally ready to begin? Let your work be rewarded,
          let you be rewarded, you deserve it buddy. We are like your bros who
          will help you to get your ex back, yeah but here ex refers to your
          work. Sorry for bad jokes :)
        </p>
      </div>
      <button
        onClick={() => {
          document.body.style.overflow = "hidden"; // Prevent scrolling when form is open
          dispatch({ type: "SET_FIELD", field: "isFormOpen", value: true });
        }}
        type="button"
        className="w-fit h-fit bg-[#2e2a54] text-neutral-100 font-bold px-4 py-2 rounded-md hover:bg-[#3c376b] transition-colors duration-200 flex flex-row items-center gap-1 justify-center"
      >
        <IoCreateOutline className="text-lg" />
        <span className="text-neutral-100">Create</span>
      </button>
      <CreateRecordForm dispatch={dispatch} formRef={formRef} state={state} />
    </section>
  );
}

function CreateRecordForm({
  dispatch,
  formRef,
  state,
}: {
  dispatch: React.Dispatch<Action>;
  formRef: React.RefObject<HTMLFormElement | null>;
  state: createRecordStateType;
}) {
  // Function to handle form submission
  function handleFormSubmission(e: React.FormEvent<HTMLFormElement>) {
    // Prevent default form submission behavior and initial states handling
    e.preventDefault();

    if (
      state.submissionStatus === "submitting" ||
      state.submissionStatus === "submitted"
    )
      return; // Prevent multiple submissions
    dispatch({
      type: "SET_FIELD",
      field: "submissionStatus",
      value: "submitting",
    });

    // Form validation with Zod
    const formSchema = z.object({
      websiteName: z
        .string()
        .min(5, "Website name must be at least 5 characters long"),
      websiteDomain: z
        .string()
        .regex(
          /^(?!https?:\/\/)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i,
          { message: "Must be a bare hostname (e.g. shop.example.com)" }
        ),
    });

    const formData = new FormData(e.target as HTMLFormElement);
    const parsedData = {
      websiteName: formData.get("websiteName") as string,
      websiteDomain: formData.get("websiteDomain") as string,
    };

    console.log(formData);

    // Validate form data
    const validation = formSchema.safeParse(parsedData);
    if (!validation.success) {
      const errors = validation.error.flatten();
      // Set form errors based on validation results
      dispatch({
        type: "SET_FORM_ERROR",
        field: "websiteName",
        value: errors.fieldErrors.websiteName?.[0] || null,
      });
      dispatch({
        type: "SET_FORM_ERROR",
        field: "websiteDomain",
        value: errors.fieldErrors.websiteDomain?.[0] || null,
      });
      dispatch({
        type: "SET_FIELD",
        field: "submissionStatus",
        value: null,
      });
      return; // Stop further execution if validation fails
    }

    // If validation passes, proceed with the submission
    try {
      const response = await fetch("api/records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          websiteName: parsedData.websiteName,
          websiteDomain: parsedData.websiteDomain,
        }),
      });

      if (response.status === 201) {
      }
    } catch (error) {
    } finally {
      
    }
  }

  // Handling outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        document.body.style.overflow = "auto"; // Re-enable scrolling when form is closed
        dispatch({ type: "RESET" });
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch, formRef]);

  return (
    <div
      className={`create-record-form top-0 left-0 fixed z-40 w-dvw h-dvh items-center justify-center ${
        state.isFormOpen ? "flex" : "hidden"
      }`}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10"></div>
      <motion.form
        ref={formRef}
        onSubmit={handleFormSubmission}
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: state.isFormOpen ? 1 : 0,
          y: state.isFormOpen ? 0 : -20,
        }}
        transition={{ duration: 0.3 }}
        className="w-[290px] sm:w-[360px] h-fit p-4 bg-white rounded-lg shadow-sm shadow-neutral-400 absolute z-20 flex flex-col gap-8"
      >
        <div className="upper-part w-full h-fit flex flex-row gap-4 items-center justify-between">
          <h1 className="heading text-xl text-black font-extrabold">
            Create a Record
          </h1>
          <button
            onClick={() => {
              document.body.style.overflow = "auto"; // Re-enable scrolling when form is closed
              dispatch({ type: "RESET" });
            }}
            type="button"
            className="w-fit h-fit"
          >
            <IoIosCloseCircleOutline className="text-black text-xl" />
          </button>
        </div>
        <div className="submission-fields w-fit h-fit relative flex flex-col gap-4">
          {/* Website Name */}
          <label htmlFor="websiteName" className="name relative w-fit h-fit">
            <input
              autoComplete="off"
              minLength={5}
              disabled={
                state.submissionStatus === "submitting" ||
                state.submissionStatus === "submitted"
              }
              required
              placeholder="Amazon"
              type="text"
              name="websiteName"
              onChange={(e) =>
                dispatch({
                  type: "SET_FORM_DATA",
                  field: "websiteName",
                  value: e.target.value,
                })
              }
              className="relative z-10 rounded-md px-3 py-2 border-2 border-neutral-300  w-64 h-11 bg-white text-sm sm:text-base outline-none hover:border-[#2e2a54] focus:border-[#2e2a54] duration-300 text-neutral-800 placeholder:text-neutral-400"
            />
            <div className="placeholder absolute z-20 top-0 left-0 translate-x-2 text-sm -translate-y-[9px] px-[3px] w-fit h-fit duration-100 bg-white text-neutral-800">
              Website Name
            </div>
          </label>
          {/* Website Domain */}
          <label htmlFor="websiteDomain" className="name relative w-fit h-fit">
            <input
              autoComplete="off"
              minLength={5}
              disabled={
                state.submissionStatus === "submitting" ||
                state.submissionStatus === "submitted"
              }
              required
              placeholder="google.com or api.google.com"
              type="text"
              name="websiteDomain"
              onClick={() => {
                // Resetting the error state when the user clicks on the input
                dispatch({
                  type: "SET_FORM_ERROR",
                  field: "websiteDomain",
                  value: null,
                });
              }}
              onChange={(e) =>
                dispatch({
                  type: "SET_FORM_DATA",
                  field: "websiteDomain",
                  value: e.target.value,
                })
              }
              className={`relative z-10 rounded-md px-3 py-2 border-2 border-neutral-300  w-64 h-11 bg-white text-sm sm:text-base outline-none hover:border-[#2e2a54] focus:border-[#2e2a54] duration-300 text-neutral-800 placeholder:text-neutral-400 ${
                state.formError.websiteDomain ? "border-red-500" : ""
              }`}
            />
            <div className="placeholder absolute z-20 top-0 left-0 translate-x-2 text-sm -translate-y-[9px] px-[3px] w-fit h-fit duration-100 bg-white text-neutral-800">
              Domain
            </div>
          </label>
          {/* Error message display */}
          {state.formError.websiteDomain && (
            <div className="error-message">
              {state.formError.websiteDomain && (
                <p className="text-red-600 font-bold text-sm text-wrap">
                  {state.formError.websiteDomain}
                </p>
              )}
            </div>
          )}
          {/* Submission button */}
          {state.submissionStatus !== "submitted" && (
            <button
              type="submit"
              className={`bg-black w-fit h-fit px-4 py-2 rounded-lg ${
                state.submissionStatus === "submitting"
                  ? "cursor-not-allowed opacity-45"
                  : "cursor-pointer"
              }`}
            >
              {state.submissionStatus === "submitting" ? (
                <span className="text-neutral-100 font-semibold ">
                  Submitting...
                </span>
              ) : (
                <span className="text-neutral-100 font-semibold">Submit</span>
              )}
            </button>
          )}
        </div>
      </motion.form>
    </div>
  );
}
