import React, { FC } from "react";

const reqs: { name: string; pass: boolean }[] = [
  {
    name: "Worker support",
    test: () => "Worker" in window,
  },
  {
    name: "File reader",
    test: () => "text" in File.prototype,
  },
].map((req) => ({ name: req.name, pass: req.test() }));

export const CompatGate: FC = ({ children, ...props }) => {
  if (reqs.every((req) => req.pass)) {
    return <>{children}</>;
  }

  return (
    <div {...props} className="h-full overflow-y-auto">
      <div className="h-full flex items-center justify-center overflow-y-auto">
        <div className="w-full max-w-xl">
          <div className="text-4xl md:text-6xl font-bold tracking-tighter">
            Incompatible browser
          </div>
          <div className="mt-6">
            Try updating your browser, or download Firefox
          </div>
          <div className="mt-3 text-sm text-gray-500">
            {reqs.map((req) => {
              return (
                <div key={req.name}>
                  {req.name} &rarr;{" "}
                  {req.pass ? "pass" : <b className="text-red-600">fail</b>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompatGate;
