import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { LogoutApi } from "../api";

export default function LogoutModal() {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const closeModal = () => {
    setIsOpen(false);
    console.log("클릭됨");
  };

  const handleLogout = async () => {
    try {
      const response = await LogoutApi();
      console.log("로그아웃 성공:", response);
      sessionStorage.removeItem("userId");
      sessionStorage.removeItem("nickname");
      navigate("/");
    } catch (error) {
      console.log("로그아웃 에러:", error);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-[#0000008d] "
      onClick={() => {
        closeModal();
      }}
    >
      <div
        className=" w-[20rem] h-[15rem] rounded-[2rem] shadow-lg bg-white flex flex-col justify-center items-center z-1001"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="text-lg font-semibold mb-4">로그아웃하시겠습니까?</div>
        <div className="flex flex-row justify-center gap-2">
          <button
            className="px-4 py-2 border border-black rounded-lg hover:bg-red-600"
            onClick={handleLogout}
          >
            확인
          </button>
          <button
            className="px-4 py-2 border border-black rounded-lg hover:bg-red-600"
            onClick={closeModal}
          >
            취소
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
