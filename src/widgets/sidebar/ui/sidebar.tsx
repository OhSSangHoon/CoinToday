import { useState } from "react";
import { CoinList, Mypage } from "../../../features";
import { Link } from "react-router-dom";
import { LogoutModal } from "../../../features/auth/ui";

export default function SideBar() {
  const [sidebar, setSidebar] = useState<{
    isOpen: boolean;
    content: React.ReactNode | null;
    type: string | null;
  }>({
    isOpen: false,
    content: null,
    type: null,
  });

  const toggleSidebar = (type: string, component: React.ReactNode) => {
    setSidebar((prev) => ({
      isOpen: prev.type === type ? !prev.isOpen : true, // 같은 타입이면 토글, 다르면 유지
      content: prev.type === type ? prev.content : component, // 같은 타입이면 그대로, 다르면 변경
      type: prev.type === type ? null : type, // 같은 타입이면 초기화, 다르면 변경
    }));
  };

  const closeSideBar = () => {
    setSidebar({ isOpen: false, content: null, type: null });
  };

  return (
    <div className="fixed z-[1001] w-[60px] h-screen border border-gray-600 bg-black text-white">
      <Link
        to="/"
        className="block p-2 text-wheat no-underline"
        onClick={() => closeSideBar()}
      >
        홈
      </Link>
      <div>
        <a href="/news">뉴스홈</a>
      </div>
      <Link
        to="/exchange/BTC"
        className="block p-2 text-wheat no-underline "
        onClick={() => closeSideBar()}
      >
        거래소
      </Link>
      <div
        className="cursor-pointer p-2 hover:bg-white/10"
        onClick={() => toggleSidebar("Mypage", <Mypage />)}
      >
        내 투자
      </div>
      <div
        className="cursor-pointer p-2 hover:bg-white/10"
        onClick={() => toggleSidebar("CoinList", <CoinList />)}
      >
        코인 리스트
      </div>
      {sessionStorage.getItem("userId") && (
        <div onClick={() => toggleSidebar("logout", <LogoutModal />)}>
          로그아웃
        </div>
      )}

      {sidebar.isOpen && (
        <div className="absolute -top-[1px] left-[60px] h-screen w-screen flex flex-row justify-start items-center">
          <div className="w-100 h-screen bg-[#101013] z-[1000]">
            {sidebar.content}
          </div>
          <div
            className="h-full w-full"
            onClick={() =>
              setSidebar({ isOpen: false, content: null, type: null })
            }
          ></div>
        </div>
      )}
    </div>
  );
}
