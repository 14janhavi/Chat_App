import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Lock } from "lucide-react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile, checkAuth } =
    useAuthStore();

  const [selectedImg, setSelectedImg] = useState(null);
  const [fullName, setFullName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (authUser) {
      setFullName(authUser.fullName);
    }
  }, [authUser]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = async () => {
      const base64Image = reader.result;

      setSelectedImg(base64Image);

      await updateProfile({
        profilePic: base64Image,
      });

      checkAuth();
    };

    reader.readAsDataURL(file);
  };
const handleSave = async () => {
  const updatedUser = await updateProfile({
    fullName,
    currentPassword,
    newPassword,
  });

  if (updatedUser) {
    checkAuth();

    setCurrentPassword("");
    setNewPassword("");

    toast.success("Profile Updated Successfully");
  }
};

  if (!authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">

        <div className="bg-base-300 rounded-xl p-6 space-y-8">

          <div className="text-center">
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="mt-2 text-zinc-400">
              Update your account information
            </p>
          </div>

          {/* PROFILE IMAGE */}

          <div className="flex flex-col items-center gap-4">

            <div className="relative">

              <img
                src={selectedImg || authUser.profilePic || "/avatar.jpeg"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 border-primary"
              />

              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-primary p-3 rounded-full cursor-pointer hover:scale-110 transition ${
                  isUpdatingProfile
                    ? "pointer-events-none animate-pulse"
                    : ""
                }`}
              >
                <Camera className="w-5 h-5 text-white" />

                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            <p className="text-sm text-zinc-400">
              Click camera icon to change your profile picture
            </p>

          </div>

          {/* FULL NAME */}

          <div>

            <label className="flex items-center gap-2 mb-2">
              <User size={18} />
              Full Name
            </label>

            <input
              type="text"
              className="input input-bordered w-full"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

          </div>

          {/* EMAIL */}

          <div>

            <label className="flex items-center gap-2 mb-2">
              <Mail size={18} />
              Email
            </label>

            <input
              type="email"
              className="input input-bordered w-full"
              value={authUser.email}
              disabled
            />

          </div>

          {/* CURRENT PASSWORD */}

          <div>

            <label className="flex items-center gap-2 mb-2">
              <Lock size={18} />
              Current Password
            </label>

            <input
              type="password"
              className="input input-bordered w-full"
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(e.target.value)
              }
            />

          </div>

          {/* NEW PASSWORD */}

          <div>

            <label className="flex items-center gap-2 mb-2">
              <Lock size={18} />
              New Password
            </label>

            <input
              type="password"
              className="input input-bordered w-full"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
            />

          </div>

          {/* SAVE BUTTON */}

          <button
            className="btn btn-primary w-full"
            onClick={handleSave}
          >
            Save Changes
          </button>

          {/* ACCOUNT INFO */}

          <div className="bg-base-200 rounded-xl p-5">

            <h2 className="text-xl font-semibold mb-4">
              Account Information
            </h2>

            <div className="flex justify-between border-b py-2">

              <span>Member Since</span>

              <span>
                {authUser.createdAt
                  ? authUser.createdAt.split("T")[0]
                  : "N/A"}
              </span>

            </div>

            <div className="flex justify-between py-2">

              <span>Status</span>

              <span className="text-green-500">
                Active
              </span>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ProfilePage;