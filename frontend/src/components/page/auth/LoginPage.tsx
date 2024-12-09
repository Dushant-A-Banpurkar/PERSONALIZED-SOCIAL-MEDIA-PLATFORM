
import DynamicForm from "../../DynamicForm";
import useLogin from "../../../hooks/login&signUp_hooks/useLogin";

const LoginPage = () => {
  const { formData, handleInputChange, handleSubmit, errors } = useLogin();

  return (
    <div className="mt-4">
      <DynamicForm
        type="login"
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        errors={errors}
      />
    </div>
  );
};

export default LoginPage;
