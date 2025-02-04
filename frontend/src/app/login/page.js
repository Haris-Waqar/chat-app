"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image"; // Import the Next.js Image component
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Page() {
  // ---------------------------------------- States Start Here ----------------------------------------
  const [formData, setFormData] = useState({ email: "", password: "" });
  const router = useRouter(); // Initialize useRouter
  const { user, login, logout } = useAuth();
  // ---------------------------------------- States End Here ----------------------------------------

  // ----------------------------------------  Methods Start Here ----------------------------------------------
  /**
   * @description Sign In. This method is used to sign in the user to the application. It makes an API call to the server to authenticate the user.
   * @param {*} event
   * @returns {void}
   */
  const SignIn = async (event) => {
    try {
      event.preventDefault();
      const payload = {
        email: formData.email,
        password: formData.password,
      };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
        payload
      );
      //   route to chat page
      const data = response.data.data;
      console.log("User Data", data);
      // Set user data using login function
      localStorage.setItem("token", JSON.stringify(response.data.token)); // Save user data to localStorage

      login(data);

      router.push("/dashboard");
    } catch (error) {
      console.error("Sign In", error);
    }
  };

  /**
   * @description Handle Change. This method is used to handle the change of the form data.
   * @param {*} event
   * @returns {void}
   */
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  // ----------------------------------------  Methods End Here ----------------------------------------------

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 ">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          {/* Use Next.js Image component for image optimization */}
          <Image
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
            width={40}
            height={40}
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Log in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white shadow-lg p-8 rounded-lg">
            <form className="space-y-6" onSubmit={SignIn} method="POST">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>

                  <a
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                    href="#"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 p-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Log in
                </button>
              </div>
            </form>
            <p className="mt-10 text-center text-sm text-gray-500">
              Dont have an account?{" "}
              <Link
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                href="/signup"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
