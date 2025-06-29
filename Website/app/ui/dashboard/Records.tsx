"use client";

import Link from "next/link";
import { firaSansFont } from "@/app/lib/fonts";
import { useState, useEffect, useRef } from "react";
import { RecordsType } from "@/app/lib/definitions";
import { useRecordsList } from "@/app/hooks/useRecordsList";
import { Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import { IoIosCloseCircleOutline } from "react-icons/io";

// Hardcoded forever, can update when needed
const enforcementTypes = ["opacity"];

export function Records() {
  const { records, setRecords } = useRecordsList();
  const [mounted, setMounted] = useState<boolean>(false);
  const [finalLoadingStatus, setFinalLoadingStatus] = useState<
    null | "success" | "failed"
  >(null);
  // Confirmation and verification dialog box
  const [dialog, setDialog] = useState<null | {
    id: string;
    type: "delete" | "edit" | "verify";
    text: string | null;
    verification: {
      status: boolean;
      code: string | null;
    } | null;
    editData: {
      enforcementType: string;
      opacity: number;
    } | null;
  }>(null);

  // Fetch the records from the API
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch("/api/records", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.status === 200) {
          const data = await response.json();
          const recordsData = data.records;
          setRecords(recordsData);
          setFinalLoadingStatus("success");
        } else {
          setFinalLoadingStatus("failed");
          console.log("Failed to fetch records:", response.statusText);
          setRecords(null);
        }
      } catch (error) {
        setFinalLoadingStatus("failed");
        console.log("Error fetching records:", error);
        setRecords(null);
      } finally {
        setMounted(true);
      }
    };

    // Fetch the records
    fetchRecords();
  }, [setRecords]);

  // Manage useEffect for overflow/scroll - dialog box
  useEffect(() => {
    if (dialog != null) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [dialog]);

  return (
    <section
      className={`records relative w-full h-fit flex flex-col gap-4 ${firaSansFont.className}`}
    >
      <div className="heading-description-stuff w-fit h-fit flex flex-col gap-2">
        <h2 className="heading w-fit h-fit text-xl sm:text-2xl font-bold">
          Records
        </h2>
        <p className="description w-fit h-fit">
          Hi :), you can find all your added website here, please note that the
          website verification is needed which is done by DNS records to ensure
          you hold the domain to prevent abuse of the platform. Unverified
          website API keys will not work.
        </p>
      </div>
      <div className="records w-full h-fit">
        <RecordsTable
          records={records ? records : null}
          mounted={mounted}
          finalLoadingStatus={finalLoadingStatus}
          setDialog={setDialog}
        />
      </div>
      <Dialog dialog={dialog} setDialog={setDialog} setRecords={setRecords} />
    </section>
  );
}

