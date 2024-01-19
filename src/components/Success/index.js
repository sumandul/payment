import { useNavigate } from "react-router-dom";

function Success() {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/");
  };
  return (
    <>
      <div className=" flex     min-h-screen justify-center items-center">
        <div className=" ">
          <span onClick={handleBack}> back</span>
          <h5 className="  font-semibold  text-green-500">
            Donation is successfully
          </h5>
        </div>
      </div>
    </>
  );
}

export default Success;
