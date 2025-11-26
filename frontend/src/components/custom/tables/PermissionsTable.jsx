import React, { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";

const PermissionsTable = () => {
  const MODULE_GROUPS = {
    OVERVIEW: [
      {
        module: "Dashboard",
        key: "main_dashboard",
      },
    ],
    TICKETING: [
      {
        module: "Tickets",
        key: "tickets",
      },
      {
        module: "Services",
        key: "services",
      },
    ],
  };
  const ACTIONS = [
    { key: "view", label: "View" },
    { key: "add", label: "Add" },
    { key: "update", label: "Update" },
    { key: "delete", label: "Delete" },
  ];

  useEffect(() => {
    console.log(Object.entries(MODULE_GROUPS));
  }, []);
  return (
    <div className="overflow-x-auto rounded-lg border border-border mt-2">
      <table className="w-full">
        <thead>
          <tr className="bg-primary border-b border-border">
            <th className="px-6 py-3 text-left">
              <span className="text-md font-semibold text-white">Module</span>
            </th>
            {ACTIONS.map((action) => (
              <th key={action.key} className="px-4 py-3 text-center">
                <span className="text-md font-semibold text-white">
                  {action.label}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(MODULE_GROUPS).map(([moduleGroupName, modules]) => (
            <React.Fragment key={moduleGroupName}>
              <tr className="bg-primary/10 border-b-2 border-primary">
                <td colSpan={ACTIONS.length + 1} className="px-6 py-3">
                  <span className="font-bold text-md text-foreground uppercase tracking-wide">
                    {moduleGroupName}
                  </span>
                </td>
              </tr>
              {modules.map((moduleItem) => (
                <tr
                  key={`${moduleGroupName}-${moduleItem.key}`}
                  className="border-b border-border hover:bg-secondary/10"
                >
                  <td className="px-6 py-2">
                    <div>
                      <p className="font-medium text-foreground">
                        {moduleItem.module}
                      </p>
                    </div>
                  </td>
                  {ACTIONS.map((action) => (
                    <td key={action.key} className="px-4 py-4 text-center">
                      <div className="flex justify-center">
                        <Checkbox
                          id={`${moduleItem.key}-${action.key}`}
                          // checked={
                          //   permissions[moduleItem.key]?.[action.key] ?? false
                          // }
                          // onCheckedChange={(checked) =>
                          //   onPermissionChange(
                          //     moduleItem.key,
                          //     action.key,
                          //     checked
                          //   )
                          // }
                          className="h-5 w-5 border-3 border-primary/50 hover:border-primary"
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PermissionsTable;
