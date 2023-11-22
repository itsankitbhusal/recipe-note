import { useEffect } from "react";
import { useForm } from "react-hook-form";

import ErrorMessage from "./ErrorMessage";
import { useState } from "react";

const AddRecipeModal = ({ isOpen, onClose, onSave, updateData, edit }) => {
  const [selectedFile, setSelectedFile] = useState(false);
  const [showFile, setShowFile] = useState(false);

  const [isInputFile, setIsInputFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  useEffect(() => {
    if (updateData) {
      setValue("title", updateData[0].title);
      setValue("description", updateData[0].description);
      setValue("ingredients", updateData[0].ingredients.join(", "));
      setValue("image", updateData[0].image);
      setValue("imageList", null);
    }
  }, [updateData]);

  const handleSave = (data) => {
    if (data.ingredients) {
      const ingArr = data.ingredients.split(",");
      if (updateData) {
        const id = updateData[0].id;
        const newData = { id, ...data, ingredients: ingArr };
        onSave(newData);
        onClose();
        setIsInputFile(false);
        reset();
      } else {
        const newData = { ...data, ingredients: ingArr };
        onSave(newData);
        onClose();
        setIsInputFile(false);
        reset();
      }
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div
          className="inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle md:max-w-2xl lg:max-w-4xl sm:max-w-lg sm:w-screen"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <form onSubmit={handleSubmit(handleSave)}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900"
                    id="modal-headline"
                  >
                    {edit ? "Edit Recipe Detail" : "Add New Recipe"}
                  </h3>
                  <div className=" flex gap-2 items-center">
                    <label className="text-gray-600">
                      What option do you want for the image?
                    </label>
                    <div className="relative inline-flex">
                      <select
                        name="image"
                        onChange={(e) => {
                          if (e.target.value === "imageUpload") {
                            setIsInputFile(true);
                          } else {
                            setIsInputFile(false);
                          }
                        }}
                        value={isInputFile ? "imageUpload" : "placeUrl"}
                        className="rounded-md font-medium border-none p-2 pl-5 pr-8 focus:outline-none focus:border-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="placeUrl">Place URL</option>
                        <option value="imageUpload">Image Upload</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-2">
                    {!isInputFile ? (
                      <input
                        type="text"
                        name="image"
                        id="image"
                        placeholder="Image URL"
                        {...register("image", {
                          required: false,
                        })}
                        className="mt-2 p-2 w-full border border-gray-300 rounded"
                      />
                    ) : (
                      <div className=" relative">
                        <input
                          type="file"
                          name="imageFile"
                          accept="image/png, image/jpeg"
                          {...register("imageFile", {
                            required: false,
                          })}
                          onChange={(e) => {
                            const fileList = e.target.files;
                            if (fileList) {
                              try {
                                setSelectedFile(
                                  URL.createObjectURL(fileList[0])
                                );
                              } catch (error) {
                                setSelectedFile(false);
                              }
                            }
                          }}
                          onMouseEnter={() => {
                            if (selectedFile) {
                              setShowFile(true);
                            }
                          }}
                          onMouseLeave={() => {
                            if (selectedFile) {
                              setShowFile(false);
                            }
                          }}
                          className="w-full file:mr-4 mt-2 p-2 border border-gray-300 rounded file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold hover:file:cursor-pointer hover:file:bg-gray-200"
                        />
                        {selectedFile && (
                          <div className=" hidden lg:flex absolute text-xs text-green-700">
                            Hover filename for image preview
                          </div>
                        )}
                        {showFile && (
                          <div className=" absolute right-0 top-16">
                            <img
                              src={selectedFile}
                              className=" object-cover w-auto h-[200px] rounded drop-shadow-2xl"
                              alt=""
                            />
                          </div>
                        )}
                      </div>
                    )}

                    <div className=" mt-4">
                      <input
                        type="text"
                        name="title"
                        id="title"
                        placeholder="Recipe Title"
                        {...register("title", {
                          required: true,
                          minLength: 4,
                          maxLength: 150,
                        })}
                        className="mt-2 p-2 w-full border border-gray-300 rounded"
                      />
                      {errors.title && errors.title.type === "required" && (
                        <ErrorMessage message="Title is required!" />
                      )}
                      {errors.title && errors.title.type === "minLength" && (
                        <ErrorMessage message="Minimum length id 4 chars!" />
                      )}
                      {errors.title && errors.title.type === "maxLength" && (
                        <ErrorMessage message="Minimum length id 150 chars!" />
                      )}
                    </div>
                    <div className=" flex gap-2 mt-4 flex-col md:flex-row justify-center items-center">
                      <div className=" w-8/12">
                        <textarea
                          name="description"
                          id="description"
                          rows="4"
                          placeholder="Recipe Description"
                          {...register("description", {
                            required: true,
                            minLength: 150,
                            maxLength: 3000,
                          })}
                          className="mt-2 p-2 h-[20vh] md:h-[40vh] w-full border border-gray-300 rounded"
                        />
                        {errors.description &&
                          errors.description.type === "required" && (
                            <ErrorMessage message="Description is required!" />
                          )}
                        {errors.description &&
                          errors.description.type === "minLength" && (
                            <ErrorMessage message="Minimum length id 150 chars!" />
                          )}
                        {errors.description &&
                          errors.description.type === "maxLength" && (
                            <ErrorMessage message="Minimum length id 3000 chars!" />
                          )}
                      </div>
                      <div className=" w-4/12">
                        <textarea
                          type="text"
                          name="ingredients"
                          id="ingredients"
                          rows="4"
                          placeholder="Ingredients (comma-separated)"
                          {...register("ingredients", {
                            required: true,
                            minLength: 4,
                          })}
                          className="mt-2 p-2 h-[20vh] md:h-[40vh] w-full border border-gray-300 rounded"
                        />
                        {errors.ingredients &&
                          errors.ingredients.type === "required" && (
                            <ErrorMessage message="Ingredients is required!" />
                          )}
                        {errors.ingredients &&
                          errors.ingredients.type === "minLength" && (
                            <ErrorMessage message="Minimum length id 4 chars!" />
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Save
              </button>
              <button
                onClick={() => {
                  onClose();
                  setValue();
                  setSelectedFile(false);
                  setValue("imageFile", null); 
                  reset();
                }}
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRecipeModal;
