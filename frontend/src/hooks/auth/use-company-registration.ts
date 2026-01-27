// "use client";

// import { useState } from "react";
// import { validateStep } from "@/src/lib/validations/company-registration.validation";
// import {
//   CompanyRegistrationFormData,
//   FormErrors,
// } from "@/src/types/auth/company-registeration/company-registration.types";

// export function useCompanyRegistration() {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [formData, setFormData] = useState<CompanyRegistrationFormData>({
//     companyName: "",
//     companyEmail: "",
//     companySize: "",
//     industry: "",
//     website: "",
//     firstName: "",
//     lastName: "",
//     email: "",
//     phoneNumber: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [errors, setErrors] = useState<FormErrors>({});

//   const handleChange = (name: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   const nextStep = () => {
//     const validationErrors = validateStep(currentStep, formData);
//     if (Object.keys(validationErrors).length === 0) {
//       setCurrentStep((s) => s + 1);
//     } else {
//       setErrors(validationErrors);
//     }
//   };

//   const prevStep = () => setCurrentStep((s) => s - 1);

//   return {
//     formData,
//     errors,
//     currentStep,
//     setCurrentStep,
//     handleChange,
//     nextStep,
//     prevStep,
//   };
// }
