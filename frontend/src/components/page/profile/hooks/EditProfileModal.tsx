/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

interface AuthUser {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
}

interface EditProfileModalProps {
  authUser: AuthUser | null;
}

const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: async (formData: any) => {
      try {
        const res = await fetch("/api/users/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to update profile");
        }
        return data;
      } catch (error: any) {
        throw new Error(error.message || "Error updating profile");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  return { updateProfile: mutate, isUpdatingProfile: isLoading };
};

const EditProfileModal: React.FC<EditProfileModalProps> = ({ authUser }) => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    newPassword: "",
    currentPassword: "",
  });

  const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    const modal = document.getElementById("edit_profile_modal") as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  };

  useEffect(() => {
    if (authUser) {
      setFormData({
        firstname: authUser.firstname,
        lastname: authUser.lastname,
        username: authUser.username,
        email: authUser.email,
        newPassword: "",
        currentPassword: "",
      });
    }
  }, [authUser]);

  return (
    <>
      <button
        className="btn btn-outline rounded-full btn-sm"
        onClick={() =>
          document.getElementById("edit_profile_modal")?.showModal()
        }
      >
        Edit Profile
      </button>
      <dialog id="edit_profile_modal" className="modal">
        <div className="modal-box border rounded-md border-gray-700 shadow-lg p-6">
          <h3 className="font-bold text-2xl text-center text-indigo-600 mb-6">
            Update Your Profile
          </h3>
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              updateProfile(formData);
            }}
          >
            <div className="flex flex-col space-y-4">
              <input
                type="text"
                placeholder="First Name"
                className="input input-bordered w-full rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.firstname}
                name="firstname"
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Last Name"
                className="input input-bordered w-full rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.lastname}
                name="lastname"
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Username"
                className="input input-bordered w-full rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.username}
                name="username"
                onChange={handleInputChange}
              />
              <input
                type="email"
                placeholder="Email"
                className="input input-bordered w-full rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.email}
                name="email"
                onChange={handleInputChange}
              />
            </div>

            {/* Password Change Section */}
            <div className="flex flex-col space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                className="input input-bordered w-full rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.currentPassword}
                name="currentPassword"
                onChange={handleInputChange}
              />
              <input
                type="password"
                placeholder="New Password"
                className="input input-bordered w-full rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.newPassword}
                name="newPassword"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex justify-between gap-4">
              <button
                className={`btn btn-primary w-full rounded-full py-3 mt-4 ${
                  isUpdatingProfile ? "loading" : ""
                }`}
                type="submit"
              >
                {isUpdatingProfile ? "Updating..." : "Update Profile"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-secondary w-full rounded-full py-3 mt-4"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button className="outline-none">Close</button>
        </form>
      </dialog>
    </>
  );
};

export default EditProfileModal;