// Dialog
function Dialog({
  dialog,
  setDialog,
  setRecords,
}: {
  dialog: {
    id: string;
    type: "edit" | "delete" | "verify";
    text: string | null;
    verification: {
      status: boolean;
      code: string | null;
    } | null;
    editData: {
      enforcementType: string;
      opacity: number;
    } | null;
  } | null;
  setDialog: React.Dispatch<
    React.SetStateAction<{
      id: string;
      type: "edit" | "delete" | "verify";
      text: string | null;
      verification: {
        status: boolean;
        code: string | null;
      } | null;
      editData: {
        enforcementType: string;
        opacity: number;
      } | null;
    } | null>
  >;
  setRecords: React.Dispatch<React.SetStateAction<RecordsType[] | null>>;
}) {
  // State for outside click
  const containerRef = useRef<HTMLDivElement>(null);
  const [promiseStatus, setPromiseStatus] = useState<{
    delete: string | null;
    verify: string | null;
    edit: string | null;
  }>({
    delete: null,
    verify: null,
    edit: null,
  });
  const [componentError, setComponentError] = useState<string | null>(null);

  // Handle Deletion
  async function handleRecordDeletion(
    event: React.MouseEvent<HTMLFormElement>
  ) {
    // Set promise status to pending
    event.preventDefault();
    setPromiseStatus((prev) => ({ ...prev, delete: "pending" }));

    // Parse the form data
    const formData = new FormData(event.target as HTMLFormElement);
    const id: string = formData.get("id") as string;

    if (!id) {
      setPromiseStatus((prev) => ({ ...prev, delete: "error" }));
      setComponentError("Issue in deletion, refresh and try again.");
      return;
    }

    try {
      // Delete the record
      const response = await fetch("/api/records", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id: id,
        }),
      });

      const data = await response.json();
      if (response.status === 200) {
        setPromiseStatus((prev) => ({ ...prev, delete: "success" }));
        // Remove the record from state
        setRecords((prevRecords) =>
          prevRecords ? prevRecords.filter((record) => record.id !== id) : null
        );
        setDialog(null); // To close the dialog
      } else {
        setPromiseStatus((prev) => ({ ...prev, delete: "error" }));
        setComponentError(
          data.message || "Some error occurred, refresh and try again."
        );
      }
    } catch (error) {
      console.log(error);
      setPromiseStatus((prev) => ({ ...prev, delete: "error" }));
      setComponentError("Issue in deletion, refresh and try again.");
    }
  }

  // Handle Verification
  async function handleDomainVerification(
    event: React.FormEvent<HTMLFormElement>
  ) {
    // States and loading states
    event.preventDefault();
    setPromiseStatus((prev) => ({ ...prev, verify: "verifying" }));

    // Get the formdata
    const formData = new FormData(event.target as HTMLFormElement);
    const id: string = formData.get("id") as string;

    // Check if the id is present
    if (!id) {
      setComponentError("Issue in verification, refresh and try again.");
      setPromiseStatus((prev) => ({ ...prev, verify: "error" }));
      return;
    }

    // Send the request
    try {
      const response = await fetch("/api/records", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id: id,
        }),
      });

      // Check the response
      const responseData = await response.json();
      if (response.status === 200) {
        // Update the states
        setRecords((prev) =>
          (prev || []).map(
            (rec) =>
              rec.id === id
                ? {
                    ...rec, // keep any old fields you don’t want to change
                    verified: true,
                  }
                : rec // otherwise leave it alone
          )
        );
        setPromiseStatus((prev) => ({ ...prev, verify: "verified" }));
        setDialog(null);
      } else {
        // Update the states
        setComponentError(
          responseData.message || "Some error occurred, refresh and try again."
        );
        setPromiseStatus((prev) => ({ ...prev, verify: "error" }));
      }
    } catch (error) {
      setComponentError("Issue in verification, refresh and try again.");
      setPromiseStatus((prev) => ({ ...prev, verify: "error" }));
    }
  }

  // Handle Edit
  async function handleEdit(event: React.FormEvent<HTMLFormElement>) {
    // Initial loading statement management
    event.preventDefault();
    setComponentError(null);
    setPromiseStatus((prev) => ({ ...prev, edit: "pending" }));

    // Get the data
    const formData = new FormData(event.target as HTMLFormElement);
    const id: string = formData.get("id") as string;
    const enforcementType: string = (
      formData.get("enforcementType") as string
    ).toLowerCase();
    const opacity: number = parseInt(formData.get("opacity") as string);

    // Check the data
    if (!id || !enforcementType || !opacity) {
      setComponentError("Please fill in all fields.");
      setPromiseStatus((prev) => ({ ...prev, edit: "error" }));
      return;
    }

    // Don't bypass - hehe
    console.log(enforcementType);
    if (!enforcementTypes.includes(enforcementType)) {
      setComponentError("Invalid enforcement type.");
      setPromiseStatus((prev) => ({ ...prev, edit: "error" }));
      return;
    }
    // Check the opacity: 0-100
    if (isNaN(opacity) || opacity < 0 || opacity > 100) {
      setComponentError("Opacity must be a number between 0 and 100.");
      setPromiseStatus((prev) => ({ ...prev, edit: "error" }));
      return;
    }

    // Update the Database - call the APi
    try {
      const response = await fetch("/api/actions", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id: id,
          enforcementType: enforcementType,
          opacity: opacity,
        }),
      });

      // Get the data
      const data = await response.json();
      if (response.status === 200) {
        const payloadReceived = data.payload;
        setPromiseStatus((prev) => ({ ...prev, edit: "success" }));
        setRecords((prev) =>
          (prev || []).map((rec) =>
            rec.id === id
              ? {
                  ...rec,
                  enforcementType: payloadReceived.enforcementType,
                  opacity: parseInt(payloadReceived.opacity as string),
                }
              : rec
          )
        );
      } else {
        setComponentError(
          data.message ?? "Some Error occurred, please refresh and try again."
        );
        setPromiseStatus((prev) => ({ ...prev, edit: "error" }));
      }
    } catch (error) {
      console.log("Error:", error);
      setComponentError("Sonme error occurred, refresh and try again.");
      setPromiseStatus((prev) => ({ ...prev, edit: "error" }));
    }
  }

  // Effect for outside click
  useEffect(() => {
    const handleOutsideCick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      )
        setDialog(null);
    };

    // Add event listener
    document.addEventListener("mousedown", handleOutsideCick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideCick);
    };
  }, [dialog, setDialog]);

  return (
    <div
      className={`dialog top-0 left-0 fixed z-50 w-dvw h-dvh items-center justify-center ${
        dialog === null ? "hidden" : "flex"
      }`}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10"></div>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: dialog !== null ? 1 : 0,
          y: dialog !== null ? 0 : -20,
        }}
        transition={{ duration: 0.3 }}
        className="w-[290px] sm:w-[360px] h-fit px-4 py-5 bg-white rounded-lg shadow-sm shadow-neutral-400 absolute z-20 flex flex-col gap-4"
      >
        {/* Upper button and heading part */}
        <div className="upper-part w-full h-fit flex flex-row gap-4 items-center justify-between">
          <h1 className="heading text-xl text-black font-extrabold">
            {dialog?.type === "delete"
              ? "Delete Record"
              : dialog?.type === "verify"
              ? "Verify Record"
              : "Edit Record"}
          </h1>
          <button
            onClick={() => {
              // Reset dialog state and promise states
              setDialog(null);
              setPromiseStatus({
                delete: null,
                verify: null,
                edit: null,
              });
            }}
            type="button"
            className="w-fit h-fit"
          >
            <IoIosCloseCircleOutline className="text-black text-xl" />
          </button>
        </div>
        {/* Delete form  */}
        {dialog?.type === "delete" && (
          <form
            id="delete-form"
            onSubmit={handleRecordDeletion}
            className="delete-form w-fit h-fit flex flex-col gap-5"
          >
            <input
              readOnly
              type="text"
              name="id"
              id="id"
              hidden
              aria-hidden
              value={dialog?.id || ""}
            />
            <div className="w-fit h-fit text-black">
              {dialog?.text as string}
            </div>
            <div className="buttons w-fit h-fit flex flex-row gap-2">
              <button
                onClick={() => setDialog(null)}
                type="button"
                className={`px-3 py-1 text-base text-neutral-100 bg-black font-bold rounded-md ${
                  promiseStatus.delete === "pending"
                    ? "bg-gray-400 cursor-not-allowed"
                    : ""
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-3 py-1 text-base text-white bg-red-500 rounded-md ${
                  promiseStatus.delete === "pending"
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-red-600"
                }`}
              >
                {promiseStatus.delete === "error"
                  ? "Delete"
                  : promiseStatus.delete === "pending"
                  ? "Deleting..."
                  : promiseStatus.delete === "success"
                  ? "Deleted"
                  : "Delete"}
              </button>
            </div>
          </form>
        )}
        {/* Verify form */}
        {dialog?.type === "verify" && dialog.verification?.code && (
          <form
            onClick={() => setComponentError(null)}
            onSubmit={handleDomainVerification}
            className="edit-verify-form flex flex-col gap-3"
            id="edit-verify-form"
          >
            <input
              type="text"
              name="id"
              readOnly
              hidden
              aria-hidden
              value={dialog?.id || ""}
            />
            <div className="verify-box w-fit h-fit flex flex-col gap-3">
              <div className="verification-instructions-and-code flex flex-col gap-2">
                <p className="text-sm"></p>
                Add the below id to TXT record in your DNS settings.
                <div className="flex items-center space-x-2">
                  <input
                    name="verificationCode"
                    type="text"
                    readOnly
                    value={dialog.verification.code as string}
                    className="text-sm bg-gray-100 px-2 py-1 rounded"
                  />
                  <input
                    type="text"
                    name="id"
                    className="hidden"
                    readOnly
                    aria-hidden
                    value={dialog.id as string}
                  ></input>
                  <button
                    type="button"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      const btn = e.currentTarget;
                      // Copy the text to clip board
                      navigator.clipboard.writeText(
                        `"payfade-verification-code=${dialog.verification?.code}"` as string
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
                disabled={
                  promiseStatus.verify === "verifying" ||
                  promiseStatus.verify === "verified"
                }
                className={`verify-button w-fit h-fit py-1 px-3 font-bold bg-black text-white rounded ${
                  promiseStatus.verify === "verifying"
                    ? "opacity-50 cursor-not-allowed"
                    : promiseStatus.verify === "verified"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {promiseStatus.verify === "verifyingMode"
                  ? "Verify"
                  : promiseStatus.verify === "verifying"
                  ? "Verifying..."
                  : promiseStatus.verify === "verified"
                  ? "Verified"
                  : "Verify"}
              </button>
            </div>
            {/* Error */}
            {componentError && (
              <div className="error-message">
                {componentError && (
                  <p className="text-red-600 font-bold text-sm text-wrap">
                    {componentError}
                  </p>
                )}
              </div>
            )}
          </form>
        )}
        {/* Edit form */}
        {dialog?.type === "edit" && (
          <form
            onClick={() => setComponentError(null)}
            className="edit-form w-full h-fit flex flex-col gap-4"
            onSubmit={handleEdit}
          >
            {/* Hidden ID field */}
            <input
              type="text"
              name="id"
              readOnly
              value={dialog?.id || ""}
              hidden
              aria-hidden
            />
            {/* Opacity Input (0-100) */}
            <div className="form-group opacity-group flex flex-col gap-2">
              <label
                htmlFor="opacity"
                className="text-sm font-semibold text-gray-700"
              >
                Opacity (0-100)
              </label>
              <div className="relative opacity-div">
                <input
                  type="number"
                  name="opacity"
                  id="opacity"
                  min="0"
                  max="100"
                  defaultValue={dialog.editData?.opacity || 0}
                  step="1"
                  required
                  placeholder="Enter value 0-100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  onInput={(e) => {
                    const input = e.target as HTMLInputElement;
                    const value = parseInt(input.value);
                    if (value < 0) input.value = "0";
                    if (value > 100) input.value = "100";
                  }}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                  %
                </div>
              </div>
            </div>
            {/* Enforcement Type Selector */}
            <div className="form-group flex flex-col gap-2">
              <label
                htmlFor="enforcement"
                className="text-sm font-semibold text-gray-700"
              >
                Enforcement Type
              </label>
              <select
                name="enforcementType"
                id="enforcementType"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm bg-white"
              >
                {enforcementTypes.map((type, index) => (
                  <option key={index} value={type.toLowerCase()}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            {/* Action Buttons */}
            <div className="buttons w-full flex flex-row gap-2 justify-end mt-2">
              <button
                onClick={() => setDialog(null)}
                type="button"
                className={`px-4 py-2 text-sm text-gray-700 bg-gray-100 font-medium rounded-lg transition-colors ${
                  promiseStatus.edit === "pending" ||
                  promiseStatus.edit === "success"
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-200"
                }`}
                disabled={
                  promiseStatus.edit === "pending" ||
                  promiseStatus.edit === "success"
                }
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 text-sm text-white bg-blue-600 font-medium rounded-lg transition-colors ${
                  promiseStatus.edit === "pending" ||
                  promiseStatus.edit === "success"
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-700"
                }`}
                disabled={
                  promiseStatus.edit === "pending" ||
                  promiseStatus.edit === "success"
                }
              >
                {promiseStatus.edit === "pending"
                  ? "Saving..."
                  : promiseStatus.edit === "success"
                  ? "Saved"
                  : "Save Changes"}
              </button>
            </div>
            {/* Error Message */}
            {componentError && (
              <div className="error-message">
                <p className="text-red-600 font-medium text-sm">
                  {componentError}
                </p>
              </div>
            )}
          </form>
        )}
      </motion.div>
    </div>
  );
}

