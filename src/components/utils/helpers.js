import { useEffect, useRef } from "react";
import api from "./api";

// Function to show custom alert
export function showAlert(message, type = "error") {
  const alert = document.getElementById("customAlert");
  const alertMessage = document.getElementById("alertMessage");

  // Check if elements exist
  if (!alert || !alertMessage) {
    console.error("Alert elements not found in DOM");
    return;
  }

  // Set alert message and style
  alertMessage.textContent = message;

  // Start with hidden/transparent state
  alert.className = `flex justify-center fixed top-5 w-[90%] sm:w-full transform opacity-0 transition-opacity duration-300 z-50 mx-5`;

  alertMessage.className = `text-center transform py-2 sm:px-8 px-6 text-[12px] sm:text-sm whitespace-nowrap font-semibold backdrop-blur-sm rounded-[1.25rem] ${
    type === "error"
      ? "bg-red-500/20 border border-red-400/30 shadow-[inset_2px_2px_5px_rgba(255,180,180,0.3),inset_-2px_-2px_5px_rgba(0,0,0,0.1),0_6px_15px_rgba(180,0,0,0.3)] text-red-900"
      : "bg-green-100/20 border border-green-400/30 shadow-[inset_0.5px_0.5px_4px_rgba(255,255,255,0.9),inset_-0.5px_-0.5px_4px_rgba(0,0,0,0.3),0_4px_16px_rgba(0,0,0,0.08)] text-green-900"
  }`;

  // Remove hidden class and fade in the alert
  alert.classList.remove("hidden");
  setTimeout(() => {
    alert.classList.remove("opacity-0");
    alert.classList.add("opacity-100");
  }, 10);

  // Fade out the alert after 3 seconds
  setTimeout(() => {
    alert.classList.remove("opacity-100");
    alert.classList.add("opacity-0");

    // Hide completely after fade transition completes
    setTimeout(() => {
      alert.classList.add("hidden");
    }, 300); // Match the transition duration
  }, 3000); // Show for 3 seconds instead of 5
}

export function validateInput(e = null, values = {}) {
  let result = { name: true, email: true, password: true };

  // Clear all errors
  const emailError = document.querySelector(".email-error-message");
  const passwordError = document.querySelector(".password-error-message");
  const nameError = document.querySelector(".name-error-message");
  if (emailError) emailError.textContent = "";
  if (passwordError) passwordError.textContent = "";
  if (nameError) nameError.textContent = "";

  const validateField = (field, value, target) => {
    const val = value.trim();
    if (field === "email") {
      if (!/\S+@\S+\.\S+/.test(val)) {
        result.email = false;
        if (emailError)
          emailError.textContent = "Please enter a valid email address";
        target?.classList.add("border-red-400", "focus:border-red-400");
        target?.classList.remove(
          "border-green-400",
          "focus:border-green-400",
          "focus:border-primary"
        );
      } else {
        if (emailError) emailError.textContent = "";
        target?.classList.remove(
          "border-red-400",
          "focus:border-red-400",
          "focus:border-primary"
        );
        target?.classList.add("border-green-400", "focus:border-green-400");
      }
    } else if (field === "password") {
      if (val.length < 6) {
        result.password = false;
        if (passwordError)
          passwordError.textContent =
            "Password must be at least 6 characters long";
        target?.classList.add("border-red-400", "focus:border-red-400");
        target?.classList.remove(
          "border-green-400",
          "focus:border-green-400",
          "focus:border-primary"
        );
      } else {
        if (passwordError) passwordError.textContent = "";
        target?.classList.remove(
          "border-red-400",
          "focus:border-red-400",
          "focus:border-primary"
        );
        target?.classList.add("border-green-400", "focus:border-green-400");
      }
    } else if (field === "name") {
      if (val.length < 1) {
        result.name = false;
        if (nameError)
          nameError.textContent = "Name must be at least 1 character long";
        target?.classList.add("border-red-400", "focus:border-red-400");
        target?.classList.remove(
          "border-green-400",
          "focus:border-green-400",
          "focus:border-primary"
        );
      } else {
        if (nameError) nameError.textContent = "";
        target?.classList.remove(
          "border-red-400",
          "focus:border-red-400",
          "focus:border-primary"
        );
        target?.classList.add("border-green-400", "focus:border-green-400");
      }
    }
  };

  // If called via onInput
  if (e && e.target) {
    const classList = e.target.classList;
    if (classList.contains("email"))
      validateField("email", e.target.value, e.target);
    if (classList.contains("password"))
      validateField("password", e.target.value, e.target);
    if (classList.contains("name"))
      validateField("name", e.target.value, e.target);
    return;
  }

  // If called manually with values
  if (values.name !== undefined) validateField("name", values.name);
  if (values.email !== undefined) validateField("email", values.email);
  if (values.password !== undefined) validateField("password", values.password);

  return result;
}

