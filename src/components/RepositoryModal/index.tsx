import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";
import { axiosInstance } from "@libs/axios";
import styles from "./RepositoryModal.module.css";
import { useSelectedUser } from "@contexts/SelectedUserProvider";
import { toast } from "react-toastify";

interface RepositoryModalProps {
  repositoryName: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

function RepositoryModal({ repositoryName, setIsOpen }: RepositoryModalProps) {
  const [readmeContent, setReadmeContent] = useState("");

  const { selectedUser } = useSelectedUser();

  useEffect(() => {
    (async () => {
      try {
        const url = `https://api.github.com/repos/${
          selectedUser!.login
        }/${repositoryName}/readme`;

        const res = await axiosInstance.get<{ content: string }>(url, {
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
            "X-GitHub-Api-Version": "2022-11-28",
          },
        });

        if (!res.data.content) {
          setReadmeContent(
            `<p style="text-align: center; font-style: italic;">This repository doesn't have README</p>`
          );
          return;
        }

        const decodedContent = atob(res.data.content);
        const html = DOMPurify.sanitize(await marked.parse(decodedContent));
        setReadmeContent(html);
      } catch (error) {
        console.error("failed to get README", { cause: error });
        toast("Something is wrong when displaying README, please try again", {
          type: "error",
          theme: "colored",
        });
      }
    })();
  }, [repositoryName, selectedUser]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <>
      <div
        className={styles.repository_modal__overlay}
        onClick={() => setIsOpen(false)}
      />

      <div className={styles.repository_modal}>
        <div
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: readmeContent }}
        />
      </div>
    </>
  );
}

export { RepositoryModal };
