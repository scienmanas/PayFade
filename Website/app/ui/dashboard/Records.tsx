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
      <div className="records"></div>
    </section>
  );
}
