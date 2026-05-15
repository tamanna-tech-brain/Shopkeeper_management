import { data, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef,useState } from "react";
import { register , login, getUserById, updateUserById} from "../apis/api.js";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const nameRef = useRef();

    useEffect(() => {
        nameRef.current.focus();
    }, []);
    const handleRegister = async () => {
        try{
            if(!name || !email || !password) {
                alert("Fill all this field");
                return;
            }
            const res = await register({
                name: name,
                email: email,
                password: password,
            });
            alert("Registered successfully");
            console.log("Sending data:", { name, email, password });
            localStorage.setItem("userId", res.data.data._id);
            navigate('/login');

        }
        catch(error){
            alert(error.response?.data?.message || "Registration failed");

        }
    };
    return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-900 via-purple-900 to-pink-900">

    <div className="w-full max-w-md p-8 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">

    <h2 className="text-3xl font-bold text-white text-center mb-2">
    Create Account
    </h2>
    <p className="text-gray-300 text-center mb-6 text-sm">
      Start managing your shop smarter
    </p>

    <input
      ref={nameRef}
      placeholder="Full Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      className="w-full mb-4 p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-pink-400"
    />

    <input
      placeholder="Email Address"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full mb-4 p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-pink-400"
    />

    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full mb-6 p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-pink-400"
    />

    <button
      onClick={handleRegister}
      className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-105 transition transform shadow-lg"
    >
      Register Now
    </button>

    <p className="text-center mt-5 text-gray-300 text-sm">
      Already have an account?{" "}
      <span
        onClick={() => navigate("/login")}
        className="text-pink-400 cursor-pointer hover:underline"
      >
        Login
      </span>
    </p>

  </div>
</div>
  );
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {

  console.log("LOGIN FUNCTION STARTED");
    try {
      if (!email || !password) {
        alert("Fill all fields");
        return;
      }

      const res = await login({ email, password });
      console.log("LOGIN RESPONSE ", res.data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.data.role || "user");
      localStorage.setItem("userId", res.data.data._id);
      alert("Login successful");
      navigate(`/updateUser/${res.data.data._id}`);

    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-900 via-purple-900 to-pink-900">

    <div className="w-full max-w-md p-8 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">

    <h2 className="text-3xl font-bold text-white text-center mb-2">
    Welcome Back
    </h2>
    <p className="text-gray-300 text-center mb-6 text-sm">
    Login to your shop dashboard
    </p>

    <input
      placeholder="Email Address"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full mb-4 p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-indigo-400"
    />

    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full mb-6 p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-indigo-400"
    />

    <button
      onClick={handleLogin}
      className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 transition transform shadow-lg"
    >
      Login
    </button>

    <p className="text-center mt-5 text-gray-300 text-sm">
      New user?{" "}
      <span
        onClick={() => navigate("/register")}
        className="text-indigo-400 cursor-pointer hover:underline"
      >
        Create account
      </span>
    </p>

  </div>
</div>
  );
};

const UpdateUser = () => {
    const { id } = useParams();
    console.log("PARAM ID:", id);

    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const nameRef = useRef();

    useEffect(() => {
      nameRef.current.focus();
    }, []);

    const fetchUser = async () => {
      try{
        const res = await getUserById(id);

        console.log("USER DATA:", res.data);
        setUser(res.data.data);
        setName(res.data.data.name || "");
        setEmail(res.data.data.email || "");

      }
      catch(error){
        alert("failed to fetch user", error.message);
      }
    };

    useEffect(() => {
      if(id) {
      fetchUser();
      }
    }, [id]);
    const handleUpdate = async () =>{
      try{
        const res = await updateUserById(id, {
          name,
          email,
          password,
        });
        console.log("UPDATED:", res.data);
        setUser(res.data.data);

        alert(" updated");
        
        navigate ("/user");
      }catch(error) {
        console.log("Real error", error);
      }
    };
    return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-900 via-purple-900 to-pink-900">
    <div className="w-full max-w-md p-8 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
    <h2 className="text-3xl font-bold text-white text-center mb-2">
    update USer
    </h2>
    <input ref={nameRef}
    placeholder="Update name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    className="w-full mb-4 p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-pink-400"
    />

    <input
     placeholder="update email"
     value={email}
     onChange={(e) => setEmail(e.target.value)}
    className="w-full mb-4 p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-pink-400"
     />
     <input 
     type="password"
     placeholder="update password"
     value={password}
     onChange={(e) => setPassword(e.target.value)}
    className="w-full mb-4 p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-pink-400"
     />
     <button
      onClick={handleUpdate}
      className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-105 transition transform shadow-lg"
    >
      Update user
    </button>
    </div>

  </div>

    )
}

export {Login, Register, UpdateUser};


