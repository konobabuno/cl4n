"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import FilterbarNew from "./FilterbarNew";

type ProjectsCtx = {
    gridOrList: "grid" | "list";
    order: "asc" | "desc" | "alphabetical";
} | undefined;


const ProjectsContext = createContext<ProjectsCtx>(undefined);
export const useProjects = () => useContext(ProjectsContext);

export default function InnerProjectsPage({
    children,
    tags,
    serviceSlug,
}: {
    readonly children: React.ReactNode;
    tags: SanityTag[];
    serviceSlug: string;
}) {
    const [gridOrList, setGridOrList] = useState<"grid" | "list">("grid");
    const [order, setOrder] = useState<"asc" | "desc" | "alphabetical">("asc");

    return (
        <ProjectsContext.Provider value={{ gridOrList, order }}>
            <div className="container p-lat">
                <FilterbarNew
                    tags={tags}
                    serviceSlug={{ current: serviceSlug }}
                    setOrderAction={setOrder}
                    order={order}
                    setGridOrListAction={setGridOrList}
                    gridOrList={gridOrList}
                />
                <div className="row justify-center pt-blue min-h-[calc(100vh-300px)] relative">
                    <div className="w-full lg:w-9/12">
                        {children}
                    </div>
                </div>
            </div>
        </ProjectsContext.Provider>
    );
}
