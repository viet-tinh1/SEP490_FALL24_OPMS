import { IoBagHandleOutline } from "react-icons/io5";
import Imgleaf from "../assets/img/leaf.png";
import Imgtree from "../assets/img/tree.png";

export default function Banner() {
  return (
    <section>
      <div className="container grid grid-cols-1 md:grid-cols-2 min-h-[650px] relative">
        {/*brand infor*/}
        <div className="flex flex-col justify-center py-14 md:py-0 relative z-10">
          <div className="text-center md:text-left space-y-6 lg:max-w-[400px]:">
            <h1 className="text-5xl lg:text-6xl font-bold leading-relaxed xl:leading-loose font-averia">
              Vibrant
              <br />
              Green <span className="text-secondary">Plants</span>
            </h1>
            <p className="text-2xl tracking-wide">
              Order Now For a Green and Fresh Home
            </p>
            <p className="text-gray-400">
              Healthy and beautiful plants for your indoor or outdoor space.
              Enhance your living environment with vibrant greenery. Order now
              and get 20% off on your first purchase.
            </p>
            {/*button section*/}
            <div className="flex justify-center md:justify-start">
              <button className="primary-btn flex items-center gap-2">
                <IoBagHandleOutline />
                Order Now
              </button>
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
