import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Finance CRM MVP" },
    { name: "description", content: "Welcome to Finance CRM MVP" },
  ];
};

export default function Index() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Finance CRM MVP</h1>
        <p className="text-gray-600">Your modern CRM solution is being built...</p>
      </div>
    </div>
  );
}

