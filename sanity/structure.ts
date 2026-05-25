import type { StructureResolver } from "sanity/structure";
import { SINGLETONS } from "../config/singletons/singletons";
import { LANGUAGES } from "../config/i18n/i18nConfig";
import { DocumentIcon } from "@sanity/icons";
import { apiVersion } from "./env";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";

// https://www.sanity.io/docs/structure-builder-cheat-sheet

// Define singleton documents and their translations
export const structure: StructureResolver = (S, context) =>
    S.list()
        .title("Content")
        .items([
            ...SINGLETONS.map((singleton) =>
                S.listItem()
                    .title(singleton.title)
                    .id(singleton.id)
                    .child(
                        S.list()
                            .title(singleton.title)
                            .id(singleton.id)
                            .items(
                                LANGUAGES.map((language) =>
                                    S.documentListItem()
                                        .schemaType(singleton._type)
                                        .id(`${singleton.id}-${language.id}`)
                                        .title(
                                            `${singleton.title} (${language.id.toLocaleUpperCase()})`,
                                        ),
                                ),
                            )
                            .canHandleIntent(
                                (intentName, params) =>
                                    intentName === "edit" &&
                                    params.id.startsWith(singleton.id),
                            ),
                    ),
            ),
            S.listItem()
                .title("Pages (EN)")
                .id("pages-en")
                .icon(DocumentIcon)
                .child(
                    S.documentList()
                        .title("Pages (EN)")
                        .filter('_type == "page" && language == "en"')
                        .apiVersion(apiVersion)
                        .initialValueTemplates([
                            S.initialValueTemplateItem("page-en"),
                        ]),
                ),
            S.listItem()
                .title("Pages (ES)")
                .id("pages-es")
                .icon(DocumentIcon)
                .child(
                    S.documentList()
                        .title("Pages (ES)")
                        .filter('_type == "page" && language == "es"')
                        .apiVersion(apiVersion)
                        .initialValueTemplates([
                            S.initialValueTemplateItem("page-es"),
                        ]),
                ),
            S.listItem()
                .title("Projects (EN)")
                .id("projects-en")
                .icon(DocumentIcon)
                .child(
                    S.documentList()
                        .title("Projects (EN)")
                        .filter('_type == "project" && language == "en"')
                        .apiVersion(apiVersion)
                        .initialValueTemplates([
                            S.initialValueTemplateItem("project-en"),
                        ]),
                ),
            S.listItem()
                .title("Projects (ES)")
                .id("projects-es")
                .icon(DocumentIcon)
                .child(
                    S.documentList()
                        .title("Projects (ES)")
                        .filter('_type == "project" && language == "es"')
                        .apiVersion(apiVersion)
                        .initialValueTemplates([
                            S.initialValueTemplateItem("project-es"),
                        ]),
                ),
            S.listItem()
                .title("Services")
                .id("services-projects")
                .icon(DocumentIcon)
                .child(
                    S.documentList()
                        .title("Services")
                        .filter('_type == "service"')
                        .apiVersion(apiVersion),
                ),
            orderableDocumentListDeskItem({
                type: "project",
                title: "Order Projects",
                id: "orderable-projects",
                createIntent: true,
                S,
                context,
                
            }),
            //CREATE ADDITIONAL LIST ITEMS FOR OTHER DOCUMENT TYPES BELOW
            // S.listItem()
            //   .title('Pages (ES)')
            //   .id('pages-es')
            //   .icon(DocumentIcon)
            //   .child(
            //     S.documentList()
            //       .title('Pages (ES)')
            //       .filter('_type == "page" && language == "es"')
            // ),
            // S.listItem()
            //   .title('Pages (EN)')
            //   .id('pages-en')
            //   .icon(DocumentIcon)
            //   .child(
            //     S.documentList()
            //       .title('Pages (EN)')
            //       .filter('_type == "page" && language == "en"')
            // ),
        ]);
