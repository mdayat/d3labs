import { Sidebar } from "@components/Sidebar";
import { axiosInstance } from "@libs/axios";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import type { RepositoryResponse } from "@dto/repository";
import { RepositoryCard } from "@components/RepositoryCard";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [repositories, setRepositories] = useState<RepositoryResponse[]>([]);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      try {
        const res = await axiosInstance.get<RepositoryResponse[]>(
          `https://api.github.com/users/${"mdayat"}/repos`,
          {
            headers: {
              Accept: "application/vnd.github+json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
              "X-GitHub-Api-Version": "2022-11-28",
            },
          }
        );

        if (res.data.length > 0) {
          setRepositories(
            res.data.map((item) => ({
              id: item.id,
              name: item.name,
              visibility: item.visibility,
              html_url: item.html_url,
              created_at: item.created_at,
            }))
          );
        }
      } catch (error) {
        // TODO:
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <Sidebar />

      <main className={styles.main}>
        <h1 className={styles.main__title}>User&apos;s Repositories</h1>

        <div className={styles.repository_list__grid}>
          {isLoading ? (
            <>LOADING...</>
          ) : (
            repositories.map((repo) => (
              <RepositoryCard key={repo.id} repository={repo} />
            ))
          )}
        </div>
      </main>
    </>
  );
}
