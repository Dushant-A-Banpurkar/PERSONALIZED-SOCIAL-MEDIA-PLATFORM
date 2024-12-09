
import DynamicForm from "../../DynamicForm";
import useSignUp from "../../../hooks/login&signUp_hooks/useSignUp";

const SignUpPage: React.FC = () => {
  const [
    formData, 
    errors, 
    handleInputChange, 
    handleDateChange, 
    handleSubmit, 
  ] = useSignUp();

  return (
    <DynamicForm
      type="signUp"
      formData={formData}
      handleInputChange={handleInputChange}
      handleDateChange={handleDateChange}
      handleSubmit={handleSubmit}
      errors={errors}
    />
  );
};

export default SignUpPage;
