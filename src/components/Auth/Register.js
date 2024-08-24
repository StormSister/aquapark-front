import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(4, "Username must be at least 4 characters"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    // If username is not provided, set it to the email
    if (!values.username) {
      values.username = values.email;
    }

    fetch("http://localhost:8080/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text(); // Zmiana tutaj
      })
      .then((data) => {
        console.log("Registration successful:", data);
        setMessage("Registration was successful!");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      })
      .catch((error) => {
        console.error("Error during registration:", error);
        setMessage("Registration failed.");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          phoneNumber: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <Field
                type="text"
                id="username"
                name="username"
                className="form-control"
              />
              <ErrorMessage name="username" component="div" className="error" />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <Field
                type="email"
                id="email"
                name="email"
                className="form-control"
              />
              <ErrorMessage name="email" component="div" className="error" />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <Field
                type="password"
                id="password"
                name="password"
                className="form-control"
              />
              <ErrorMessage name="password" component="div" className="error" />
            </div>

            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <Field
                type="text"
                id="firstName"
                name="firstName"
                className="form-control"
              />
              <ErrorMessage
                name="firstName"
                component="div"
                className="error"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <Field
                type="text"
                id="lastName"
                name="lastName"
                className="form-control"
              />
              <ErrorMessage name="lastName" component="div" className="error" />
            </div>

            <div className="mb-3">
              <label htmlFor="phoneNumber" className="form-label">
                Phone Number
              </label>
              <Field
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                className="form-control"
              />
              <ErrorMessage
                name="phoneNumber"
                component="div"
                className="error"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              Register
            </button>
            {message && <div className="alert alert-info">{message}</div>}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;
