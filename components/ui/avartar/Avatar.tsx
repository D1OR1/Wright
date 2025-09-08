import Image from "next/image";
import styles from "./Avatar.module.css";

interface AvatarProps {
  src: string;
  alt: string;
  size?: "small" | "medium" | "large";
}

export default function Avatar({ src, alt, size = "small" }: AvatarProps) {
  return (
    <div className={`${styles.avatar} ${styles[size]}`}>
      <Image
        src={src}
        alt={alt}
        width={200}
        height={200}
        className={styles.image}
      />
    </div>
  );
}
