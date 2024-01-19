import PropTypes from "prop-types";

const Modal = ({
  title,
  footer,
  children,
  width,
  isOpen,
  setClose,
  ...props
}) => {
  const handleClose = () => {
    setClose(false);
  };
  return (
    <>
      {isOpen && (
        <div className=" fixed   bg-slate-12/60 flex justify-center items-center  backdrop-blur-md       inset-0  z-50 ">
          <div
            className={` ${
              isOpen
                ? "translate-y-[0%] duration-500 transition-all  "
                : "translate-y-[-20%] "
            }    overflow-hidden 
         text-gray-200   bg-white  sm:w-[${width}] rounded-xl    flex flex-col animate-notify  `}
            {...props}
          >
            <header className="flex items-center justify-between ">
              {typeof title === "string" ? (
                <div className="text-2xl font-semibold">{title}</div>
              ) : (
                title
              )}
              {/* {isOpen && (
                <div
                  className="flex justify-end   pr-3  py-3 w-full"
                  onClick={handleClose}
                >
                  <div>
                    <MdClear className=" text-[1.8rem]  text-zapp-black " />
                  </div>
                </div>
              )} */}
            </header>
            <main className="">{children}</main>
            {footer !== null && <footer>{footer}</footer>}
          </div>
        </div>
      )}
    </>
  );
};

Modal.defaultProps = {
  width: 400,
  footer: null,
  closebtn: true,
};

Modal.propTypes = {
  footer: PropTypes.node,
  children: PropTypes.node.isRequired,
  width: PropTypes.number,
  closebtn: PropTypes.bool.isRequired,
};

export default Modal;
