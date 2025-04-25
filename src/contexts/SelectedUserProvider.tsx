import type { SearchItemResponse } from "@dto/search";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react";

interface SelectedUserType {
  selectedUser: SearchItemResponse | null;
  setSelectedUser: Dispatch<SetStateAction<SearchItemResponse | null>>;
}

const SelectedUser = createContext<SelectedUserType | undefined>(undefined);

function SelectedUserProvider({ children }: PropsWithChildren) {
  const [selectedUser, setSelectedUser] = useState<SearchItemResponse | null>(
    null
  );

  const value = useMemo((): SelectedUserType => {
    return { selectedUser, setSelectedUser };
  }, [selectedUser]);

  return (
    <SelectedUser.Provider value={value}>{children}</SelectedUser.Provider>
  );
}

function useSelectedUser() {
  const context = useContext(SelectedUser);
  if (context === undefined) {
    throw new Error(
      "useSelectedUser must be used within a SelectedUserProvider"
    );
  }
  return context;
}

export { SelectedUserProvider, useSelectedUser };
