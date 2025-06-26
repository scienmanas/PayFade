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
  submissionStatus: "submitted" | "submitting" | null;
  formData: {
    websiteName: string | null;
    websiteDomain: string | null;
  };
  verificationHandler: {
    id: string | null;
    code: string | null;
    status: null | "verifyingMode" | "verifying" | "verified" | "failed";
  };
  globalComponentError: null | string;
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
      type: "SET_ERROR";
      field: keyof createRecordStateType;
      value: string | null;
    }
  | {
      type: "SET_VERIFICATION";
      field: keyof createRecordStateType["verificationHandler"];
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
      case "SET_ERROR":
        return {
          ...state,
          [action.field]: action.value,
        };
      case "SET_VERIFICATION":
        return {
          ...state,
          verificationHandler: {
            ...state.verificationHandler,
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
    submissionStatus: null,
    formData: {
      websiteName: null,
      websiteDomain: null,
    },
    verificationHandler: {
      code: null,
      status: null,
      id: null,
    },
    globalComponentError: null,
  };

  // Hooks, refs and reducers
  const [state, dispatch] = useReducer(reducer, initialState);
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
  // Hooks
  const { setRecords } = useRecordsList();

  // Function to handle form submission
  async function handleFormSubmission(e: React.FormEvent<HTMLFormElement>) {
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

    // Validate form data
    const validation = formSchema.safeParse(parsedData);
    if (!validation.success) {
      const errors = validation.error.flatten();
      // Set form errors based on validation results
      dispatch({
        type: "SET_ERROR",
        field: "globalComponentError",
        value: errors.fieldErrors.websiteName?.[0] || null,
      });
      dispatch({
        type: "SET_ERROR",
        field: "globalComponentError",
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
        const responseData = await response.json();
        const recordsFromResponse = responseData.record;
        // Update the data
        setRecords((prev) => [
          ...(prev || []),
          {
            id: recordsFromResponse.id,
            apiKey: recordsFromResponse.apiKey as string,
            createdAt: recordsFromResponse.createdAt as string,
            hits: recordsFromResponse.hits as number,
            verified: false,
            websiteDomain: parsedData.websiteDomain,
            websiteName: parsedData.websiteName,
          },
        ]);
        // Verification state update
        dispatch({
          type: "SET_VERIFICATION",
          field: "id",
          value: recordsFromResponse.id as string,
        });
        dispatch({
          type: "SET_VERIFICATION",
          field: "code",
          value: recordsFromResponse.verificationCode as string,
        });
        dispatch({
          type: "SET_VERIFICATION",
          field: "status",
          value: "verifyingMode",
        });
        // To stop loading state
        dispatch({
          type: "SET_FIELD",
          field: "submissionStatus",
          value: "submitted",
        });
        console.log(state);
      } else {
        dispatch({
          type: "SET_ERROR",
          field: "globalComponentError",
          value: "Some error occured, please try again",
        });
      }
    } catch (error) {
      console.log("Error", error);
      dispatch({
        type: "SET_ERROR",
        field: "globalComponentError",
        value: "Some error occured, please try again",
      });
      dispatch({
        type: "SET_FIELD",
        field: "submissionStatus",
        value: null,
      });
    }
  }

  // Perform Verification
  async function handleDomainVerification(
    e: React.MouseEvent<HTMLFormElement>
  ) {
    // Default and state update
    e.preventDefault();
    dispatch({ type: "SET_VERIFICATION", field: "status", value: "verifying" });

    // Get the form data
    const formData = new FormData(e.target as HTMLFormElement);
    const id: string = formData.get("id") as string;

    // Check the id is there or not
    if (!id)
      dispatch({
        type: "SET_ERROR",
        field: "globalComponentError",
        value: "Credentials error, please refresh!",
      });

    try {
      const response = await fetch("/api/records", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id: id as string,
        }),
      });

      // display message accordingly received from the response
      
    } catch (error) {}
  }

  return (
    <div
      className={`create-record-form top-0 left-0 fixed z-40 w-dvw h-dvh items-center justify-center ${
        state.isFormOpen ? "flex" : "hidden"
      }`}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10"></div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: state.isFormOpen ? 1 : 0,
          y: state.isFormOpen ? 0 : -20,
        }}
        transition={{ duration: 0.3 }}
        className="w-[290px] sm:w-[360px] h-fit px-4 py-5 bg-white rounded-lg shadow-sm shadow-neutral-400 absolute z-20 flex flex-col gap-4"
      >
        {/* Input form - POST */}
        <form
          className="w-full h-fit flex flex-col items-start gap-6"
          ref={formRef}
          onSubmit={handleFormSubmission}
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
                value={state.formData.websiteName ?? ""}
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
            <label
              htmlFor="websiteDomain"
              className="name relative w-fit h-fit"
            >
              <input
                autoComplete="off"
                minLength={5}
                disabled={
                  state.submissionStatus === "submitting" ||
                  state.submissionStatus === "submitted"
                }
                required
                value={state.formData.websiteDomain ?? ""}
                placeholder="google.com or api.google.com"
                type="text"
                name="websiteDomain"
                onClick={() => {
                  // Resetting the error state when the user clicks on the input
                  formRef.current?.reset(); // Ensure form is reset completely
                  dispatch({
                    type: "SET_ERROR",
                    field: "globalComponentError",
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
                className={`relative z-10 rounded-md px-3 py-2 border-2 border-neutral-300  w-64 h-11 bg-white text-sm sm:text-base outline-none hover:border-[#2e2a54] focus:border-[#2e2a54] duration-300 text-neutral-800 placeholder:text-neutral-40`}
              />
              <div className="placeholder absolute z-20 top-0 left-0 translate-x-2 text-sm -translate-y-[9px] px-[3px] w-fit h-fit duration-100 bg-white text-neutral-800">
                Domain
              </div>
            </label>
            {/* Error message display */}
            {state.globalComponentError && (
              <div className="error-message">
                {state.globalComponentError && (
                  <p className="text-red-600 font-bold text-sm text-wrap">
                    {state.globalComponentError}
                  </p>
                )}
              </div>
            )}
            {/* Submission button */}
            {state.submissionStatus !== "submitted" && (
              <button
                type="submit"
                className={`bg-black w-fit h-fit px-4 py-1 rounded-lg ${
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
        </form>
        {/* Verification details and button */}
        {state.verificationHandler.status !== null ? (
          <form
            onSubmit={handleDomainVerification}
            className="verification-items-and-button w-fit h-fit flex flex-col gap-3"
          >
            <div className="verification-instructions-and-code flex flex-col gap-2">
              <p className="text-sm">
                Add the below id to TXT record in your DNS settings.
              </p>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={state.verificationHandler.code as string}
                  className="font-mono bg-gray-100 px-2 py-1 rounded"
                />
                <input
                  type="text"
                  name="id"
                  className="hidden"
                  readOnly
                  aria-hidden
                  value={state.verificationHandler.code as string}
                ></input>
                <button
                  type="button"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    const btn = e.currentTarget;
                    // Copy the text to clip board
                    navigator.clipboard.writeText(
                      state.verificationHandler.code as string
                    );
                    // Swap the label
                    const originalLabel = btn.textContent;
                    btn.textContent = "Copied!";
                    // Restore after 3 seconds
                    window.setTimeout(() => {
                      if (originalLabel !== null)
                        btn.textContent = originalLabel;
                    }, 2000);
                  }}
                  className="py-1 px-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Copy
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="verify-button w-fit h-fit py-1 px-3 font-bold bg-black text-white rounded"
            >
              {state.verificationHandler.status === "verifyingMode"
                ? "Verify"
                : state.verificationHandler.status === "verifying"
                ? "Verifying..."
                : state.verificationHandler.status === "verified"
                ? "Verified"
                : "Verify"}
            </button>
          </form>
        ) : null}
      </motion.div>
    </div>
  );
}
