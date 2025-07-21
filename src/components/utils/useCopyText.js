import { useState } from "react";

export function useCopyText() {
  const [copied, setCopied] = useState(false);

  const copyFromId = id => {
    const element = document.getElementById(id);
    if (element && element.textContent) {
      navigator.clipboard
        .writeText(element.textContent.trim())
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000); // reset after 2s
        })
        .catch(err => {
          console.error("Copy failed:", err);
        });
    } else {
      console.warn(`Element with id "${id}" not found or empty.`);
    }
  };

  return { copyFromId, copied };
}
