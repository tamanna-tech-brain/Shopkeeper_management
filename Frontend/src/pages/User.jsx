import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { register, getUserById, updateUserById } from "../apis/api.js";
import { loginUser } from "../redux/authSlice.js";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Loader from "../components/common/Loader";
import {
  FaStore,
  FaEnvelope,
  FaLock,
  FaUser,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaShieldAlt,
  FaEdit,
  FaKey,
} from "react-icons/fa";

// ======================== REGISTER COMPONENT ======================== //
const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const nameRef = useRef();

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    try {
      if (!name || !email || !password) {
        return toast.error("Please fill in all fields");
      }
      if (password.length < 6) {
        return toast.error("Password must be at least 6 characters long");
      }

      setLoading(true);

      const res = await register({
        name,
        email,
        password,
      });

      toast.success("Account created successfully! Please log in.");
      if (res.data?.data?._id) {
        localStorage.setItem("userId", res.data.data._id);
      }
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/80 backdrop-blur-2xl shadow-2xl z-10">
        {/* Left Feature Showcase */}
        <div className="p-8 sm:p-10 bg-gradient-to-br from-indigo-900/40 via-slate-950 to-slate-950 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                <FaStore className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                ShopKeeper Pro
              </span>
            </div>

            <div className="mt-8 space-y-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Empower your retail store with smart management.
              </h2>
              <p className="text-sm text-slate-400">
                Join retailers tracking real-time POS, live inventory stocks, and supplier accounts.
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-3 pt-6 border-t border-slate-800/80">
            {[
              "Real-time Inventory & Barcode tracking",
              "Instant Point of Sale & GST invoicing",
              "Customer & Supplier CRM integration",
              "Expense logging & financial insights",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                <FaCheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Create an Account
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Start managing your shopkeeper operations in seconds.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              ref={nameRef}
              label="Full Name"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<FaUser className="w-3.5 h-3.5" />}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="name@business.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<FaEnvelope className="w-3.5 h-3.5" />}
              required
            />

            <div className="text-left">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FaLock className="w-3.5 h-3.5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm glass-input border border-slate-800 focus:border-indigo-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? (
                    <FaEyeSlash className="w-3.5 h-3.5" />
                  ) : (
                    <FaEye className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              loading={loading}
            >
              Register Store
            </Button>
          </form>

          <p className="text-center mt-6 text-xs text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-400 font-semibold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// ======================== LOGIN COMPONENT ======================== //
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth || {});

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const emailRef = useRef();

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      return toast.error("Please enter email and password");
    }

    const result = await dispatch(
      loginUser({
        email,
        password,
      })
    );

    if (result.meta?.requestStatus === "fulfilled") {
      toast.success("Welcome back! Login successful.");
      // Synchronize local storage user info
      if (result.payload?.data) {
        localStorage.setItem("user", JSON.stringify(result.payload.data));
      }
      navigate("/admin");
    } else {
      toast.error(result.payload || "Login failed. Check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-2xl shadow-2xl z-10 space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-indigo-600/30">
            <FaStore className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            ShopKeeper Pro
          </h2>
          <p className="text-xs text-slate-400">
            Enter your credentials to access your store portal.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            ref={emailRef}
            label="Email Address"
            type="email"
            placeholder="admin@shop.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<FaEnvelope className="w-3.5 h-3.5" />}
            required
          />

          <div className="text-left">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FaLock className="w-3.5 h-3.5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm glass-input border border-slate-800 focus:border-indigo-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
              >
                {showPassword ? (
                  <FaEyeSlash className="w-3.5 h-3.5" />
                ) : (
                  <FaEye className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2"
            loading={loading}
          >
            Sign In to Store
          </Button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Don't have an account yet?{" "}
          <Link
            to="/register"
            className="text-indigo-400 font-semibold hover:underline"
          >
            Create Store Account
          </Link>
        </p>
      </div>
    </div>
  );
};

// ======================== USER PROFILE & DASHBOARD ======================== //
const UserProfile = () => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "null") || {
    name: "Shopkeeper Admin",
    email: "admin@store.com",
    role: localStorage.getItem("role") || "admin",
  };

  const userId = storedUser._id || localStorage.getItem("userId");

  const [user, setUser] = useState(storedUser);
  const [name, setName] = useState(storedUser.name || "");
  const [email, setEmail] = useState(storedUser.email || "");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchUser = async (id) => {
    try {
      const res = await getUserById(id);
      if (res.data?.data) {
        setUser(res.data.data);
        setName(res.data.data.name || "");
        setEmail(res.data.data.email || "");
      }
    } catch (err) {
      console.warn("Could not fetch user by id:", err);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUser(userId);
    }
  }, [userId]);

  const handleUpdate = async (e) => {
    if (e) e.preventDefault();
    if (!userId) {
      return toast.error("User ID not found in session");
    }
    try {
      if (!name || name.trim().length < 3 || name.trim().length > 30) {
        return toast.error("Name must be between 3 and 30 characters");
      }
      if (!email) {
        return toast.error("Email is required");
      }
      if (!password || password.length < 6) {
        return toast.error("Password is required to confirm profile updates (minimum 6 characters)");
      }

      setSaving(true);
      const payload = {
        name: name.trim(),
        email: email.trim(),
        password,
      };

      const res = await updateUserById(userId, payload);
      toast.success("Profile updated successfully!");

      const updated = res.data?.data || { ...user, name: name.trim(), email: email.trim() };
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      setPassword("");
    } catch (error) {
      console.error(error);
      toast.error(error.message || error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 bg-slate-900/60 shadow-xl flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white font-black text-3xl flex items-center justify-center shadow-xl shadow-indigo-600/25">
            {user?.name ? user.name[0].toUpperCase() : "U"}
          </div>

          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                {user?.name || "Shopkeeper"}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {user?.role || "Admin"}
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">{user?.email}</p>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Account ID: {userId || "Active Session"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Active Store Account
          </span>
        </div>
      </div>

      {/* Account Settings Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white tracking-tight">
            Profile Settings
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Update your display name, store email, and confirm with your password.
          </p>
        </div>

        <form
          onSubmit={handleUpdate}
          className="md:col-span-2 glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 bg-slate-900/60 shadow-xl space-y-5"
        >
          <Input
            label="Full Display Name (3-30 chars)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={<FaUser className="w-3.5 h-3.5" />}
            required
          />

          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<FaEnvelope className="w-3.5 h-3.5" />}
            required
          />

          <Input
            label="Account Password (Required)"
            type="password"
            placeholder="Enter password (minimum 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<FaKey className="w-3.5 h-3.5" />}
            helperText="Password is required to confirm profile changes."
            required
          />

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              loading={saving}
              icon={<FaEdit className="w-3.5 h-3.5" />}
            >
              Save Profile Updates
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ======================== UPDATE USER COMPONENT (Route parameter fallback) ======================== //
const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchUserData = async (userId) => {
    try {
      setLoading(true);
      const res = await getUserById(userId);
      if (res.data?.data) {
        setName(res.data.data.name || "");
        setEmail(res.data.data.email || "");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load user info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUserData(id);
    }
  }, [id]);

  const handleUpdate = async (e) => {
    if (e) e.preventDefault();
    try {
      if (!name || name.trim().length < 3 || name.trim().length > 30) {
        return toast.error("Name must be between 3 and 30 characters");
      }
      if (!email) {
        return toast.error("Email is required");
      }
      if (!password || password.length < 6) {
        return toast.error("Password is required and must be at least 6 characters");
      }

      setSaving(true);
      const payload = {
        name: name.trim(),
        email: email.trim(),
        password,
      };

      await updateUserById(id, payload);
      toast.success("User updated successfully");
      navigate("/user");
    } catch (error) {
      console.error(error);
      toast.error(error.message || error.response?.data?.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader text="Loading user settings..." />;
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3 pb-2 border-b border-slate-800">
        <button
          onClick={() => navigate("/user")}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition"
        >
          <FaArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Update User Account
          </h1>
          <p className="text-xs text-slate-400 font-mono">ID: {id}</p>
        </div>
      </div>

      <form
        onSubmit={handleUpdate}
        className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 bg-slate-900/60 shadow-xl space-y-5"
      >
        <Input
          label="Name (3-30 chars)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Account Password (Required)"
          type="password"
          placeholder="Enter password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => navigate("/user")}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={saving}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export { Login, Register, UpdateUser, UserProfile };
export default Login;
