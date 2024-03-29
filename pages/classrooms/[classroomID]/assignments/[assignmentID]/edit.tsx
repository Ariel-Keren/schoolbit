import Head from "next/head";
import EditAssignmentForm from "../../../../../components/edit/EditAssignmentForm";
import { useRouter } from "next/router";
import useAppContext from "../../../../../hooks/useAppContext";
import { useEffect, useState } from "react";
import Header from "../../../../../components/general/Header";
import Sidebar from "../../../../../components/general/Sidebar";
import EmptyArea from "../../../../../components/general/EmptyArea";
import Information from "../../../../../components/general/Information";
import TeacherSidebar from "../../../../../components/general/TeacherSidebar";
import StudentSidebar from "../../../../../components/general/StudentSidebar";
import Loading from "../../../../../components/general/Loading";

const EditAssignmentPage: React.FC = () => {
  const { user, classroom, getClassroom } = useAppContext();

  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const { classroomID, assignmentID } = router.query as {
    classroomID: string;
    assignmentID: string;
  };

  useEffect(() => {
    getClassroom(classroomID).then(() => setIsLoading(false));
  }, [getClassroom, classroomID]);

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

  const assignment = classroom.assignments.find(
    (currentAssignment) => currentAssignment.id === assignmentID
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

  return (
    <>
      <Head>
        <title>Edit &quot;{assignment.name}&quot; | SchoolBit</title>
      </Head>

      <Header title={`Edit "${assignment.name}"`} />

      {user?.uid === classroom.ownerID ? (
        <>
          <TeacherSidebar />

          <EmptyArea>
            <EditAssignmentForm />
          </EmptyArea>
        </>
      ) : (
        <>
          <StudentSidebar />

          <Information
            primary="You're not eligible for editing assignments"
            secondary="Only the teacher can edit assignments"
          />
        </>
      )}
    </>
  );
};

export default EditAssignmentPage;
