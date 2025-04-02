import Agent from "../Interview/Agent";
import Navbar from '../components/Navbar';
import { auth } from "firebase-admin";

export default function InterviewPage() {

 async function getCurrentUser() {
    const user = auth.currentUser;
    return user ? { uid: user.uid, email: user.email } : null;
  };

  const user = getCurrentUser();

  return (
    <>
    <Navbar/>
    <Agent userName={user?.name} userId={user?.uid} type="generate" />
    </>
  )
}
