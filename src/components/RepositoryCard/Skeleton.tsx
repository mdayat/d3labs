import styles from "./RepositoryCard.module.css";

function RepositoryCardSkeleton() {
  return (
    <div
      className={`${styles.repository_card} ${styles.repository_card__skeleton}`}
    >
      <div className={styles.repository_card__header}>
        <div
          className={`${styles.repository_card__skeleton_element} ${styles.repository_card__skeleton_name}`}
        />
        <div
          className={`${styles.repository_card__skeleton_element} ${styles.repository_card__skeleton_visibility}`}
        />
      </div>

      <div
        className={`${styles.repository_card__skeleton_element} ${styles.repository_card__skeleton_description}`}
      />
      <div
        className={`${styles.repository_card__skeleton_element} ${styles.repository_card__skeleton_description_short}`}
      />

      <div className={styles.repository_card__actions}>
        <div
          className={`${styles.repository_card__skeleton_element} ${styles.repository_card__skeleton_button}`}
        />
        <div
          className={`${styles.repository_card__skeleton_element} ${styles.repository_card__skeleton_button}`}
        />
      </div>
    </div>
  );
}

export { RepositoryCardSkeleton };
