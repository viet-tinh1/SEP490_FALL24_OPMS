import Banner from "../components/Banner";
import PlantItem from "../components/PlantIteam";
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
            Bán chạy nhất
            </h2>
                      
          </div>         
            <PlantItem />        

        </div>
      </div>
      
    </div>
  );
}