// Records Table Management - Top Level
function RecordsTable({
  records,
  mounted,
  finalLoadingStatus,
  setDialog,
}: {
  records: RecordsType[] | null;
  mounted: boolean;
  finalLoadingStatus: null | "success" | "failed";
  setDialog: React.Dispatch<
    React.SetStateAction<{
      id: string;
      type: "delete" | "edit" | "verify";
      text: string | null;
      verification: {
        status: boolean;
        code: string | null;
      } | null;
      editData: {
        enforcementType: string;
        opacity: number;
      } | null;
    } | null>
  >;
}) {
  return (
    <div className="record-table relative w-full overflow-x-auto bg-white shadow-md h-fit">
      <table className="min-w-full relative border-collapse">
        <thead className="column-headings">
          <tr className="bg-gray-100 text-left text-sm sm:text-base">
            <th className="border border-gray-300 p-2 text-neutral-800 text-center min-w-[120px] break-words">
              Website Name
            </th>
            <th className="border border-gray-300 p-2 text-neutral-800 text-center min-w-[100px] break-words">
              URL
            </th>
            <th className="border border-gray-300 p-2 text-neutral-800 text-center min-w-[100px] break-words">
              API Key
            </th>
            <th className="border border-gray-300 p-2 text-neutral-800 text-center min-w-[80px] break-words">
              Enforcement Type
            </th>
            <th className="border border-gray-300 p-2 text-neutral-800 text-center min-w-[80px] break-words">
              Opacity
            </th>
            <th className="border border-gray-300 p-2 text-neutral-800 text-center min-w-[80px] break-words">
              Hits
            </th>
            <th className="border border-gray-300 p-2 text-neutral-800 text-center min-w-[120px] break-words">
              Created On
            </th>
            <th className="border border-gray-300 p-2 text-neutral-800 text-center min-w-[100px] break-words">
              Action
            </th>
          </tr>
        </thead>
        {mounted === false ? (
          <RecordsSkeleton />
        ) : (
          <RecordsTableDataRendered
            finalLoadingStatus={finalLoadingStatus}
            records={records}
            setDialog={setDialog}
          />
        )}
      </table>
    </div>
  );
}

