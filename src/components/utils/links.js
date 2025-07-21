import api from "@/utils/api";
import { useEffect, useState } from "react";
import { useAuth } from "@/auth/auth";

export const useLink = () => {
  const [isLinkLoading, setLinkLoading] = useState(true);
  const [urls, setUrls] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !user.email) return;

    const handleLinks = async () => {
      try {
        const response = await api.get(`/api/user/urls`, {
          withCredentials: true,
        });
        setUrls(response.body || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLinkLoading(false);
      }
    };

    handleLinks();
  }, [user]);

  return {
    urls,
    isLinkLoading,
  };
};

export const useLinksSummary = () => {
  const [isLinkSummaryLoading, setLinkSummaryLoading] = useState(true);
  const [linkSummary, setLinkSummary] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !user.email) return;

    const handleLinksSummary = async () => {
      try {
        const response = await api.get(`/api/user/links/summary`, {
          withCredentials: true,
        });
        setLinkSummary(response.body || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLinkSummaryLoading(false);
      }
    };

    handleLinksSummary();
  }, [user]);

  return {
    linkSummary,
    isLinkSummaryLoading,
  };
};
