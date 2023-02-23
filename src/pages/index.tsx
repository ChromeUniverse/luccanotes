import { GetServerSideProps, NextPage } from "next";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import PageLayout from "../components/Layouts/Page";
import { getServerAuthSession } from "../server/auth";

export const getServerSideProps: GetServerSideProps<{
  session: null;
}> = async (context) => {
  const session = await getServerAuthSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/notes",
        permanent: false,
      },
    };
  }

  // Pass data to the page via props
  return { props: { session: null } };
};

const Home: NextPage = () => {
  return <PageLayout container>welcome to LuccaNotes</PageLayout>;
};

export default Home;
