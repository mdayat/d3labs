import type React from "react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./Sidebar.module.css";
import { useThrottle } from "@uidotdev/usehooks";
import { axiosInstance } from "@libs/axios";

interface SearchItemResponse {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  received_events_url: string;
  type: string;
  score: number;
  following_url: string;
  gists_url: string;
  starred_url: string;
  events_url: string;
  site_admin: boolean;
}

interface SearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: SearchItemResponse[];
}

function Sidebar() {
  const [username, setUsername] = useState("");
  const [searchItems, setSearchItems] = useState<SearchItemResponse[]>([]);
  const throttledUsername = useThrottle(username, 500);

  useEffect(() => {
    if (throttledUsername !== "") {
      (async () => {
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
      })();
    } else {
      setSearchItems([]);
    }
  }, [throttledUsername]);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebar__search}>
        <div className={styles["sidebar__search-container"]}>
          <label htmlFor="search">
            <MagnifyingGlassIcon className={styles["sidebar__search-icon"]} />
          </label>
          <input
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
        {searchItems.length > 0 ? (
          <div className={styles.sidebar__results}>
            {searchItems.map((item) => (
              <div key={item.id} className={styles["sidebar__user-item"]}>
                <div className={styles["sidebar__user-avatar"]}>
                  <Image
                    src={item.avatar_url}
                    alt={item.login}
                    width={40}
                    height={40}
                    className={styles["sidebar__user-image"]}
                  />
                </div>
                <div className={styles["sidebar__user-name"]}>{item.login}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles["sidebar__no-results"]}>No results found</div>
        )}
      </div>
    </aside>
  );
}

export { Sidebar };
