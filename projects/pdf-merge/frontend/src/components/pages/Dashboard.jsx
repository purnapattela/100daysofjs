import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "react-router";

export default function Dashboard() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        PDF tools the one stop solution for all your pdf transformations
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 gap-6">
        <Link to="/merge-pdf">
          <Card className="cursor-pointer hover:shadow-lg transition bg-white">
            <CardHeader>
              <CardTitle className="text-xl text-black font-mono text-2xl underline ">
                Merge PDF
              </CardTitle>
            </CardHeader>
            <CardContent className={"text-black text-xl font-mono"}>
              Combine multiple PDF files into one.
            </CardContent>
          </Card>
        </Link>

        {/* Add more cards for other tools */}
      </div>
    </div>
  );
}
