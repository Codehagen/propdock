"use client";

import { Button } from "@propdock/ui/components/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@propdock/ui/components/select";
import { toast } from "@propdock/ui/components/use-toast";
import { useState } from "react";

import { Modal } from "@/components/shared/modal";
import { useLanguageModal } from "@/hooks/use-language-modal";

// Add any additional imports for user feedback or styling

export const LanguageModal = () => {
  const languageModal = useLanguageModal();
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const handleLanguageSubmit = async () => {
    console.log("yeah");
  };

  return (
    <Modal
      showModal={languageModal.isOpen}
      setShowModal={languageModal.onClose}
    >
      <div className="w-full">
        <div className="flex flex-col items-center justify-center space-y-3 border-b bg-background px-4 py-6 pt-8 text-center md:px-16">
          {/* Modal header content */}
          <h3 className="font-bold font-urban text-2xl">Select Language</h3>
          <p className="text-gray-500 text-sm">
            Choose your preferred language for Propwrite. (You can always edit
            this in settings)
          </p>
        </div>
        <div className="flex flex-col space-y-4 bg-secondary/50 px-4 py-8 md:px-16">
          {/* Language selection dropdown */}
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Languages</SelectLabel>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="norwegian">Norsk</SelectItem>
                <SelectItem value="swedish">Svenska</SelectItem>
                {/* Add more languages as needed */}
              </SelectGroup>
            </SelectContent>
          </Select>
          {/* Submit button */}
          <Button onClick={handleLanguageSubmit} className="your-button-styles">
            Save Language
          </Button>
        </div>
      </div>
    </Modal>
  );
};