export async function handleSubmit(
  e,
  email,
  password,
  name,
  errorMsg,
  setEmail,
  setPassword,
  setName,
  setErrorMsg,
  setLoading,
  showAlert,
  api,
  endPoint = "/login"
) {
  e.preventDefault();

  setLoading(true);
  setErrorMsg("");
  if (!email.trim() || !password.trim() || !name.trim()) {
    setErrorMsg("Please check your inputs and try again");
    setLoading(false);
    showAlert(errorMsg, "error");
    return;
  }

  setErrorMsg(""); // Clear any previous error messages
  setName(name.trim());
  setEmail(email.trim());
  setPassword(password.trim());

  let credentials = { email, password };
  if (endPoint === "/login") {
    credentials = { email, password };
  } else if (endPoint === "/signup") {
    credentials = { name, email, password };
  }

  try {
    const res = await api.post(endPoint, credentials);
    console.log("Login successful:", res.data);
    // window.location.href = res.data.redirect;
    setLoading(false);
  } catch (err) {
    console.log("Error:", err.response?.data?.error);
    setErrorMsg(err.response?.data?.error || "Login failed");
    setLoading(false);
    showAlert(err.response?.data?.error || "Login failed", "error");
  }
}

// Format time as MM:SS
function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (totalSeconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

// Start the timer
export function startTimer(MAX_RECORDING_TIME) {
  let timerInterval;
  let seconds = 0;
  timerElementWrapper.classList.remove("hidden");
  timerElement.textContent = `${formatTime(seconds)} / ${formatTime(
    MAX_RECORDING_TIME
  )}`;
  timerInterval = setInterval(() => {
    seconds++;
    timerElement.textContent = `${formatTime(seconds)} / ${formatTime(
      MAX_RECORDING_TIME
    )}`;

    // Auto-cancel at 1 minute
    if (seconds >= MAX_RECORDING_TIME) {
      forgotEmailButton.disabled = false;
      stopTimer();
    }
  }, 1000);
}

export function stopTimer() {
  clearInterval(timerInterval);
  timerElement.textContent = "00:00";
  timerElementWrapper.classList.add("hidden");
}

export function getTotalClicks(data) {
  if (!Array.isArray(data)) return 0;

  return data.reduce((total, item) => total + (item.clicks || 0), 0);
}

// Cache to store already fetched metadata
const metadataCache = new Map();
export function getURLMetaData(url) {
  if (!url) return;

  // Extract domain from URL
  const getDomain = url => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return null;
    }
  };

  // Get favicon URL (using Google's service with CORS workaround)
  const fetchFavicon = async url => {
    const domain = getDomain(url);
    return domain
      ? `https://www.google.com/s2/favicons?domain=${domain}`
      : null;
  };

  const fetchTitle = async url => {
    let returnURL;
    let title;
    try {
      const response = await api.get(
        `/api/url/meta?url=${encodeURIComponent(url)}`,
        {
          withCredentials: true,
        }
      );

      title = response.title;
      returnURL = url ? url.length < 100 : url.slice(0, 100) + "...";
      if (response.title.length > 100) {
        title = response.title.slice(0, 100) + "...";
      }

      return title || "";
    } catch (error) {
      return "";
    }
  };

  // Get both favicon and title
  const fetchMetadata = async url => {
    // Return cached data if available
    if (metadataCache.has(url)) {
      return metadataCache.get(url);
    }

    const [favicon, title] = await Promise.all([
      fetchFavicon(url),
      fetchTitle(url),
    ]);

    const metadata = { favicon, title };
    metadataCache.set(url, metadata);
    return metadata;
  };

  return fetchMetadata(url);
}

export function isValidHexColor(hex) {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

export function downloadBase64Image(
  base64Data,
  filename = "image",
  format = "png"
) {
  if (!base64Data.startsWith("data:image/")) {
    console.error("Invalid base64 image data.");
    return;
  }

  // Create an <a> element and trigger download
  const link = document.createElement("a");
  const mimeType = `image/${format.toLowerCase()}`;
  const base64Content = base64Data.replace(/^data:image\/\w+;base64,/, "");
  const finalBase64 = `data:${mimeType};base64,${base64Content}`;

  link.href = finalBase64;
  link.download = `${filename}.${format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const useDebouncedHexValidation = () => {
  const timeoutRef = useRef(null);

  const validate = (e, setColor, fallbackColor) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (isValidHexColor(e.target.value)) {
        setColor(e.target.value);
      }
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return validate;
};

export function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
}

export default {
  showAlert,
  validateInput,
};
