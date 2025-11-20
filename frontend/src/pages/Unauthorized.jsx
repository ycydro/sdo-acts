import { Link } from "react-router";

const Unauthorized = () => {
  return (
    <div className="flex items-center justify-center min-h-[100%] max-h-screen overflow-hidden bg-[#f4f4f4]">
      <div className="flex flex-col gap-3 text-center">
        <h1 className="text-7xl md:text-5xl">401 Unauthorized</h1>
        <Link className="text-primary ml-1 hover:underline" to={"/main"}>
          Go back to Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
