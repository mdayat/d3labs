import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";
import { axiosInstance } from "@libs/axios";
import styles from "./RepositoryModal.module.css";

interface RepositoryModalProps {
  repositoryName: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

function RepositoryModal({ repositoryName, setIsOpen }: RepositoryModalProps) {
  const [readmeContent, setReadmeContent] = useState("");

  useEffect(() => {
    (async () => {
      const res = await axiosInstance.get<{ content: string }>(
        `https://api.github.com/repos/${"mdayat"}/${repositoryName}/readme`,
        {
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );

      if (!res.data.content) {
        setReadmeContent("<p>This repository doesn't have README</p>");
        return;
      }

      try {
        const decodedContent = atob(res.data.content);
        const html = DOMPurify.sanitize(await marked.parse(decodedContent));
        setReadmeContent(html);
      } catch (error) {
        console.error("error processing README:", error);
        setReadmeContent("<p>Error processing README content</p>");
      }
    })();
  }, [repositoryName]);

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
