import type { RepositoryResponse } from "@dto/repository";
import styles from "./RepositoryCard.module.css";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { RepositoryModal } from "@components/RepositoryModal";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

interface RepositoryCardProps {
  repository: RepositoryResponse;
}

function RepositoryCard({ repository }: RepositoryCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className={styles.repository_card}>
        <div className={styles.repository_card__header}>
          <h2 className={styles.repository_card__name}>{repository.name}</h2>
          <span
            className={`${styles.repository_card__visibility} ${
              styles[`repository_card__visibility--${repository.visibility}`]
            }`}
          >
            {repository.visibility}
          </span>
        </div>

        <div className={styles.repository_card__created}>
          Created: {formatDate(repository.created_at)}
        </div>

        <div className={styles.repository_card__actions}>
          <a
            href={repository.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.repository_card__link_button}
          >
            <ExternalLinkIcon /> GitHub
          </a>

          <button
            onClick={() => setIsOpen(true)}
            className={styles.repository_card__readme_button}
          >
            View Readme
          </button>
        </div>
      </div>

      {isOpen && (
        <RepositoryModal
          repositoryName={repository.name}
          setIsOpen={setIsOpen}
        />
      )}
    </>
  );
}

export { RepositoryCard };
