import { useState } from "react";
import { database } from "../firebaseConfig";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { uuidv4 } from "@firebase/util";
import { AssignmentInterface } from "../types";
import { useRouter } from "next/router";

interface Props {
  classroomID: string;
}

const CreateAssignmentForm: React.FC<Props> = ({ classroomID }) => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [question, setQuestion] = useState("");

  const changeName = (event: React.ChangeEvent<HTMLInputElement>) =>
    setName(event.target.value);

  const changeQuestion = (event: React.ChangeEvent<HTMLTextAreaElement>) =>
    setQuestion(event.target.value);

  const createAssignment = async () => {
    const noUnnecessarySpacesName = name.trim().replace(/\s{2,}/g, " ");
    if (noUnnecessarySpacesName === "" || question.replaceAll(" ", "") === "")
      return;

    const assignmentID = uuidv4();

    const classroomDocumentReference = doc(
      database,
      `classrooms/${classroomID}`
    );

    const assignmentData: AssignmentInterface = {
      name: noUnnecessarySpacesName,
      question,
      answers: [],
      id: assignmentID,
    };

    try {
      await updateDoc(classroomDocumentReference, {
        assignments: arrayUnion(assignmentData),
      });

      router.push(`/classrooms/${classroomID}`);
    } catch {
      alert("Error creating the assignment... Try again later");
    }
  };

  const validateAssignment = (event: React.MouseEvent<HTMLInputElement>) => {
    event.preventDefault();

    const noUnnecessarySpacesName = name.trim().replace(/\s{2,}/g, " ");

    if (noUnnecessarySpacesName === "") {
      alert("Cannot create an assignment without a name");
      setName("");
    } else if (question.replaceAll(" ", "") === "") {
      alert("Cannot create an assignment without a question");
      setQuestion("");
    } else {
      createAssignment();
    }
  };

  return (
    <form className="flex justify-center">
      <div className="w-1/2 flex flex-col items-center gap-8">
        <div className="flex flex-col items-center w-full">
          <div className="flex justify-start w-4/5">
            <label
              htmlFor="name"
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
            >
              Name
            </label>
          </div>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={changeName}
            className="w-4/5 text-3xl p-3 rounded-md outline-none focus:bg-gray-100"
          />
        </div>
        <div className="flex flex-col items-center w-full">
          <div className="flex justify-start w-full">
            <label
              htmlFor="question"
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
            >
              Question
            </label>
          </div>
          <textarea
            name="question"
            id="question"
            value={question}
            onChange={changeQuestion}
            className="w-full h-96 text-3xl p-3 rounded-md outline-none focus:bg-gray-100"
          />
        </div>
        <input
          type="submit"
          value="Create"
          onClick={validateAssignment}
          className="mt-5 bg-blue-600 text-white py-3 px-12 rounded-lg font-bold text-3xl cursor-pointer hover:bg-blue-700 transition-colors"
        />
      </div>
    </form>
  );
};

export default CreateAssignmentForm;