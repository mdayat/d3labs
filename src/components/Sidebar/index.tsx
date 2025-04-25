import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import styles from "./Sidebar.module.css";
import { useThrottle, useWindowSize } from "@uidotdev/usehooks";
import {
  Cross2Icon,
  HamburgerMenuIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import { axiosInstance } from "@libs/axios";
import type { SearchItemResponse, SearchResponse } from "@dto/search";
import { toast } from "react-toastify";
import { useSelectedUser } from "@contexts/SelectedUserProvider";

function Sidebar() {
  const [username, setUsername] = useState("");
  const [searchItems, setSearchItems] = useState<SearchItemResponse[]>([]);
  const [expanded, setExpanded] = useState(true);

  const { setSelectedUser } = useSelectedUser();
  const throttledUsername = useThrottle(username, 500);
  const size = useWindowSize();

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const [isMobile, isReady] = useMemo(() => {
    if (size.width === null) {
      return [false, false];
    }

    if (size.width > 768) {
      setExpanded(true);
      return [false, true];
    }

    setExpanded(false);
    return [true, true];
  }, [size.width]);

  useEffect(() => {
    if (throttledUsername !== "") {
      (async () => {
        try {
          const res = await axiosInstance.get<SearchResponse>(
            `https://api.github.com/search/users?q=${throttledUsername}`,
            {
              headers: {
                Accept: "application/vnd.github+json",
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
                "X-GitHub-Api-Version": "2022-11-28",
              },
            }
          );

          setSearchItems(res.data.items);
        } catch (error) {
          console.error("failed to search user", { cause: error });
          toast("Cannot search user, please try again", {
            type: "error",
            theme: "colored",
          });
        }
      })();
    } else {
      setSearchItems([]);
    }
  }, [throttledUsername]);

  if (!isReady) {
    return <></>;
  }

  return (
    <>
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className={styles["sidebar__mobile-toggle"]}
          hidden={expanded}
          aria-label="Open sidebar"
        >
          <HamburgerMenuIcon />
        </button>
      )}

      <div
        className={`${styles.sidebar} ${
          isMobile && expanded ? styles["sidebar--mobile-expanded"] : ""
        } ${
          !isMobile ? styles["sidebar--expanded"] : styles["sidebar--collapsed"]
        }`}
      >
        <div className={styles.sidebar__search}>
          {isMobile && expanded && (
            <button
              className={styles["sidebar__close-button"]}
              onClick={toggleSidebar}
              aria-label="Close sidebar"
            >
              <Cross2Icon />
            </button>
          )}

          <div className={styles["sidebar__search-container"]}>
            <label htmlFor="search">
              <MagnifyingGlassIcon className={styles["sidebar__search-icon"]} />
            </label>

            <input
              hidden={!expanded}
              onChange={(event) => setUsername(event.currentTarget.value)}
              value={username}
              id="search"
              type="text"
              placeholder="Search..."
              className={styles["sidebar__search-input"]}
            />
          </div>
        </div>

        <div className={styles.sidebar__content}>
          {expanded && searchItems.length > 0 && (
            <div className={styles.sidebar__results}>
              {searchItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() =>
                    setSelectedUser({
                      id: item.id,
                      login: item.login,
                      avatar_url: item.avatar_url,
                    })
                  }
                  className={styles["sidebar__user-item"]}
                >
                  <div className={styles["sidebar__user-avatar"]}>
                    <Image
                      src={item.avatar_url}
                      alt={item.login}
                      width={40}
                      height={40}
                      className={styles["sidebar__user-image"]}
                    />
                  </div>
                  {expanded && (
                    <div className={styles["sidebar__user-name"]}>
                      {item.login}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {expanded && searchItems.length === 0 && (
            <div className={styles["sidebar__no-results"]}>
              No results found
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export { Sidebar };
