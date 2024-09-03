import React, { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./PromotionForm.css";

const todayDate = () => {
  const today = new Date();
  return new Date(today.setHours(0, 0, 0, 0));
};

const validationSchema = Yup.object().shape({
  startDate: Yup.date()
    .min(todayDate(), "Start date cannot be in the past")
    .required("Start date is required"),
  endDate: Yup.date()
    .min(Yup.ref("startDate"), "End date cannot be before start date")
    .required("End date is required"),
  displayStartDate: Yup.date()
    .min(todayDate(), "Display start date cannot be in the past")
    .required("Display start date is required"),
  displayEndDate: Yup.date()
    .min(
      Yup.ref("displayStartDate"),
      "Display end date cannot be before display start date"
    )
    .required("Display end date is required"),
  discountAmount: Yup.number()
    .min(0, "Discount amount must be greater than or equal to 0")
    .max(100, "Discount amount cannot exceed 100")
    .required("Discount amount is required"),
  description: Yup.string().required("Description is required"),
  categories: Yup.array()
    .min(1, "At least one category must be selected")
    .required("Categories are required"),
  image: Yup.mixed()
    .required("Image is required")
    .test(
      "fileSize",
      "File size is too large",
      (value) => !value || (value && value.size <= 5 * 1024 * 1024)
    ) // 5MB limit
    .test(
      "fileType",
      "Unsupported file type",
      (value) => !value || ["image/jpeg", "image/png"].includes(value.type)
    ),
});

const PromotionForm = ({ onClose }) => {
  const [allData, setAllData] = useState([]);
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/prices");
        setAllData(response.data);

        const uniqueTypes = [
          ...new Set(response.data.map((item) => item.type)),
        ];
        setTypes(uniqueTypes);
        console.log("Fetched all data:", response.data);
        console.log("Unique types:", uniqueTypes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedType) {
      const filteredCategories = allData
        .filter((item) => item.type === selectedType)
        .map((item) => item.category);
      const uniqueCategories = [...new Set(filteredCategories)];
      setCategories(uniqueCategories);
      console.log("Filtered categories:", filteredCategories);
      console.log("Unique categories:", uniqueCategories);
    } else {
      setCategories([]);
    }
  }, [selectedType, allData]);

  return (
    <div className="promotion-form">
      <h2>Add New Promotion</h2>
      <Formik
        initialValues={{
          startDate: "",
          endDate: "",
          displayStartDate: "",
          displayEndDate: "",
          discountAmount: "",
          description: "",
          categories: [],
          image: null,
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          const formData = new FormData();
          formData.append(
            "startDate",
            new Date(values.startDate).toISOString()
          );
          formData.append("endDate", new Date(values.endDate).toISOString());
          formData.append(
            "startDisplay",
            new Date(values.displayStartDate).toISOString()
          );
          formData.append(
            "endDisplay",
            new Date(values.displayEndDate).toISOString()
          );
          formData.append("discountAmount", values.discountAmount);
          formData.append("description", values.description);
          formData.append("categories", JSON.stringify(values.categories));

          if (values.image) {
            formData.append("image", values.image);
          }

          console.log("FormData contents before sending:");
          formData.forEach((value, key) => {
            console.log(key, value);
          });

          try {
            const token = localStorage.getItem("accessToken");
            await axios.post(
              "http://localhost:8080/promotions/api/add",
              formData,
              {
                headers: {
                  Authorization: `${token}`,
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            alert("Promotion has been added!");
            onClose();
          } catch (error) {
            console.error("Error adding promotion:", error);
            alert("An error occurred while adding the promotion!");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ setFieldValue, values, isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label>Start Date:</label>
              <div className="error-container">
                <Field type="date" name="startDate" />
                <ErrorMessage name="startDate">
                  {(msg) => <div className="error-message">{msg}</div>}
                </ErrorMessage>
              </div>
            </div>
            <div className="form-group">
              <label>End Date:</label>
              <div className="error-container">
                <Field type="date" name="endDate" />
                <ErrorMessage name="endDate">
                  {(msg) => <div className="error-message">{msg}</div>}
                </ErrorMessage>
              </div>
            </div>
            <div className="form-group">
              <label>Display Start Date:</label>
              <div className="error-container">
                <Field type="date" name="displayStartDate" />
                <ErrorMessage name="displayStartDate">
                  {(msg) => <div className="error-message">{msg}</div>}
                </ErrorMessage>
              </div>
            </div>
            <div className="form-group">
              <label>Display End Date:</label>
              <div className="error-container">
                <Field type="date" name="displayEndDate" />
                <ErrorMessage name="displayEndDate">
                  {(msg) => <div className="error-message">{msg}</div>}
                </ErrorMessage>
              </div>
            </div>
            <div className="form-group">
              <label>Type:</label>
              <div className="error-container">
                <Field
                  as="select"
                  name="type"
                  onChange={(e) => {
                    const selectedType = e.target.value;
                    setFieldValue("type", selectedType);
                    setSelectedType(selectedType);
                    setFieldValue("categories", []); // Reset categories
                  }}
                >
                  <option value="">Select Type</option>
                  {types.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="type">
                  {(msg) => <div className="error-message">{msg}</div>}
                </ErrorMessage>
              </div>
            </div>
            {selectedType && (
              <div className="form-group">
                <label>Categories:</label>
                <div className="error-container">
                  {categories.map((category, index) => (
                    <div className="checkbox-group" key={index}>
                      <label>{category}</label>
                      <Field
                        type="checkbox"
                        name="categories"
                        value={category}
                        checked={values.categories.includes(category)}
                        onChange={() => {
                          const newCategories = values.categories.includes(
                            category
                          )
                            ? values.categories.filter((c) => c !== category)
                            : [...values.categories, category];
                          setFieldValue("categories", newCategories);
                        }}
                      />
                    </div>
                  ))}
                  <ErrorMessage name="categories">
                    {(msg) => <div className="error-message">{msg}</div>}
                  </ErrorMessage>
                </div>
              </div>
            )}
            <div className="form-group">
              <label>Discount Amount (%):</label>
              <div className="error-container">
                <Field type="number" name="discountAmount" />
                <ErrorMessage name="discountAmount">
                  {(msg) => <div className="error-message">{msg}</div>}
                </ErrorMessage>
              </div>
            </div>
            <div className="form-group">
              <label>Description:</label>
              <div className="error-container">
                <Field as="textarea" name="description" rows={4} />
                <ErrorMessage name="description">
                  {(msg) => <div className="error-message">{msg}</div>}
                </ErrorMessage>
              </div>
            </div>
            <div className="form-group">
              <label>Image:</label>
              <div className="error-container">
                <input
                  type="file"
                  name="image"
                  onChange={(event) => {
                    const file = event.currentTarget.files[0];
                    setFieldValue("image", file);
                  }}
                />
                <ErrorMessage name="image">
                  {(msg) => <div className="error-message">{msg}</div>}
                </ErrorMessage>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Add Promotion"}
              </button>
              <button type="button" onClick={onClose}>
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PromotionForm;
