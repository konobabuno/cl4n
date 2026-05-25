"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import FilterbarProjects from "./FilterbarProjects";

type ProjectsCtx = {
    gridOrList: "grid" | "list";
    order: "asc" | "desc";
} | undefined;

const ProjectsContext = createContext<ProjectsCtx>(undefined);
export const useProjects = () => useContext(ProjectsContext);

export default function InnerProjectsPage({
    children,
    services,
}: {
    readonly children: React.ReactNode;
    services?: string[];
  
}) {
    const [gridOrList, setGridOrList] = useState<"grid" | "list">("list");
    const [order, setOrder] = useState<"asc" | "desc">("asc");



    return (
        <ProjectsContext.Provider value={{ gridOrList, order }}>
            <div className="container p-lat">
                <FilterbarProjects
                    services={services}
                    setGridOrListAction={setGridOrList}
                    setOrderAction={setOrder}
                    order={order}
                    gridOrList={gridOrList}
                />
                <div className="pt-blue">
                    {children}
                </div>
            </div>
        </ProjectsContext.Provider>
    );
}
