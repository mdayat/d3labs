import { axiosInstance } from "@libs/axios";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import type { RepositoryResponse } from "@dto/repository";
import { useSelectedUser } from "@contexts/SelectedUserProvider";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import Head from "next/head";

const RepositoryCard = dynamic(() =>
  import("@components/RepositoryCard").then(
    ({ RepositoryCard }) => RepositoryCard
  )
);

const RepositoryCardSkeleton = dynamic(() =>
  import("@components/RepositoryCard/Skeleton").then(
    ({ RepositoryCardSkeleton }) => RepositoryCardSkeleton
  )
);

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [repositories, setRepositories] = useState<RepositoryResponse[]>([]);

  const { selectedUser } = useSelectedUser();

  useEffect(() => {
    if (selectedUser) {
      setIsLoading(true);
      (async () => {
        try {
          const res = await axiosInstance.get<RepositoryResponse[]>(
            `https://api.github.com/users/${selectedUser.login}/repos`,
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
          } else {
            setRepositories([]);
          }
        } catch (error) {
          console.error("failed to get user repositories", { cause: error });
          toast(
            "Something is wrong when displaying repositories, please try again",
            {
              type: "error",
              theme: "colored",
            }
          );
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [selectedUser]);

  if (!selectedUser && repositories.length === 0) {
    return (
      <main className={styles.main}>
        <h1 className={styles.main__title}>User&apos;s Repositories</h1>
        <div className={styles.repository_list__empty}>
          Search and select a user to see their repositories
        </div>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>Muhammad Nur Hidayat</title>
        <meta
          name="description"
          content="A simple application to search github users, and view their repositories and README file"
        />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.main__title}>User&apos;s Repositories</h1>

        {isLoading ? (
          <div className={styles.repository_list__grid}>
            <RepositoryCardSkeleton />
            <RepositoryCardSkeleton />
            <RepositoryCardSkeleton />
            <RepositoryCardSkeleton />
          </div>
        ) : repositories.length > 0 ? (
          <div className={styles.repository_list__grid}>
            {repositories.map((repo) => (
              <RepositoryCard key={repo.id} repository={repo} />
            ))}
          </div>
        ) : (
          <div className={styles.repository_list__empty}>
            The user doesn&apos;t have repositories
          </div>
        )}
      </main>
    </>
  );
}
