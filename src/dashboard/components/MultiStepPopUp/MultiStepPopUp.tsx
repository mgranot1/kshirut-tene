import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { ReactElement, useState } from "react";
import "./MultiStepPopUp.scss";

interface IMultiStepPopUpProps {
  open: boolean;
  onClose: () => void;
  steps: {
    title: string;
    content: ReactElement;
  }[];
  onSubmit: () => void;
  height?: string;
  isEditMode?: boolean;
  disable?: boolean;
}

const MultiStepPopUp = ({
  steps,
  open,
  onClose,
  onSubmit,
  height = "30vh",
  isEditMode = true,
}: IMultiStepPopUpProps) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      try {
        await onSubmit();
        setCurrentStep(0);
      } catch (e) {}
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const wrapClose = () => {
    onClose();
    setCurrentStep(0);
  };

  const handleDialogClose = (_event: object, reason: string) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      return;
    }

    wrapClose();
  };

  const isLastStep: boolean = currentStep === steps.length - 1;
  const isFirstStep: boolean = currentStep === 0;

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      maxWidth="lg"
      fullWidth
      sx={{ overflow: "hidden" }}
      classes={{ paper: "multiStepDialog" }}
      transitionDuration={0}
    >
      <DialogTitle sx={{ fontSize: "1rem" }}>
        {steps[currentStep].title}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={wrapClose}
        sx={{ position: "absolute", right: 5, top: 5 }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers sx={{ height }}>
        {steps[currentStep].content}
      </DialogContent>
      <DialogActions>
        {!isFirstStep && (
          <button className="back-button" onClick={handleBack}>
            חזור
          </button>
        )}
        <button className="next-button" onClick={handleNext}>
          <div className="next-button__text">
            {isLastStep ? (isEditMode ? "שמירה" : "סגירה") : "המשך"}
          </div>
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default MultiStepPopUp;
