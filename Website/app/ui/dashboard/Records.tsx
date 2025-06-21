"use client";

import { firaSansFont } from "@/app/lib/fonts";
import { useState, useEffect } from "react";
import { RecordsType } from "@/app/lib/definitions";
import { useRecordsList } from "@/app/hooks/useRecordsList";

// Delete endpoint remain
// Modify endpoint remain

export function Records() {
  const { records, setRecords } = useRecordsList();
  const [mounted, setMounted] = useState<boolean>(false);
  const [finalLoadingStatus, setFinalLoadingStatus] = useState<
    null | "success" | "failed"
  >(null);

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
          setRecords(data);
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
        setMounted(false);
      }
    };

    // Fetch the records
    fetchRecords();
  }, [setRecords, Records]);

  return (
    <section
      className={`records w-full h-fit flex flex-col gap-4 ${firaSansFont.className}`}
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
        />
      </div>
    </section>
  );
}

function RecordsTable({
  records,
  mounted,
  finalLoadingStatus,
}: {
  records: RecordsType[] | null;
  mounted: boolean;
  finalLoadingStatus: null | "success" | "failed";
}) {
  return (
    <div className="record-table w-full overflow-x-auto bg-white shadow-md h-fit">
      <table className="w-full border-collapse">
        <thead className="column-headings">
          <tr className="bg-gray-100 text-left text-sm sm:text-base">
            <th className="border border-gray-300 p-2 text-neutral-800 text-center">
              Website Name
            </th>
            <th className="border border-gray-300 p-2 text-neutral-800 text-center">
              URL
            </th>
            <th className="border border-gray-300 p-2 text-neutral-800 text-center">
              API Key
            </th>
            <th className="border border-gray-300 p-2 text-neutral-800 text-center">
              Hits
            </th>
            <th className="border border-gray-300 p-2 text-neutral-800 text-center">
              Created On
            </th>
            <th className="border border-gray-300 p-2 text-neutral-800 text-center">
              Action
            </th>
          </tr>
        </thead>
        {mounted === true ? (
          <RecordsSkeleton />
        ) : (
          <RecordsTableDataRendered
            finalLoadingStatus={finalLoadingStatus}
            records={records}
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

// Renderig the records data
function RecordsTableDataRendered({
  records,
  finalLoadingStatus,
}: {
  finalLoadingStatus: null | "success" | "failed";
  records?: RecordsType[] | null;
}) {
  return (
    <tbody className="records w-full h-fit">
      {finalLoadingStatus === "success" ? (
        records?.length === 0 || null ? (
          <tr className="no-records-found">
            <td
              colSpan={6}
              className="text-center border border-gray-200 p-4 text-gray-500 font-bold w-full h-fit text-wrap"
            >
              No Records Found
            </td>
          </tr>
        ) : (
          records?.map((record, index) => (
            <tr
              key={record.id}
              className={`record-row ${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              }`}
            >
              <td className="border border-gray-300 p-2 text-neutral-800 text-center">
                {record.website_name}
              </td>
              <td className="border border-gray-300 p-2 text-neutral-800 text-center">
                {record.website_url}
              </td>
              <td className="border border-gray-300 p-2 text-neutral-800 text-center">
                {record.api_key}
              </td>
              <td className="border border-gray-300 p-2 text-neutral-800 text-center">
                {record.hits}
              </td>
              <td className="border border-gray-300 p-2 text-neutral-800 text-center">
                {new Date(record.createdAt).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 p-2 text-neutral-800 text-center">
                {/* Action buttons can be added here */}
                <button type="button" className="text-blue-500 hover:underline">
                  Edit
                </button>
                <button type="button" className="text-red-600 hover:underline">
                  Delete
                </button>
              </td>
            </tr>
          ))
        )
      ) : (
        <tr className="failed-to-fetch">
          <td
            colSpan={6}
            className="text-center border border-gray-200 p-4 text-gray-500 font-bold w-full h-fit text-wrap"
          >
            Failed to fetch records, please refresh.
          </td>
        </tr>
      )}
    </tbody>
  );
}
