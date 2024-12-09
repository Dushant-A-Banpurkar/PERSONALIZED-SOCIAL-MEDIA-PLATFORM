/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  useMutation,
  useQueryClient,
  UseMutationResult,
  UseMutationOptions,
} from "@tanstack/react-query";
import { ZodError } from "zod";
import { signUpSchema } from "../../components/DynamicForm";
import toast from "react-hot-toast";
import { DateObject } from "react-multi-date-picker";

interface SignUpForm {
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  password: string;
  dateofbirth: string;
  confirmPassword: string;
}

const signUp = async (data: SignUpForm): Promise<any> => {
  console.log("Sending request with data:", data);
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create account");
  }

  return response.json();
};

const useSignUp = (): [
  SignUpForm,
  Record<string, string>,
  (e: React.ChangeEvent<HTMLInputElement>) => void,
  (date: DateObject | null) => void,
  (e: React.FormEvent) => Promise<void>,
  UseMutationResult<any, unknown, SignUpForm, unknown>
] => {
  const [formData, setFormData] = useState<SignUpForm>({
    email: "",
    password: "",
    confirmPassword: "",
    firstname: "",
    lastname: "",
    username: "",

    dateofbirth: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();

  const mutation: UseMutationResult<any, Error, SignUpForm> = useMutation({
    mutationFn: signUp,
    onError: (error: any) => {
      setErrors({ general: error.message });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Account created successfully");
    },
  } as UseMutationOptions<any, Error, SignUpForm>);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: DateObject | null) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        dateofbirth: date.format("YYYY-MM-DD"),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      signUpSchema.parse(formData);
      mutation.mutate(formData);
    } catch (err) {
      if (err instanceof ZodError) {
        const formattedErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          formattedErrors[error.path[0]] = error.message;
        });
        setErrors(formattedErrors);
      }
    }
  };

  return [
    formData,
    errors,
    handleInputChange,
    handleDateChange,
    handleSubmit,
    mutation,
  ];
};

export default useSignUp;
