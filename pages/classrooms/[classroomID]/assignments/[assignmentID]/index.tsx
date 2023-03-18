import { useRouter } from "next/router";
import Head from "next/head";
import Question from "../../../../../components/assignment/Question";
import { ChangeEvent, useEffect, useState } from "react";
import AssignmentHeader from "../../../../../components/assignment/AssignmentHeader";
import CodeEditor from "../../../../../components/general/CodeEditor";
import useAppContext from "../../../../../hooks/useAppContext";
import Header from "../../../../../components/general/Header";
import Sidebar from "../../../../../components/general/Sidebar";
import EmptyArea from "../../../../../components/general/EmptyArea";
import Information from "../../../../../components/general/Information";
import TeacherSidebar from "../../../../../components/general/TeacherSidebar";
import StudentSidebar from "../../../../../components/general/StudentSidebar";
import AssignmentStudentSidebar from "../../../../../components/assignment/AssignmentStudentSidebar";
import SubmittedStudentSidebar from "../../../../../components/assignment/SubmittedStudentSidebar";
import Loading from "../../../../../components/general/Loading";

const AssignmentPage: React.FC = () => {
  const { user, classroom, getClassroom } = useAppContext();

  const assignment = classroom?.assignments.find(
    (currentAssignment) => currentAssignment.id === assignmentID
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isCodeView, setIsCodeView] = useState(false);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState(
    assignment?.language ?? "javascript"
  );

  const router = useRouter();
  const { classroomID, assignmentID } = router.query as {
    classroomID: string;
    assignmentID: string;
  };

  useEffect(() => {
    getClassroom(classroomID).then(() => setIsLoading(false));
  }, [getClassroom, classroomID]);

  const toggleCodeView = () =>
    setIsCodeView((previousCodeView) => !previousCodeView);

  const closeCodeView = () => setIsCodeView(false);

  const changeCode = (newCode: string) => setCode(newCode);

  const changeLanguage = (event: ChangeEvent<HTMLSelectElement>) =>
    setLanguage(event.target.value);

  if (isLoading) return <Loading />;

  if (!classroom)
    return (
      <>
        <Head>
          <title>Classroom Not Found | SchoolBit</title>
        </Head>

        <Header title="Classroom Not Found" />

        <Sidebar />

        <EmptyArea>
          <Information
            primary="This classroom couldn't be accessed"
            secondary="Check with your teacher if you were accepted into the classroom"
          />
        </EmptyArea>
      </>
    );

  if (!assignment)
    return (
      <>
        <Head>
          <title>Assignment Not Found | SchoolBit</title>
        </Head>

        <Header title="Assignment Not Found" />

        {user?.uid === classroom.ownerID ? (
          <TeacherSidebar />
        ) : (
          <StudentSidebar />
        )}

        <EmptyArea>
          <Information
            primary="This assignment doesn't exist"
            secondary="Make sure you didn't change anything in the link"
          />
        </EmptyArea>
      </>
    );

  const didStudentSubmit = assignment.answers.some(
    (answer) => user?.uid === answer.senderID
  );

  const answer = assignment.answers.find(
    (currentAnswer) => currentAnswer.senderID === user?.uid
  );

  const isLanguageLocked = assignment?.isLanguageLocked ?? false;

  return (
    <>
      <Head>
        <title>{assignment.name} | SchoolBit</title>
      </Head>

      <Header title={assignment.name} />

      {user?.uid === classroom.ownerID ? (
        <>
          <TeacherSidebar />

          <EmptyArea>
            <AssignmentHeader />

            <Question question={assignment.question} />
          </EmptyArea>
        </>
      ) : (
        <>
          {didStudentSubmit ? (
            <>
              <SubmittedStudentSidebar
                isCodeView={isCodeView}
                toggleCodeView={toggleCodeView}
              />

              <EmptyArea>
                {isCodeView ? (
                  <CodeEditor
                    code={answer?.code ?? ""}
                    language={language}
                    changeLanguage={changeLanguage}
                    height="calc(100vh - 140px)"
                    width="100%"
                    isLanguageLocked
                  />
                ) : (
                  <>
                    <AssignmentHeader />

                    <Question question={assignment.question} />
                  </>
                )}
              </EmptyArea>
            </>
          ) : (
            <>
              <AssignmentStudentSidebar
                isCodeView={isCodeView}
                toggleCodeView={toggleCodeView}
                closeCodeView={closeCodeView}
                code={code}
                language={language}
              />

              <EmptyArea>
                {isCodeView ? (
                  <CodeEditor
                    code={code}
                    language={language}
                    changeLanguage={changeLanguage}
                    height="calc(100vh - 140px)"
                    width="100%"
                    changeCode={changeCode}
                    isLanguageLocked
                  />
                ) : (
                  <>
                    <AssignmentHeader />

                    <Question question={assignment.question} />
                  </>
                )}
              </EmptyArea>
            </>
          )}
        </>
      )}
    </>
  );
};

export default AssignmentPage;
