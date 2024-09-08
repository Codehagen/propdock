"use client";

import { Button } from "@propdock/ui/components/button";
import axios from "axios";
import React from "react";

const TestPowerofficeButton = () => {
  const handleOAuth = async () => {
    try {
      const response = await axios.get("/api/oauth/poweroffice/initiate");
      const { url } = response.data;
      window.location.href = url;
    } catch (error) {
      console.error("Error initiating OAuth", error);
    }
  };

  return (
    <>
      <Button onClick={handleOAuth}>Connect with PowerOffice</Button>
      <Button
        onClick={() =>
          (window.location.href =
            "/api/oauth/poweroffice/callback?token=test-token")
        }
      >
        Test Callback
      </Button>
    </>
  );
};

export default TestPowerofficeButton;
