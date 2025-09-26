import { Link } from "react-router";

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f4f4f4]">
      <div className="flex flex-col gap-3 text-center">
        <h1 className="text-7xl md:text-5xl">404 Not Found</h1>
        <Link className="text-primary ml-1 hover:underline" to={"/login"}>
          Go back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
