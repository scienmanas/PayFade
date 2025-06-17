import { createContext, useContext } from "react";
import { RecordsType } from "@/app/lib/definitions";

// This file defines a context for managing the records list in a React application.
interface RecordsContextType {
  records: RecordsType[] | null;
  setRecords: React.Dispatch<React.SetStateAction<RecordsType[] | null>>;
}

// Export the context
export const RecordsContext = createContext<RecordsContextType | undefined>(
  undefined
);

// Custom hook to use the RecordsListContext
export function useRecordsList() {
  const context = useContext(RecordsContext);
  if (context === undefined) {
    throw new Error("useRecordsList must be used within a RecordsListProvider");
  }
  return context;
}