// Skeleton Rows
function RecordsSkeleton() {
  return (
    <tbody>
      {Array.from({ length: 4 }).map((_, rowIdx) => (
        <tr key={rowIdx} className="bg-gray-50 border border-gray-300">
          {Array.from({ length: 6 }).map((_, colIdx) => (
            <td key={colIdx} className="p-2">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

// Utility - API Key (Display)
function ApiKeyDisplay({ apiKey }: { apiKey: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy API key:", err);
    }
  };

  return (
    <div className="flex items-center gap-2 max-w-xs">
      <div className="flex-1 relative">
        <input
          type="text"
          value={apiKey}
          readOnly
          className="w-full px-2 py-1 text-xs font-mono bg-gray-50 border border-gray-200 rounded text-gray-700 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-default"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#d1d5db #f3f4f6",
          }}
        />
      </div>
      <button
        onClick={handleCopy}
        className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200 flex items-center justify-center"
        title="Copy API Key"
        type="button"
      >
        {copied ? (
          <Check size={14} className="text-green-600" />
        ) : (
          <Copy size={14} />
        )}
      </button>
    </div>
  );
}

// Rendering of Data
function RecordsTableDataRendered({
  records,
  finalLoadingStatus,
  setDialog,
}: {
  finalLoadingStatus: null | "success" | "failed";
  records?: RecordsType[] | null;
  setDialog: React.Dispatch<
    React.SetStateAction<{
      id: string;
      type: "delete" | "edit" | "verify";
      text: string | null;
      verification: {
        status: boolean;
        code: string | null;
      } | null;
      editData: {
        enforcementType: string;
        opacity: number;
      } | null;
    } | null>
  >;
}) {
  return (
    <tbody className="records relative w-full h-fit">
      {finalLoadingStatus === "success" ? (
        records === null || records?.length === 0 ? (
          <tr className="no-records-found">
            <td
              colSpan={8}
              className="text-center border border-gray-200 p-4 text-gray-500 font-bold w-full h-fit text-wrap"
            >
              No Records Found, try adding some 🙂
            </td>
          </tr>
        ) : (
          records?.map((record, index) => (
            <tr
              key={record.id}
              className={`record-row relative ${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-blue-50 transition-colors duration-150`}
            >
              <td className="border border-gray-300 p-3 text-neutral-800 text-center">
                <div className="font-medium">{record.websiteName}</div>
              </td>
              <td className="border border-gray-300 p-3 text-neutral-800 text-center">
                <Link
                  href={`https://${record.websiteDomain}`}
                  target="_blank"
                  className="text-blue-600 hover:underline cursor-pointer"
                >
                  {record.websiteDomain}
                </Link>
              </td>
              <td className="border border-gray-300 p-3 text-neutral-800">
                <div className="flex justify-center">
                  <ApiKeyDisplay apiKey={record.apiKey} />
                </div>
              </td>
              <td className="border border-gray-300 p-3 text-neutral-800 text-center">
                {record.enforcementType}
              </td>
              <td className="border border-gray-300 text-neutral-800 text-center">
                {record.opacity}%
              </td>
              <td className="border border-gray-300 p-3 text-neutral-800 text-center">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {record.hits.toLocaleString()}
                </span>
              </td>
              <td className="border border-gray-300 p-3 text-neutral-800 text-center">
                <div className="text-sm text-gray-600">
                  {new Date(record.createdAt).toLocaleDateString()}
                </div>
              </td>
              <td className="border border-gray-300 p-3 text-neutral-800 text-center">
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => {
                      if (record.verified === true) {
                        setDialog({
                          id: record.id,
                          type: "edit",
                          text: "Are you sure you want to edit this record?",
                          verification: null,
                          editData: {
                            enforcementType: record.enforcementType,
                            opacity: record.opacity,
                          },
                        });
                      } else {
                        setDialog({
                          id: record.id,
                          type: "verify",
                          text: "Verifying the record",
                          verification: {
                            code: record.verificationCode,
                            status: false,
                          },
                          editData: null,
                        });
                      }
                    }}
                    className={`px-3 py-1 text-sm rounded transition-colors duration-200 ${
                      record.verified === true
                        ? "bg-blue-300 hover:bg-blue-400 cursor-pointer"
                        : "bg-yellow-200 hover:bg-yellow-300 cursor-pointer"
                    }`}
                  >
                    {record.verified === true ? "Edit" : "Verify"}
                  </button>
                  <button
                    onClick={() => {
                      setDialog({
                        id: record.id,
                        type: "delete",
                        text: "Are you sure, you want to delete this record?",
                        verification: null,
                        editData: null,
                      });
                    }}
                    type="button"
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-200 bg-red-100 rounded transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))
        )
      ) : (
        <tr className="failed-to-fetch">
          <td
            colSpan={8}
            className="text-center border border-gray-200 p-4 text-gray-500 font-bold w-full h-fit text-wrap"
          >
            Failed to fetch records, please refresh.
          </td>
        </tr>
      )}
    </tbody>
  );
}
