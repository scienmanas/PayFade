"use client";

import { firaSansFont } from "@/app/lib/fonts";
import { useState, useEffect } from "react";
import { WebsiteRecordData } from "@/app/lib/definitions";

export function Records() {
  const [records, setRecords] = useState<null | WebsiteRecordData>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingFinalStatus, setLoadingFinalStatus] = useState<null | string>(
    null
  );

  // Fetch the records from the API

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
        <RecordTable websiteRecordData={records ? [records] : []} />
      </div>
    </section>
  );
}

// id: string;
// website_name: string;
// website_url: string;
// api_key: string;
// hits: number;
// createdAt: string;

function RecordTable({
  websiteRecordData,
}: {
  websiteRecordData: WebsiteRecordData[];
}) {
  return (
    <div className="record-table w-full overflow-x-auto bg-white shadow-md">
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
        <tbody></tbody>
      </table>
    </div>
  );
}
