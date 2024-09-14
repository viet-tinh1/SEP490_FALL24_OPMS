import Banner from "../components/Banner";
import PlantIteam from "../components/PlantIteam";
import { Link } from "react-router-dom";
export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <Banner />

      {/* Plant Item*/}
      <div className="max-w-5xl mx-auto p- flex flex-col gap-8 my-10">
        <div>
          <div className="my-3">
            <h2 className="text-2xl font-semibold text-slate-600">
              Best Seller
            </h2>
            <Link
              className="text-sm text-blue-800 hover:underline"
              to={"/search?offer=true"}
            >
              Show more Product
            </Link>
          </div>
          <div className="flex flex-wrap gap-4">
            <PlantIteam />
          </div>
         
        </div>
      </div>
      
    </div>
  );
}