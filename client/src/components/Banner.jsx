import { IoBagHandleOutline } from "react-icons/io5";
import Imgleaf from "../assets/img/leaf.png";
import Imgtree from "../assets/img/tree.png";
import { Link } from 'react-router-dom';
export default function Banner() {
  const userId = localStorage.getItem("userId");

 
  return (
    <section>
      <div className="container grid grid-cols-1 md:grid-cols-2 min-h-[650px] relative">
        {/*brand infor*/}
        <div className="flex flex-col justify-center py-14 md:py-0 relative z-10">
          <div className="text-center md:text-left space-y-6 lg:max-w-[400px]:">
            <h1 className="text-5xl lg:text-6xl font-bold leading-relaxed xl:leading-loose font-averia">
              Cây Xanh
              <br />
              <span className="text-secondary">Tươi tốt</span>
            </h1>
            <p className="text-2xl tracking-wide">
              Đặt hàng ngay để có một ngôi nhà xanh và tươi mới
            </p>
            <p className="text-gray-400">
              Cây xanh khỏe mạnh và đẹp cho không gian trong nhà hoặc ngoài trời
              của bạn. Cải thiện môi trường sống của bạn với cây xanh tươi tốt.
              Đặt hàng ngay và được giảm giá 20% cho lần mua đầu tiên.
            </p>
            {/*button section*/}
            <div className="flex justify-center md:justify-start">
              {userId ? (
                <Link to="/cart" className="primary-btn flex items-center gap-2">
                  <IoBagHandleOutline />
                  Đặt hàng ngay
                </Link>
              ) : (
                <Link to="/sign-in" className="primary-btn flex items-center gap-2">
                  <IoBagHandleOutline />
                  Đặt hàng ngay
                </Link>
              )}
            </div>

          </div>
        </div>
        {/*tree image*/}
        <div className="flex justify-center items-center">
          <img
            src={Imgtree}
            alt="Imgtree"
            className="w-[350px] md:w-[550px] drop-shadow"
          />
        </div>
        {/*leaf image*/}
        <div className="absolute top-14 md:top-0 right-1/2 blur-sm opacity-80 rotate-[40deg]">
          <img
            src={Imgleaf}
            alt="Imgtree"
            className="w-full md:max-w-[300px]"
          />
        </div>
      </div>
    </section>
  );
}
