import api from "@/utils/api";
import { useEffect, useState } from "react";
import { useAuth } from "@/auth/auth";

export const useQRCode = () => {
  const [isQRCodeLoading, setQRCodeLoading] = useState(true);
  const [qrcodes, setQRCodes] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !user.email) return;

    const handleQRCodes = async () => {
      try {
        const response = await api.get("/api/user/qrcodes", {
          withCredentials: true,
        });
        setQRCodes(response.body || []);
      } catch (error) {
        console.log(error);
      } finally {
        setQRCodeLoading(false);
      }
    };

    handleQRCodes();
  }, [user]);

  return {
    qrcodes,
    isQRCodeLoading,
  };
};

export const useQRCodeSummary = () => {
  const [isQRCodeSummaryLoading, setQRCodeSummaryLoading] = useState(true);
  const [qrCodeSummary, setQRCodeSummary] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !user.email) return;

    const handleQRCodesSummary = async () => {
      try {
        const response = await api.get(`/api/user/qrcodes/summary/all`, {
          withCredentials: true,
        });
        setQRCodeSummary(response.body || []);
      } catch (error) {
        console.log(error);
      } finally {
        setQRCodeSummaryLoading(false);
      }
    };

    handleQRCodesSummary();
  }, [user]);

  return {
    qrCodeSummary,
    isQRCodeSummaryLoading,
  };
};
